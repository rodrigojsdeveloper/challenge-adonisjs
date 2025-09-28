import { DateTime } from "luxon";
import { BaseModel, beforeCreate, column, manyToMany } from "@adonisjs/lucid/orm";
import { v4 as uuidv4 } from "uuid";
import Classroom from "./classroom.js";
import type { ManyToMany } from "@adonisjs/lucid/types/relations";

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare email: string;

  @column()
  declare registration: string;

  @column()
  declare birthDate: DateTime;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @beforeCreate()
  public static assignUuid(student: Student) {
    student.id = uuidv4();
  }

  @manyToMany(() => Classroom, {
    pivotTable: "classroom_student",
    localKey: "id",
    relatedKey: "id",
    pivotForeignKey: "student_id",
    pivotRelatedForeignKey: "classroom_id",
  })
  public classrooms!: ManyToMany<typeof Classroom>;
}
