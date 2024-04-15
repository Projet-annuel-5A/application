"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import IconHome from "@/icons/Home"
import IconSessions from "@/icons/Sessions"

export default function NavButtons() {
    const pathname = usePathname();
    return (
        <ul>
            <li className="p-2">
                <Link href={'/application'} className={`flex justify-center p-3 rounded ${pathname === '/application' ? 'bg-blue-600' : ''}`}>
                    <IconHome isActive={pathname === '/application'}/>
                </Link>
            </li>
            <li className="p-2">
                <Link href={'/application/sessions'} className={`flex justify-center p-3 rounded ${pathname.startsWith('/application/sessions') ? 'bg-blue-600' : ''}`}>
                    <IconSessions isActive={pathname.startsWith('/application/sessions')}/>
                </Link>
            </li>
        </ul>
    );
}