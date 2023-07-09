import { ETables, EUserCourseStatus } from "../../Types";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable(ETables.USERS, (table) => {
    table.increments("id", { primaryKey: true })
    table.string("first_name", 255).notNullable()
    table.string("last_name",  255).notNullable()
    table.string("phone",  255).notNullable()
    table.string("email",  255).unique().notNullable()
    table.boolean("is_verified").defaultTo(false)
    table.datetime("deleted_at")
    table.string("password", 225).notNullable()
    table.string("password_pin", 225).nullable()
    table.string("verificatin_code", 225).nullable()
    table.timestamps()
  })
  .createTable(ETables.COURSES, (table) => {
    table.increments("id", { primaryKey: true })
    table.string("name", 225).unique().index("idx-courses").notNullable()
    table.string("description").nullable()
    table.integer("creator_id").unsigned().notNullable()
    table.foreign("creator_id").references("id").inTable(ETables.USERS).onDelete("set null") //first user to generate the course content:::
    table.timestamps()
  })
  .createTable(ETables.COURSE_CONTENTS, (table) => {
    table.increments("id", { primaryKey: true })
    table.integer("course_id").unsigned().notNullable()
    table.foreign("course_id").references("id").inTable(ETables.COURSES).onDelete("cascade")
    table.string("title").notNullable()
    table.integer("content_position").unsigned().notNullable()
    table.boolean("is_last_lesson").defaultTo(false)
    table.timestamps()
  })
  .createTable(ETables.USER_COURSES, (table) => {
    table.increments("id", { primaryKey: true })
    table.integer("course_id").unsigned().notNullable()
    table.foreign("course_id").references("id").inTable(ETables.COURSES)
    table.integer("user_id").unsigned().notNullable()
    table.foreign("user_id").references("id").inTable(ETables.USERS)
    table.enum("status", Object.values(EUserCourseStatus)).defaultTo(EUserCourseStatus.NOT_STARTED)
    table.integer("last_lesson").unsigned().notNullable()
    table.foreign("last_lesson").references("id").inTable(ETables.COURSE_CONTENTS)
    table.timestamps()
  })
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable(ETables.USER_COURSES).dropTable(ETables.COURSE_CONTENTS).dropTable(ETables.COURSES).dropTable(ETables.USERS)
}
