import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ClassroomStudents extends BaseSchema {
  protected tableName = 'classroom_student'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .uuid('classroom_id')
        .notNullable()
        .references('id')
        .inTable('classrooms')
        .onDelete('CASCADE')

      table
        .uuid('student_id')
        .notNullable()
        .references('id')
        .inTable('students')
        .onDelete('CASCADE')

      table.primary(['classroom_id', 'student_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
