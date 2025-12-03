'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const routes = [
  { href: '/', label: 'Home' },
  { href: '/customers', label: 'Customers' },
  { href: '/accounts', label: 'Accounts' },
  { href: '/deposito-types', label: 'Deposito Types' },
  { href: '/transactions', label: 'Transactions' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-100 p-4">
      <nav className="flex flex-col space-y-2">
        {routes.map((route) => (
          <Link key={route.href} href={route.href} className={cn('px-4 py-2 rounded-md text-sm font-medium', pathname === route.href ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200')}>
            {route.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
