'use server';
import db from '@/db/drizzle';
import { customers241124, invoices241124, revenue241124 } from '@/db/schema';
import { count, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { formatCurrency } from '../utils';
import { revalidatePath } from 'next/cache';
import { ITEMS_PER_PAGE } from '../constants';
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

export async function deleteInvoice(id: string) {
  try {
    await db.delete(invoices241124).where(eq(invoices241124.id, id));
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await db
      .select({
        id: invoices241124.id,
        amount: invoices241124.amount,
        name: customers241124.name,
        email: customers241124.email,
        image_url: customers241124.image_url,
        status: invoices241124.status,
        date: invoices241124.date,
      })
      .from(invoices241124)
      .innerJoin(
        customers241124,
        eq(invoices241124.customer_id, customers241124.id)
      )
      .where(
        or(
          ilike(customers241124.name, sql`${`%${query}%`}`),
          ilike(customers241124.email, sql`${`%${query}%`}`),
          ilike(invoices241124.status, sql`${`%${query}%`}`)
        )
      )
      .orderBy(desc(invoices241124.date))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}
export async function fetchInvoicesPages(query: string) {
  try {
    const data = await db
      .select({
        count: count(),
      })
      .from(invoices241124)
      .innerJoin(
        customers241124,
        eq(invoices241124.customer_id, customers241124.id)
      )
      .where(
        or(
          ilike(customers241124.name, sql`${`%${query}%`}`),
          ilike(customers241124.email, sql`${`%${query}%`}`),
          ilike(invoices241124.status, sql`${`%${query}%`}`)
        )
      );
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}
