'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Upload, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const links = [
    { href: '/', label: 'Dashboard', Icon: LayoutDashboard },
    { href: '/ask', label: 'Ask', Icon: FileText },
    { href: '/upload', label: 'Upload', Icon: Upload },
    { href: '/logs', label: 'Logs', Icon: LogOut },
  ]

  return (
    <aside
      className={`h-full ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className={`text-2xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100 ${collapsed && 'hidden'}`}>
          Data Whisperer
        </div>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-3 flex-grow">
        {links.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              pathname === href
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white'
            } ${collapsed ? 'justify-center' : ''}`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-auto text-center py-4">
        {!collapsed && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-blue-800 bg-blue-100 dark:text-blue-100 dark:bg-blue-800">
            Data Whisperer v1.0
          </span>
        )}
      </div>

    </aside>
  )
}
