import { BaseSchema } from "@adonisjs/lucid/schema";

export default class Students extends BaseSchema {
  protected tableName = "students";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("email").unique().notNullable();
      table.string("registration").notNullable();
      table.date("birth_date").notNullable();
      table.timestamp("created_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
