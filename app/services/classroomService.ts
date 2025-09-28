import Student from "../models/student.js";
import Teacher from "../models/teacher.js";
import Classroom from "../models/classroom.js";
import { BadRequestException } from "../exceptions/badRequest.js";
import { NotFoundException } from "../exceptions/notFound.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { UnprocessableEntityException } from "../exceptions/unprocessableEntity.js";
import { ClassroomProps } from "../interfaces/index.js";
import { isValidUUID } from "../utils/index.js";

export class ClassroomService {
  async create(classroomData: ClassroomProps) {
    const requiredFields = ["roomNumber", "capacity", "isAvailable", "teacherId"] as const;

    const missingFields = requiredFields.filter(
      (field) => classroomData[field] === undefined || classroomData[field] === null
    );

    if (missingFields.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missingFields.join(", ")}`);
    }

    if (!isValidUUID(classroomData.teacherId)) {
      throw new NotFoundException("Teacher not found");
    }

    const teacher = await Teacher.find(classroomData.teacherId);

    if (!teacher) {
      throw new NotFoundException("Teacher not found");
    }

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
    if (!isValidUUID(id)) {
      throw new NotFoundException("Classroom not found");
    }

    const classroom = await Classroom.find(id);

    if (!classroom) {
      throw new NotFoundException("Classroom not found");
    }

    return classroom;
  }

  async update(id: string, updateData: Partial<ClassroomProps>, teacherId: string) {
    if (!isValidUUID(id)) {
      throw new NotFoundException("Classroom not found");
    }

    if (!isValidUUID(teacherId)) {
      throw new NotFoundException("Teacher not found");
    }

    const classroom = await Classroom.find(id);

    if (!classroom) {
      throw new NotFoundException("Classroom not found");
    }

    const teacher = await Teacher.find(teacherId);

    if (!teacher) {
      throw new NotFoundException("Teacher not found");
    }

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
    if (!isValidUUID(classroomId)) {
      throw new NotFoundException("Classroom not found");
    }

    if (!isValidUUID(teacherId)) {
      throw new NotFoundException("Teacher not found");
    }

    const classroom = await Classroom.query().where("id", classroomId).preload("students").first();

    if (!classroom) {
      throw new NotFoundException("Classroom not found");
    }

    const teacher = await Teacher.find(teacherId);

    if (!teacher) {
      throw new NotFoundException("Teacher not found");
    }

    if (classroom.teacherId !== teacher.id) {
      throw new UnauthorizedException(
        "Teacher cannot remove students to a classroom they do not own"
      );
    }

    if (classroom.students && classroom.students.length > 0) {
      throw new UnprocessableEntityException(
        "Cannot delete classroom with allocated students. Please remove all students first."
      );
    }

    await classroom.delete();

    return {
      success: true,
      message: "Classroom deleted successfully",
    };
  }

  async getStudents(classroomId: string, teacherId: string) {
    if (!isValidUUID(classroomId)) {
      throw new NotFoundException("Classroom not found");
    }

    if (!isValidUUID(teacherId)) {
      throw new NotFoundException("Teacher not found");
    }

    const classroom = await Classroom.query().where("id", classroomId).preload("students").first();

    if (!classroom) {
      throw new NotFoundException("Classroom not found");
    }

    const teacher = await Teacher.find(teacherId);

    if (!teacher) {
      throw new NotFoundException("Teacher not found");
    }

    if (classroom.teacherId !== teacher.id) {
      throw new UnauthorizedException(
        "Teacher cannot remove students to a classroom they do not own"
      );
    }

    return classroom.students;
  }

  async addStudent(classroomId: string, studentId: string, teacherId: string) {
    if (!isValidUUID(classroomId)) {
      throw new NotFoundException("Classroom not found");
    }

    if (!isValidUUID(teacherId)) {
      throw new NotFoundException("Teacher not found");
    }

    if (!isValidUUID(studentId)) {
      throw new NotFoundException("Student not found");
    }

    const classroom = await Classroom.query().where("id", classroomId).preload("students").first();

    if (!classroom) {
      throw new NotFoundException("Classroom not found");
    }

    const teacher = await Teacher.find(teacherId);

    if (!teacher) {
      throw new NotFoundException("Teacher not found");
    }

    if (classroom.teacherId !== teacher.id) {
      throw new UnauthorizedException("Teacher cannot add students to a classroom they do not own");
    }

    const student = await Student.find(studentId);

    if (!student) {
      throw new NotFoundException("Student not found");
    }

    if (!classroom.isAvailable) {
      throw new UnprocessableEntityException("Classroom is not available for student allocation");
    }

    const isStudentAlreadyAllocated = classroom.students.some((s) => s.id === student.id);
    if (isStudentAlreadyAllocated) {
      throw new UnprocessableEntityException("Student already allocated in this classroom");
    }

    const currentStudentCount = classroom.students.length;
    if (currentStudentCount >= classroom.capacity) {
      throw new UnprocessableEntityException("Classroom is full");
    }

    await classroom.related("students").attach([student.id]);

    return {
      success: true,
      message: "Student added successfully to classroom",
    };
  }

  async deleteStudent(classroomId: string, studentId: string, teacherId: string) {
    if (!isValidUUID(classroomId)) {
      throw new NotFoundException("Classroom not found");
    }

    if (!isValidUUID(teacherId)) {
      throw new NotFoundException("Teacher not found");
    }

    if (!isValidUUID(studentId)) {
      throw new NotFoundException("Student not found");
    }

    const classroom = await Classroom.query().where("id", classroomId).preload("students").first();

    if (!classroom) {
      throw new NotFoundException("Classroom not found");
    }

    const teacher = await Teacher.find(teacherId);

    if (!teacher) {
      throw new NotFoundException("Teacher not found");
    }

    if (classroom.teacherId !== teacher.id) {
      throw new UnauthorizedException(
        "Teacher cannot remove students to a classroom they do not own"
      );
    }

    const student = await Student.find(studentId);

    if (!student) {
      throw new NotFoundException("Student not found");
    }

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
