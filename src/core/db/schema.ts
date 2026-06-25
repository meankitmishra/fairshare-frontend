import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const probe = sqliteTable('probe', {
  id: text('id').primaryKey(), 
  label: text('label').notNull(),
  createdAt: integer('created_at').notNull(),
});