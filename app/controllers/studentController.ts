import type { HttpContext } from "@adonisjs/core/http";
import { StudentService } from "../services/studentService.js";

const studentService = new StudentService();

export class StudentController {
  async create({ request, response }: HttpContext) {
    const studentData = request.only(["name", "email", "registration", "birthDate"]);

    const student = await studentService.create(studentData);
    return response.status(201).json(student);
  }

  async findById({ request, response }: HttpContext) {
    const { id } = request.params();

    const student = await studentService.findById(id);
    return response.json(student);
  }

  async getClassrooms({ request, response }: HttpContext) {
    const { studentId } = request.params();

    const classrooms = await studentService.getClassrooms(studentId);
    return response.json(classrooms);
  }

  async update({ request, response }: HttpContext) {
    const { id } = request.params();
    const studentData = request.only(["name", "email", "registration", "birthDate"]);

    const updateStudent = await studentService.update(id, studentData);
    return response.json(updateStudent);
  }

  async delete({ request, response }: HttpContext) {
    const { id } = request.params();

    await studentService.delete(id);
    return response.noContent();
  }
}
