"use client"; // usePathname은 훅. 그래서 nav-links.tsx를 client component로 변환.

import {
    UserGroupIcon,
    HomeIcon,
    DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // for css styling. conditional한 스타일 가능

/**
 * <a> HTML element: full page refresh on each page navigation
 * <Link />: client-side navigation with JavaScript.
 * 
 * Automatic code-splitting and prefetching
To improve the navigation experience, Next.js automatically code splits your application by route segments. 
This is different from a traditional React SPA, where the browser loads all your application code on initial load.

Splitting code by routes means that pages become isolated. If a certain page throws an error, the rest of the application will still work.

Furthermore, in production, whenever <Link> components appear in the browser's viewport, 
Next.js automatically prefetches the code for the linked route in the background. 
By the time the user clicks the link, the code for the destination page will already be loaded in the background, 
and this is what makes the page transition near-instant!
 */

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
    { name: "Home", href: "/dashboard", icon: HomeIcon },
    {
        name: "Invoices",
        href: "/dashboard/invoices",
        icon: DocumentDuplicateIcon,
    },
    { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
];

export default function NavLinks() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                            {
                                "bg-sky-100 text-blue-600":
                                    pathname === link.href,
                            }
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
