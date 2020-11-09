exports.up = async function (knex) {
  await knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('profiles', function (table) {
      table.string('id').notNullable().unique().primary();
      table.string('email');
      table.string('first_name');
      table.string('last_name');
      table.timestamps(true, true);
      table.boolean('is_groomer').defaultTo(false);
    });
  await knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('groomer_profiles', (table) => {
      table.increments('id').notNullable().unique().primary();
      table.string('business_name');
      table.string('location_state');
      table.string('location_city');
      table.string('location_zip');
      table.string('profile_picture');
      table.string('document');
      table
        .string('profile_id')
        .notNullable()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  await knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('services', (table) => {
      table.increments('id').notNullable().unique();
      table.string('service').unique().notNullable();
    });
  await knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('groomer_services', (table) => {
      table
        .integer('service_id')
        .notNullable()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .integer('groomer_profile_id')
        .notNullable()
        .references('id')
        .inTable('groomer_profiles')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.float('price').notNullable();
    });
  await knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('user_pets', (table) => {
      table.increments('id').notNullable().unique();
      table.string('name').notNullable();
      table.string('breed').notNullable();
      table.string('type_of_pet').notNullable();
      table.string('picture').unique().notNullable();
    });
  await knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('pet_pictures', (table) => {
      table.increments('id').notNullable().unique();
      table
        .integer('user_pets_id')
        .notNullable()
        .references('id')
        .inTable('user_pets')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.string('title').notNullable();
      table.string('description').notNullable();
    });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('pet_pictures');
  await knex.schema.dropTableIfExists('user_pets');
  await knex.schema.dropTableIfExists('groomer_services');
  await knex.schema.dropTableIfExists('services');
  await knex.schema.dropTableIfExists('groomer_profiles');
  await knex.schema.dropTableIfExists('profiles');
};

// We need groomer_profile_document
/// 1st field: groomer_profile_id
/// 2nd field: table.increments
/// 3rd field: document_url
/// 4th field: document_name

// We need groomer_profile_services
/// 1st field: groomer_profile_id
/// 2nd field: service_id
/// 3rd field: price (need to ask the stake-holder)
