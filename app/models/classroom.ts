import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import Student from './student.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Teacher from './teacher.js'

export default class Classroom extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare roomNumber: string

  @column()
  declare capacity: number

  @column()
  declare isAvailable: boolean

  @column()
  declare teacherId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  public static assignUuid(classroom: Classroom) {
    classroom.id = uuidv4()
  }

  @hasMany(() => Student, {
    foreignKey: 'classroomId',
  })
  public students!: HasMany<typeof Student>

  @belongsTo(() => Teacher, {
    foreignKey: 'teacherId',
  })
  public teacher!: BelongsTo<typeof Teacher>
}
