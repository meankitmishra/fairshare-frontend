import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from '@/core/db/schema';

export const DATABASE_NAME = 'fairshare.db';

export const expoDb = openDatabaseSync(DATABASE_NAME, {
  enableChangeListener: true, 
});

export const db = drizzle(expoDb, { schema });