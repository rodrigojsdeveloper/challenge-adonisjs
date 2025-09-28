import Student from "../models/student.js";
import Teacher from "../models/teacher.js";
import Classroom from "../models/classroom.js";
import { BadRequestException } from "../exceptions/badRequest.js";
import { NotFoundException } from "../exceptions/notFound.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { UnprocessableEntityException } from "../exceptions/unprocessableEntity.js";
import { ClassroomProps } from "../interfaces/index.js";
import { isValidUUID } from "../utils/index.js";
import { BaseModel } from "@adonisjs/lucid/orm";

export class ClassroomService {
  private validateUUID(id: string, entityName: string) {
    if (!isValidUUID(id)) {
      throw new NotFoundException(`${entityName} not found`);
    }
  }

  private async findEntity<T extends typeof BaseModel>(Model: T, id: string, entityName: string) {
    const entity = await Model.find(id);
    if (!entity) {
      throw new NotFoundException(`${entityName} not found`);
    }
    return entity;
  }

  private validateOwnership(classroom: ClassroomProps, teacherId: string) {
    if (classroom.teacherId !== teacherId) {
      throw new UnauthorizedException(
        "Teacher cannot perform this action on a classroom they do not own"
      );
    }
  }

  async create(classroomData: ClassroomProps) {
    const requiredFields = ["roomNumber", "capacity", "isAvailable", "teacherId"] as const;

    const missingFields = requiredFields.filter(
      (field) => classroomData[field] === undefined || classroomData[field] === null
    );
    if (missingFields.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missingFields.join(", ")}`);
    }

    this.validateUUID(classroomData.teacherId, "Teacher");
    await this.findEntity(Teacher, classroomData.teacherId, "Teacher");

    const existingClassroom = await Classroom.query()
      .where("roomNumber", classroomData.roomNumber)
      .first();
    if (existingClassroom) {
      throw new UnprocessableEntityException("A classroom with this room number already exists");
    }

    const createClassroom = await Classroom.create(classroomData);
    return createClassroom;
  }

  async findById(id: string) {
    this.validateUUID(id, "Classroom");

    const classroom = await this.findEntity(Classroom, id, "Classroom");
    return classroom;
  }

  async update(id: string, updateData: Partial<ClassroomProps>, teacherId: string) {
    this.validateUUID(id, "Classroom");
    this.validateUUID(teacherId, "Teacher");

    const classroom = await this.findEntity(Classroom, id, "Classroom");
    const teacher = await this.findEntity(Teacher, teacherId, "Teacher");

    this.validateOwnership(classroom, teacher.id);

    if (updateData.roomNumber && updateData.roomNumber !== classroom.roomNumber) {
      const existingClassroom = await Classroom.query()
        .where("roomNumber", updateData.roomNumber)
        .first();

      if (existingClassroom) {
        throw new UnprocessableEntityException("A classroom with this room number already exists");
      }
    }

    classroom.merge(updateData);
    await classroom.save();
    return classroom;
  }

  async delete(classroomId: string, teacherId: string) {
    this.validateUUID(classroomId, "Classroom");
    this.validateUUID(teacherId, "Teacher");

    const classroom = await Classroom.query().where("id", classroomId).preload("students").first();
    if (!classroom) {
      throw new NotFoundException("Classroom not found");
    }

    const teacher = await this.findEntity(Teacher, teacherId, "Teacher");

    this.validateOwnership(classroom, teacher.id);

    if (classroom.students && classroom.students.length > 0) {
      throw new UnprocessableEntityException(
        "Cannot delete classroom with allocated students. Please remove all students first."
      );
    }

    await classroom.delete();
  }

  async getStudents(classroomId: string, teacherId: string) {
    this.validateUUID(classroomId, "Classroom");
    this.validateUUID(teacherId, "Teacher");

    const classroom = await Classroom.query().where("id", classroomId).preload("students").first();
    if (!classroom) {
      throw new NotFoundException("Classroom not found");
    }

    const teacher = await this.findEntity(Teacher, teacherId, "Teacher");

    this.validateOwnership(classroom, teacher.id);

    return classroom.students;
  }

  async addStudent(classroomId: string, studentId: string, teacherId: string) {
    this.validateUUID(classroomId, "Classroom");
    this.validateUUID(teacherId, "Teacher");
    this.validateUUID(studentId, "Student");

    const classroom = await Classroom.query().where("id", classroomId).preload("students").first();
    if (!classroom) {
      throw new NotFoundException("Classroom not found");
    }

    const teacher = await this.findEntity(Teacher, teacherId, "Teacher");
    const student = await this.findEntity(Student, studentId, "Student");

    this.validateOwnership(classroom, teacher.id);

    if (!classroom.isAvailable) {
      throw new UnprocessableEntityException("Classroom is not available for student allocation");
    }

    const isStudentAlreadyAllocated = classroom.students.some((s) => s.id === student.id);
    if (isStudentAlreadyAllocated) {
      throw new UnprocessableEntityException("Student already allocated in this classroom");
    }

    if (classroom.students.length >= classroom.capacity) {
      throw new UnprocessableEntityException("Classroom is full");
    }

    await classroom.related("students").attach([student.id]);
    return {
      success: true,
      message: "Student added successfully to classroom",
    };
  }

  async deleteStudent(classroomId: string, studentId: string, teacherId: string) {
    this.validateUUID(classroomId, "Classroom");
    this.validateUUID(teacherId, "Teacher");
    this.validateUUID(studentId, "Student");

    const classroom = await Classroom.query().where("id", classroomId).preload("students").first();
    if (!classroom) {
      throw new NotFoundException("Classroom not found");
    }

    const teacher = await this.findEntity(Teacher, teacherId, "Teacher");
    const student = await this.findEntity(Student, studentId, "Student");

    this.validateOwnership(classroom, teacher.id);

    const isStudentInClassroom = classroom.students.some((s) => s.id === student.id);
    if (!isStudentInClassroom) {
      throw new NotFoundException("Student does not exist in this classroom");
    }

    await classroom.related("students").detach([student.id]);
    return {
      success: true,
      message: "Student removed successfully from classroom",
    };
  }
}
