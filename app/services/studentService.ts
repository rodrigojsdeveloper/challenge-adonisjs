import Student from "../models/student.js";
import { BadRequestException } from "../exceptions/badRequest.js";
import { NotFoundException } from "../exceptions/notFound.js";
import { StudentProps } from "../interfaces/index.js";
import { UnprocessableEntityException } from "#exceptions/unprocessableEntity";
import { BaseModel } from "@adonisjs/lucid/orm";
import { validate as uuidValidate } from 'uuid';

export class StudentService {
  private validateUUID(id: string, entityName: string) {
    if (!uuidValidate(id)) {
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

  async create(studentData: StudentProps) {
    const requiredFields = ["name", "email", "registration", "birthDate"] as const;
    const missingFields = requiredFields.filter(
      (field) => studentData[field] === undefined || studentData[field] === null
    );

    if (missingFields.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const existingStudent = await Student.query().where("email", studentData.email).first();
    if (existingStudent) {
      throw new UnprocessableEntityException("A student with this email already exists");
    }

    const createStudent = await Student.create(studentData);
    return createStudent;
  }

  async findById(id: string) {
    this.validateUUID(id, "Student");
    const student = await this.findEntity(Student, id, "Student");
    return student;
  }

  async getClassrooms(id: string) {
    this.validateUUID(id, "Student");

    const student = await Student.query()
      .where("id", id)
      .preload("classrooms", (classroomsQuery) => {
        classroomsQuery.preload("teacher");
      })
      .first();
    if (!student) {
      throw new NotFoundException("Student not found");
    }

    return {
      studentName: student.name,
      classrooms: student.classrooms?.map((classroom) => ({
        teacherName: classroom.teacher.name,
        roomNumber: classroom.roomNumber,
      })),
    };
  }

  async update(id: string, updateData: Partial<StudentProps>) {
    this.validateUUID(id, "Student");

    const student = await this.findEntity(Student, id, "Student");
    student.merge(updateData);
    await student.save();

    return student;
  }

  async delete(id: string) {
    this.validateUUID(id, "Student");
    const student = await this.findEntity(Student, id, "Student");
    await student.delete();
  }
}
