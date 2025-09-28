import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Classrooms extends BaseSchema {
  protected tableName = 'classrooms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('room_number').notNullable().unique()
      table.integer('capacity').notNullable()
      table.boolean('is_available').defaultTo(true)
      table
        .uuid('teacher_id')
        .notNullable()
        .references('id')
        .inTable('teachers')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
