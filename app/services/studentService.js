export class StudentService {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  async create(studentData) {
    const { name, email, registration, birthDate } = studentData;

    if (!name || !email || !registration || !birthDate) {
      throw new Error('Missing required fields');
    }

    const student = await this.studentRepository.create(studentData);

    return student;
  }

  async findById(id) {
    const student = await this.studentRepository.find(id);

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  }

  async getClassrooms(id) {
    const student = await this.studentRepository.find(id, {
      preload: ['classrooms', 'classrooms.teacher']
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return {
      studentName: student.name,
      classrooms: student.classrooms.map(classroom => ({
        teacherName: classroom.teacher.name,
        roomNumber: classroom.roomNumber
      }))
    };
  }

  async update(id, updateData) {
    const student = await this.studentRepository.find(id);

    if (!student) {
      throw new Error('Student not found');
    }

    const updateStudent = await this.studentRepository.update(student.id, updateData);

    return updateStudent;
  }

  async delete(id) {
    const student = await this.studentRepository.find(id);

    if (!student) {
      throw new Error('Student not found');
    }

    await this.studentRepository.delete(student.id);

    return {
      success: true,
      message: 'Student deleted successfully'
    };
  }
}
