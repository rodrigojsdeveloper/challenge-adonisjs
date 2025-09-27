import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import Student from './student.js'
import Teacher from './teacher.js'
import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'

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

  @belongsTo(() => Teacher, {
    foreignKey: 'teacherId',
  })
  public teacher!: BelongsTo<typeof Teacher>

  @manyToMany(() => Student, {
    pivotTable: 'classroom_student',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'classroom_id',
    pivotRelatedForeignKey: 'student_id',
  })
  public students!: ManyToMany<typeof Student>
}
