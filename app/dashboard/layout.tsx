import SideNav from "@/app/ui/dashboard/sidenav";

/**
 * Next.js will prerender the static parts of your route (at build time)
 * and defer the dynamic parts until the user requests them.
 * As long as you're using Suspense to wrap the dynamic parts of your route,
 * Next.js will know which parts of your route are static and which are dynamic.
 */
export const experimental_ppr = true;

/**
 *
 * layout.tsx: UI that is shared between multiple pages.
 * One benefit of using layouts in Next.js is that on navigation,
 * only the page components update while the layout won't re-render.
 * This is called "partial rendering"
 */

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                {children}
            </div>
        </div>
    );
}
