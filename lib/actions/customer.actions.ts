import db from '@/db/drizzle';
import { customers241124, invoices241124 } from '@/db/schema';
import { asc, eq, ilike, or, sql } from 'drizzle-orm';
import { formatCurrency } from '../utils';
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

export async function fetchFilteredCustomers(query: string) {
  const data = await db
    .select({
      id: customers241124.id,
      name: customers241124.name,
      email: customers241124.email,
      image_url: customers241124.image_url,
      total_invoices: sql<number>`count(${invoices241124.id})`,
      total_pending: sql<number>`SUM(CASE WHEN ${invoices241124.status} = 'pending' THEN  ${invoices241124.amount} ELSE 0 END)`,
      total_paid: sql<number>`SUM(CASE WHEN  ${invoices241124.status} = 'paid' THEN  ${invoices241124.amount} ELSE 0 END)`,
    })
    .from(customers241124)
    .leftJoin(
      invoices241124,
      eq(customers241124.id, invoices241124.customer_id)
    )
    .where(
      or(
        ilike(customers241124.name, sql`${`%${query}%`}`),
        ilike(customers241124.email, sql`${`%${query}%`}`)
      )
    )
    .groupBy(
      customers241124.id,
      customers241124.name,
      customers241124.email,
      customers241124.image_url
    )
    .orderBy(asc(customers241124.id));
  return data.map((row) => ({
    ...row,
    total_invoices: row.total_invoices ?? 0,
    total_pending: formatCurrency(row.total_pending ?? 0),
    total_paid: formatCurrency(row.total_paid ?? 0),
  }));
}
