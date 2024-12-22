"use client"; // This is a Client Component, which means you can use event listeners and hooks.

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {
    // <Search> is a client component, so you need to use 'useSearchParams() hook to access the params from the client.
    const searchParams = useSearchParams();
    const pathname = usePathname(); // current path
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        // URLSearchParams: Web API that provides utility methods for manipulating the URL query parameters
        const params = new URLSearchParams(searchParams);
        params.set("page", "1"); // when the user types a new search query, you want to reset the page number to 1.

        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }

        // updates the URL with the user's search data.
        // The URL is updated without reloading the page, thanks to Next.js's client-side navigation
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            {/* 
              To ensure the input field is in sync with the URL and will be populated when sharing, 
              you can pass a defaultValue to input by reading from searchParams:
              
              defaultValue vs value
              since you're not using state, you can use defaultValue. This means the native input will manage its own state. 
              This is okay since you're saving the search query to the URL instead of state.
             */}
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get("query")?.toString()}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    );
}
