import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { BadRequestException } from './badRequest.js'
import { UnauthorizedException } from './unauthorized.js'
import { NotFoundException } from './notFound.js'
import { UnprocessableEntityException } from './unprocessableEntity.js'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof BadRequestException) {
      return ctx.response.status(400).send({ error: error.message })
    }

    if (error instanceof UnauthorizedException) {
      return ctx.response.status(403).send({ error: error.message })
    }

    if (error instanceof NotFoundException) {
      return ctx.response.status(404).send({ error: error.message })
    }

    if (error instanceof UnprocessableEntityException) {
      return ctx.response.status(422).send({ error: error.message })
    }

    return super.handle(error, ctx)
  }
}
