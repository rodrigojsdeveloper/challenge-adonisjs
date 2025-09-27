import { BadRequestException } from 'App/exceptions/bad_request.js'
import { NotFoundException } from 'App/exceptions/not_found.js'
import { UnauthorizedException } from 'App/exceptions/unauthorized.js'
import { UnprocessableEntityException } from 'App/exceptions/unprocessable_entity.js'

export class ClassroomService {
  constructor(classroomRepository, teacherRepository, studentRepository) {
    this.classroomRepository = classroomRepository;
    this.teacherRepository = teacherRepository;
    this.studentRepository = studentRepository;
  }

  async create(classroomData) {
    const { roomNumber, capacity, isAvailable, teacherId } = classroomData;

    if (!roomNumber || !capacity || !isAvailable || !teacherId) {
      throw new BadRequestException('Missing required fields');
    }

    const teacher = await this.teacherRepository.find(teacherId);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const existingClassroom = await this.classroomRepository.findByRoomNumber(
      classroomData.roomNumber
    );

    if (existingClassroom) {
      throw new UnprocessableEntityException('A classroom with this room number already exists');
    }

    const classroom = await this.classroomRepository.create(classroomData);

    return classroom;
  }

  async findById(id) {
    const classroom = await this.classroomRepository.find(id);

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    return classroom;
  }

  async update(id, updateData, teacherId) {
    const classroom = await this.classroomRepository.find(id);

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    const teacher = await this.teacherRepository.find(teacherId);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (updateData.roomNumber && updateData.roomNumber !== classroom.roomNumber) {
      const existingClassroom = await this.classroomRepository.findByRoomNumber(
        updateData.roomNumber
      );

      if (existingClassroom) {
        throw new UnprocessableEntityException('A classroom with this room number already exists');
      }
    }

    const updateClassroom = await this.classroomRepository.update(classroom.id, updateData);

    return updateClassroom;
  }

  async delete(classroomId, teacherId) {
    const classroom = await this.classroomRepository.find(classroomId, {
      preload: ['students']
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    const teacher = await this.teacherRepository.find(teacherId);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (classroom.teacherId !== teacher.id) {
      throw new UnauthorizedException('Teacher cannot remove students to a classroom they do not own');
    }

    if (classroom.students && classroom.students.length > 0) {
      throw new UnprocessableEntityException(
        'Cannot delete classroom with allocated students. Please remove all students first.'
      );
    }

    await this.classroomRepository.delete(classroom.id);

    return {
      success: true,
      message: 'Classroom deleted successfully'
    };
  }

  async getStudents(classroomId, teacherId) {
    const classroom = await this.classroomRepository.find(classroomId, {
      preload: ['students']
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    const teacher = await this.teacherRepository.find(teacherId);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (classroom.teacherId !== teacher.id) {
      throw new UnauthorizedException('Teacher cannot remove students to a classroom they do not own');
    }

    return classroom.students;
  }

  async addStudent(classroomId, studentId, teacherId) {
    const classroom = await this.classroomRepository.find(classroomId, {
      preload: ['students']
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    const teacher = await this.teacherRepository.find(teacherId);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (classroom.teacherId !== teacher.id) {
      throw new UnauthorizedException('Teacher cannot add students to a classroom they do not own');
    }

    const student = await this.studentRepository.find(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (!classroom.isAvailable) {
      throw new UnprocessableEntityException('Classroom is not available for student allocation');
    }

    const isStudentAlreadyAllocated = classroom.students.some(s => s.id === student.id)
    if (isStudentAlreadyAllocated) {
      throw new UnprocessableEntityException('Student already allocated in this classroom');
    }

    const currentStudentCount = classroom.students.length
    if (currentStudentCount >= classroom.capacity) {
      throw new UnprocessableEntityException('Classroom is full');
    }

    await classroom.related('students').attach([student.id]);

    return {
      success: true,
      message: 'Student added successfully to classroom'
    };
  }

  async deleteStudent(classroomId, studentId, teacherId) {
    const classroom = await this.classroomRepository.find(classroomId, {
      preload: ['students']
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    const teacher = await this.teacherRepository.find(teacherId);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (classroom.teacherId !== teacher.id) {
      throw new UnauthorizedException('Teacher cannot remove students to a classroom they do not own');
    }

    const student = await this.classroomRepository.find(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const isStudentInClassroom = classroom.students.some(s => s.id === student.id)
    if (isStudentInClassroom) {
      throw new UnprocessableEntityException('Student already allocated in this classroom');
    }

    await classroom.related('students').detach([student.id]);

    return {
      success: true,
      message: 'Student removed successfully from classroom'
    };
  }
}
