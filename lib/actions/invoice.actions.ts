import db from '@/db/drizzle';
import { customers241124, invoices241124, revenue241124 } from '@/db/schema';
import { count, desc, eq, sql } from 'drizzle-orm';
import { formatCurrency } from '../utils';
export async function fetchCardData() {
  try {
    const invoiceCountPromise = db
      .select({ count: count() })
      .from(invoices241124);
    const customerCountPromise = db
      .select({ count: count() })
      .from(customers241124);
    const invoiceStatusPromise = db
      .select({
        paid: sql<number>`SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END)`,
        pending: sql<number>`SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END)`,
      })
      .from(invoices241124);
    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);
    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');
    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchRevenue() {
  try {
    const data = await db.select().from(revenue241124);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the revenues.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await db
      .select({
        amount: invoices241124.amount,
        name: customers241124.name,
        image_url: customers241124.image_url,
        email: customers241124.email,
        id: invoices241124.id,
      })
      .from(invoices241124)
      .innerJoin(
        customers241124,
        eq(invoices241124.customer_id, customers241124.id)
      )
      .orderBy(desc(invoices241124.date))
      .limit(5);
    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}
