import '@/db/env-config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  tablesFilter: [
    'customers_241124',
    'revenue_241124',
    'users_241124',
    'invoices_241124',
  ], // Укажите только новые таблицы
});
