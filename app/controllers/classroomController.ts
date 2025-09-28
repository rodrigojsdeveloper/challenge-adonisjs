import type { HttpContext } from "@adonisjs/core/http";
import { ClassroomService } from "../services/classroomService.js";

const classroomService = new ClassroomService();

export class ClassroomController {
  private getTeacherId(request: HttpContext["request"]): string {
    return request.header("x-teacher-id")!;
  }

  async create({ request, response }: HttpContext) {
    const classroomData = request.only(["roomNumber", "capacity", "isAvailable"]);
    const teacherId = this.getTeacherId(request);

    const classroom = await classroomService.create({ ...classroomData, teacherId });
    return response.status(201).json(classroom);
  }

  async findById({ request, response }: HttpContext) {
    const { id } = request.params();

    const classroom = await classroomService.findById(id);
    return response.json(classroom);
  }

  async update({ request, response }: HttpContext) {
    const { id } = request.params();
    const classroomData = request.only(["roomNumber", "capacity", "isAvailable"]);
    const teacherId = this.getTeacherId(request);

    const updateClassroom = await classroomService.update(id, classroomData, teacherId);
    return response.json(updateClassroom);
  }

  async delete({ request, response }: HttpContext) {
    const { id } = request.params();
    const teacherId = this.getTeacherId(request);

    await classroomService.delete(id, teacherId);
    return response.noContent();
  }

  async getStudents({ request, response }: HttpContext) {
    const { classroomId } = request.params();
    const teacherId = this.getTeacherId(request);

    const students = await classroomService.getStudents(classroomId, teacherId);
    return response.json(students);
  }

  async addStudent({ request, response }: HttpContext) {
    const { classroomId, studentId } = request.params();
    const teacherId = this.getTeacherId(request);

    const result = await classroomService.addStudent(classroomId, studentId, teacherId);
    return response.json(result);
  }

  async deleteStudent({ request, response }: HttpContext) {
    const { classroomId, studentId } = request.params();
    const teacherId = this.getTeacherId(request);

    const result = await classroomService.deleteStudent(classroomId, studentId, teacherId);
    return response.json(result);
  }
}
