import CustomersTable from '@/components/shared/customers/table';
import { fetchFilteredCustomers } from '@/lib/actions/customer.actions';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Customers',
};
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  // const query = (await searchParams)?.query || '';
  const customers = await fetchFilteredCustomers(query);
  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}

// import CustomersTable from '@/components/shared/customers/table';
// import { fetchFilteredCustomers } from '@/lib/actions/customer.actions';
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Customers',
// };

// export default async function Page({
//   searchParams,
// }: {
//   searchParams?: {
//     query?: string;
//     page?: string;
//   };
// }) {
//   const query = searchParams?.query || '';
//   const currentPage = Number(searchParams?.page) || 1;

//   const customers = await fetchFilteredCustomers(query, currentPage);

//   return (
//     <main>
//       <CustomersTable customers={customers} />
//     </main>
//   );
// }
