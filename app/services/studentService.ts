import Student from '../models/student.js'
import { BadRequestException } from '../exceptions/badRequest.js'
import { NotFoundException } from '../exceptions/notFound.js'
import { IStudent } from '../interfaces/index.js'
import { isValidUUID } from '../utils/index.js'
import { UnprocessableEntityException } from '#exceptions/unprocessableEntity'

export class StudentService {
  async create(studentData: IStudent) {
    const requiredFields = ['name', 'email', 'registration', 'birthDate'] as const

    const missingFields = requiredFields.filter(
      (field) => studentData[field] === undefined || studentData[field] === null
    )

    if (missingFields.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missingFields.join(', ')}`)
    }

    const existingStudent = await Student.query().where('email', studentData.email).first()

    if (existingStudent) {
      throw new UnprocessableEntityException('A student with this email already exists')
    }

    const createStudent = await Student.create(studentData)

    return createStudent
  }

  async findById(id: string) {
    if(!isValidUUID(id)) {
      throw new NotFoundException('Student not found');
    }

    const student = await Student.find(id)

    if (!student) {
      throw new NotFoundException('Student not found')
    }

    return student
  }

  async getClassrooms(id: string) {
    if(!isValidUUID(id)) {
      throw new NotFoundException('Student not found');
    }

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
    if(!isValidUUID(id)) {
      throw new NotFoundException('Student not found');
    }

    const student = await Student.find(id)

    if (!student) {
      throw new NotFoundException('Student not found')
    }

    student.merge(updateData)
    await student.save()

    return student
  }

  async delete(id: string) {
    if(!isValidUUID(id)) {
      throw new NotFoundException('Student not found');
    }

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
