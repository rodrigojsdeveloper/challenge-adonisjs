import { DateTime } from "luxon";
import { BaseModel, beforeCreate, column, hasMany } from "@adonisjs/lucid/orm";
import { v4 as uuidv4 } from "uuid";
import Classroom from "./classroom.js";
import type { HasMany } from "@adonisjs/lucid/types/relations";

export default class Teacher extends BaseModel {
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
  public static assignUuid(teacher: Teacher) {
    teacher.id = uuidv4();
  }

  @hasMany(() => Classroom, {
    foreignKey: "teacherId",
  })
  public classrooms!: HasMany<typeof Classroom>;
}
