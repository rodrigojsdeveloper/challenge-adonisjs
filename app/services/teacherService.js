export class TeacherService {
  constructor(teacherRepository, classroomRepository) {
    this.teacherRepository = teacherRepository;
    this.classroomRepository = classroomRepository;
  }

  async create(teacherData) {
    const { name, email, registration, birthDate } = teacherData;

    if (!name || !email || !registration || !birthDate) {
      throw new Error('Missing required fields');
    }

    const teacher = await this.teacherRepository.create(teacherData);

    return teacher;
  }

  async findById(id) {
    const teacher = await this.teacherRepository.find(id);

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    return teacher;
  }

  async update(id, updateData) {
    const teacher = await this.teacherRepository.find(id);

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const updateTeacher = await this.teacherRepository.update(teacher.id, updateData);

    return updateTeacher;
  }

  async delete(id) {
    const teacher = await this.teacherRepository.find(id);

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    if (teacher.classrooms && teacher.classrooms.length > 0) {
      throw new BusinessRuleError(
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
