import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";

// Suspense allows you to defer rendering parts of your application until some condition is met
/**
 * suspense에 관해
 * it's good practice to move your data fetches down to the components that need it,
 * and then wrap those components in Suspense.
 * But there is nothing wrong with streaming the sections or the whole page
 * if that's what your application needs.
 */
// The Suspense fallback is embedded into the initial HTML file along with the static content.
import { Suspense } from "react";

// Grouping components
// you should see all the cards load in at the same time.
// You can use this pattern when you want multiple components to load in at the same time.
import CardWrapper from "@/app/ui/dashboard/cards";

import {
    RevenueChartSkeleton,
    LatestInvoicesSkeleton,
    CardsSkeleton,
} from "@/app/ui/skeletons";

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
    // const [
    //     revenue,
    //     latestInvoices,
    //     {
    //         totalPaidInvoices,
    //         totalPendingInvoices,
    //         numberOfInvoices,
    //         numberOfCustomers,
    //     },
    // ] = await Promise.all([
    //     fetchRevenue(),
    //     fetchLatestInvoices(),
    //     fetchCardData(),
    // ]);

    // const { revenue } = data[0];

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    );
}
