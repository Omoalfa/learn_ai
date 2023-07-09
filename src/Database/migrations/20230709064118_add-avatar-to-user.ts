import { ETables } from "../../Types";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable(ETables.USERS, (table) => {
    table.string("avatar").nullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema.alterTable(ETables.USERS, (table) => {
    table.dropColumn("avatar")
  })
}
