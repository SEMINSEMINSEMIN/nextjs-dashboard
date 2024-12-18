import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import {
    fetchRevenue,
    fetchLatestInvoices,
    fetchCardData,
} from "@/app/lib/data";

/**
 *
 * Next.js uses "file-system routing" where "folders are used to create nested routes."
 * Each folder represents a route segment that maps to a URL segment.
 * app/dashboard : http://localhost:3000/dashboard
 *
 * Only the content inside the page file will be publicly accessible.
 */

/**
 *
 * 'async': Page is an async component. this allows you to use 'awiat' to fetch data
 */

export default async function Page() {
    // waterfall data fetching: 속도가 느림. 단, 데이터의 순서 보장 o
    // const revenue = await fetchRevenue();
    // const latestInvoices = await fetchLatestInvoices();
    // const {
    //     totalPaidInvoices,
    //     totalPendingInvoices,
    //     numberOfInvoices,
    //     numberOfCustomers,
    // } = await fetchCardData();

    // parallel data fetching: 속도가 더 빠름. 단 데이터의 순서 보장 x
    const [
        revenue,
        latestInvoices,
        {
            totalPaidInvoices,
            totalPendingInvoices,
            numberOfInvoices,
            numberOfCustomers,
        },
    ] = await Promise.all([
        fetchRevenue(),
        fetchLatestInvoices(),
        fetchCardData(),
    ]);

    // const { revenue } = data[0];

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card
                    title="Collected"
                    value={totalPaidInvoices}
                    type="collected"
                />
                <Card
                    title="Pending"
                    value={totalPendingInvoices}
                    type="pending"
                />
                <Card
                    title="Total Invoices"
                    value={numberOfInvoices}
                    type="invoices"
                />
                <Card
                    title="Total Customers"
                    value={numberOfCustomers}
                    type="customers"
                />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <RevenueChart revenue={revenue} />
                <LatestInvoices latestInvoices={latestInvoices} />
            </div>
        </main>
    );
}
