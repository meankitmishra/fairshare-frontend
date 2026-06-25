import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo', // critical — without this, generation targets the wrong runtime
  schema: './src/core/db/schema.ts',
  out: './src/core/db/drizzle',
});