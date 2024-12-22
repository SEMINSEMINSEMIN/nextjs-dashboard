// route group: (overview) 폴더
// Route groups allow you to organize files into logical groups without affecting the URL path structure.
// When you create a new folder using parentheses (), the name won't be included in the URL path.
// So /dashboard/(overview)/page.tsx becomes /dashboard.
// Here, you're using a route group to ensure loading.tsx only applies to your dashboard overview page.

// a placeholder (or fallback) to indicate to users that the content is loading.
// Any UI you add in loading.tsx will be embedded as part of the static file, and sent first.
// Then, the rest of the dynamic content will be streamed from the server to the client.
import DashboardSkeleton from "@/app/ui/skeletons";

/**
 * Streaming:
 * loading.tsx is a special Next.js file built on top of Suspense,
 * it allows you to create "fallback UI" to show as a replacement while page content loads.
 *
 */

export default function Loading() {
    return <DashboardSkeleton />;
}
