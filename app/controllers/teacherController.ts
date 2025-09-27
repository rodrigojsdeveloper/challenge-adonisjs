// Fallback type when '@ioc:Adonis/Core/HttpContext' is not available in the environment
type HttpContextContract = any
import { TeacherService } from '../services/teacherService.js'

const teacherService = new TeacherService()

export class TeacherController {
  async create({ request, response }: HttpContextContract) {
    const teacherData = request.only(['name', 'email', 'registration', 'birthDate'])

    const teacher = await teacherService.create(teacherData)

    return response.status(201).json(teacher)
  }

  async findById({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const teacher = await teacherService.findById(id)

    return response.json(teacher)
  }

  async update({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const teacherData = request.only(['name', 'email', 'registration', 'birthDate'])

    const updateTeacher = await teacherService.update(id, teacherData)

    return response.json(updateTeacher)
  }

  async delete({ request, response }: HttpContextContract) {
    const { id } = request.params()

    await teacherService.delete(id)

    return response.status(204).send()
  }
}
