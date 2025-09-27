// Fallback type when '@ioc:Adonis/Core/HttpContext' is not available in the environment
type HttpContextContract = any
import { ClassroomService } from '../services/classroomService.js'

const classroomService = new ClassroomService()

export class ClassroomController {
  async create({ request, response }: HttpContextContract) {
    const classroomData = request.only(['roomNumber', 'capacity', 'isAvailable', 'teacherId'])

    const classroom = await classroomService.create(classroomData)

    return response.status(201).json(classroom)
  }

  async findById({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const classroom = await classroomService.findById(id)

    return response.json(classroom)
  }

  async update({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const classroomData = request.only(['roomNumber', 'capacity', 'isAvailable'])
    const teacherId = request.header('x-teacher-id')

    const updateClassroom = await classroomService.update(id, classroomData, teacherId)

    return response.json(updateClassroom)
  }

  async delete({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const teacherId = request.header('x-teacher-id')

    await classroomService.delete(id, teacherId)

    return response.status(204).send()
  }


  async getStudents({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const teacherId = request.header('x-teacher-id')

    const students = await classroomService.getStudents(id, teacherId)

    return response.json(students)
  }

  async addStudent({ request, response }: HttpContextContract) {
    const { id, studentId } = request.params()
    const teacherId = request.header('x-teacher-id')

    const result = await classroomService.addStudent(id, studentId, teacherId)

    return response.json(result)
  }

  async deleteStudent({ request, response }: HttpContextContract) {
    const { id, studentId } = request.params()
    const teacherId = request.header('x-teacher-id')

    const result = await classroomService.deleteStudent(id, studentId, teacherId)

    return response.json(result)
  }
}
