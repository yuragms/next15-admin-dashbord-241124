import db from '@/db/drizzle';
import { customers241124 } from '@/db/schema';
export async function fetchCustomers() {
  try {
    const data = await db
      .select({
        id: customers241124.id,
        name: customers241124.name,
      })
      .from(customers241124)
      .orderBy(customers241124.name);
    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}
