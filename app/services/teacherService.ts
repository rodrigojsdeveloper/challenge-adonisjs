import Teacher from '../models/teacher.js'
import { BadRequestException } from '../exceptions/badRequest.js'
import { NotFoundException } from '../exceptions/notFound.js'
import { UnprocessableEntityException } from '../exceptions/unprocessableEntity.js'

export class TeacherService {
  async create(teacherData: Record<string, any>) {
    const { name, email, registration, birthDate } = teacherData;

    if (!name || !email || !registration || !birthDate) {
      throw new BadRequestException('Missing required fields');
    }

    const teacher = await Teacher.create(teacherData);

    return teacher;
  }

  async findById(id: string) {
    const teacher = await Teacher.find(id);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async update(id: string, updateData: Record<string, any>) {
    const teacher = await Teacher.find(id);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    teacher.merge(updateData);
    await teacher.save();

    return teacher;
  }

  async delete(id: string) {
    const teacher = await Teacher.find(id);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (teacher.classrooms && teacher.classrooms.length > 0) {
      throw new UnprocessableEntityException(
        'Cannot delete teacher with existing classrooms. Please delete all classrooms first.'
      );
    }

    await teacher.delete();

    return {
      success: true,
      message: 'Teacher deleted successfully'
    };
  }
}
