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
//   // const query = (await searchParams)?.query || '';
//   const customers = await fetchFilteredCustomers(query);
//   return (
//     <main>
//       <CustomersTable customers={customers} />
//     </main>
//   );
// }
//
import CustomersTable from '@/components/shared/customers/table';
import { fetchFilteredCustomers } from '@/lib/actions/customer.actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

type SearchParams = {
  query?: string;
  page?: string;
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params?.query || '';
  const customers = await fetchFilteredCustomers(query);

  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}
