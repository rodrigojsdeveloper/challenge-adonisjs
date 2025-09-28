import Teacher from '../models/teacher.js'
import { BadRequestException } from '../exceptions/badRequest.js'
import { NotFoundException } from '../exceptions/notFound.js'
import { UnprocessableEntityException } from '../exceptions/unprocessableEntity.js'
import { ITeacher } from '../interfaces/index.js';
import { isValidUUID } from '../utils/index.js';

export class TeacherService {
  async create(teacherData: ITeacher) {
    const requiredFields = ['name', 'email', 'registration', 'birthDate'] as const

    const missingFields = requiredFields.filter(
      (field) => teacherData[field] === undefined || teacherData[field] === null
    )

    if (missingFields.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missingFields.join(', ')}`)
    }

    const existingTeacher = await Teacher.query().where('email', teacherData.email).first()

    if (existingTeacher) {
      throw new UnprocessableEntityException('A teacher with this email already exists')
    }

    const createTeacher = await Teacher.create(teacherData);

    return createTeacher;
  }

  async findById(id: string) {
    if(!isValidUUID(id)) {
      throw new NotFoundException('Teacher not found');
    }

    const teacher = await Teacher.find(id);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async update(id: string, updateData: Partial<ITeacher>) {
    if(!isValidUUID(id)) {
      throw new NotFoundException('Teacher not found');
    }

    const teacher = await Teacher.find(id);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    teacher.merge(updateData);
    await teacher.save();

    return teacher;
  }

  async delete(id: string) {
    if(!isValidUUID(id)) {
      throw new NotFoundException('Teacher not found');
    }

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
