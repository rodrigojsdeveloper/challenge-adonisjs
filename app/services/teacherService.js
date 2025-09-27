import { BadRequestException } from 'App/exceptions/bad_request.js'
import { NotFoundException } from 'App/exceptions/not_found.js'
import { UnprocessableEntityException } from 'App/exceptions/unprocessable_entity.js'

export class TeacherService {
  constructor(teacherRepository, classroomRepository) {
    this.teacherRepository = teacherRepository;
    this.classroomRepository = classroomRepository;
  }

  async create(teacherData) {
    const { name, email, registration, birthDate } = teacherData;

    if (!name || !email || !registration || !birthDate) {
      throw new BadRequestException('Missing required fields');
    }

    const teacher = await this.teacherRepository.create(teacherData);

    return teacher;
  }

  async findById(id) {
    const teacher = await this.teacherRepository.find(id);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async update(id, updateData) {
    const teacher = await this.teacherRepository.find(id);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const updateTeacher = await this.teacherRepository.update(teacher.id, updateData);

    return updateTeacher;
  }

  async delete(id) {
    const teacher = await this.teacherRepository.find(id);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (teacher.classrooms && teacher.classrooms.length > 0) {
      throw new UnprocessableEntityException(
        'Cannot delete teacher with existing classrooms. Please delete all classrooms first.'
      );
    }

    await this.teacherRepository.delete(teacher.id);

    return {
      success: true,
      message: 'Teacher deleted successfully'
    };
  }
}
