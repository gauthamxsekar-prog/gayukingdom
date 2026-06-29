"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface PersonalLayoutProps {
  children: React.ReactNode;
}

const tabs = [
  { label: "SIP", href: "/personal/sip" },
  { label: "Small Stocks", href: "/personal/small-stocks" },
  { label: "Capital", href: "/personal/capital" },
  { label: "Daily Routine", href: "/personal/routine" },
];

export default function PersonalLayout({ children }: PersonalLayoutProps) {
  const pathname = usePathname() || "/personal/sip";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="mb-6 rounded-3xl bg-white/90 dark:bg-navy-800/90 border border-slate-200 dark:border-navy-700 shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 p-2">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-navy-700"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
