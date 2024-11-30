import '@/db/env-config';
import { customers, invoices, revenue, users } from '@/lib/placeholder-data';
import db from './drizzle';
import * as schema from './schema';
import { exit } from 'process';
const main = async () => {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(schema.revenue241124);
      await tx.delete(schema.invoices241124);
      await tx.delete(schema.customers241124);
      await tx.delete(schema.users241124);
      await tx.insert(schema.users241124).values(users);
      await tx.insert(schema.customers241124).values(customers);
      await tx.insert(schema.invoices241124).values(invoices);
      await tx.insert(schema.revenue241124).values(revenue);
    });
    console.log('Database seeded successfully');
    exit(0);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to seed database');
  }
};
main();
