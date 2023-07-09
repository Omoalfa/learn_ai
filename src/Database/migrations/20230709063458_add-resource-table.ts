import { ETables, EUserCourseStatus } from "../../Types";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable(ETables.RESOURCES, (table) => {
    table.increments("id", { primaryKey: true })
    table.string("title", 255).notNullable()
    table.string("description").notNullable()
    table.specificType('links', 'text[]')
    table.integer("content_id").unsigned()
    table.foreign("content_id").references("id").inTable(ETables.COURSE_CONTENTS).onDelete("cascade")
    table.timestamps()
  })
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable(ETables.RESOURCES)
}

