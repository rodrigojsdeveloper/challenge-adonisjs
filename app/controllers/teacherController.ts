import type { HttpContext } from "@adonisjs/core/http";
import { TeacherService } from "../services/teacherService.js";

const teacherService = new TeacherService();

export class TeacherController {
  async create({ request, response }: HttpContext) {
    const teacherData = request.only(["name", "email", "registration", "birthDate"]);

    const teacher = await teacherService.create(teacherData);

    return response.status(201).json(teacher);
  }

  async findById({ request, response }: HttpContext) {
    const { id } = request.params();

    const teacher = await teacherService.findById(id);

    return response.json(teacher);
  }

  async update({ request, response }: HttpContext) {
    const { id } = request.params();
    const teacherData = request.only(["name", "email", "registration", "birthDate"]);

    const updateTeacher = await teacherService.update(id, teacherData);

    return response.json(updateTeacher);
  }

  async delete({ request, response }: HttpContext) {
    const { id } = request.params();

    await teacherService.delete(id);

    return response.noContent();
  }
}
