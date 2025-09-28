import Teacher from "../models/teacher.js";
import { BadRequestException } from "../exceptions/badRequest.js";
import { NotFoundException } from "../exceptions/notFound.js";
import { UnprocessableEntityException } from "../exceptions/unprocessableEntity.js";
import { TeacherProps } from "../interfaces/index.js";
import { isValidUUID } from "../utils/index.js";
import { BaseModel } from "@adonisjs/lucid/orm";

export class TeacherService {
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

  async create(teacherData: TeacherProps) {
    const requiredFields = ["name", "email", "registration", "birthDate"] as const;
    const missingFields = requiredFields.filter(
      (field) => teacherData[field] === undefined || teacherData[field] === null
    );

    if (missingFields.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const existingTeacher = await Teacher.query().where("email", teacherData.email).first();
    if (existingTeacher) {
      throw new UnprocessableEntityException("A teacher with this email already exists");
    }

    const createTeacher = await Teacher.create(teacherData);
    return createTeacher;
  }

  async findById(id: string) {
    this.validateUUID(id, "Teacher");
    const teacher = await this.findEntity(Teacher, id, "Teacher");
    return teacher;
  }

  async update(id: string, updateData: Partial<TeacherProps>) {
    this.validateUUID(id, "Teacher");

    const teacher = await this.findEntity(Teacher, id, "Teacher");
    teacher.merge(updateData);
    await teacher.save();

    return teacher;
  }

  async delete(id: string) {
    this.validateUUID(id, "Teacher");
    const teacher = await this.findEntity(Teacher, id, "Teacher");
    await teacher.delete();
  }
}
