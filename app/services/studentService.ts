import Student from '../models/student.js'
import { BadRequestException } from '../exceptions/badRequest.js'
import { NotFoundException } from '../exceptions/notFound.js'
import { IStudent } from '../interfaces/index.js'

export class StudentService {
  public async create(studentData: IStudent) {
    const { name, email, registration, birthDate } = studentData

    if (!name || !email || !registration || !birthDate) {
      throw new BadRequestException('Missing required fields')
    }

    const student = await Student.create(studentData)

    return student
  }

  async findById(id: string) {
    const student = await Student.find(id)

    if (!student) {
      throw new NotFoundException('Student not found')
    }

    return student
  }

  async getClassrooms(id: string) {
    const student = await Student.query()
      .where('id', id)
      .preload('classrooms', (classroomsQuery) => {
        classroomsQuery.preload('teacher')
      })
      .first()

    if (!student) {
      throw new NotFoundException('Student not found')
    }

    return {
      studentName: student.name,
      classrooms: student.classrooms?.map((classroom) => ({
        teacherName: classroom.teacher.name,
        roomNumber: classroom.roomNumber,
      })),
    }
  }

  async update(id: string, updateData: Partial<IStudent>) {
    const student = await Student.find(id)

    if (!student) {
      throw new NotFoundException('Student not found')
    }

    student.merge(updateData)
    await student.save()

    return student
  }

  async delete(id: string) {
    const student = await Student.find(id)

    if (!student) {
      throw new NotFoundException('Student not found')
    }

    await student.delete()

    return {
      success: true,
      message: 'Student deleted successfully',
    }
  }
}
