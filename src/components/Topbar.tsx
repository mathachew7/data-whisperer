'use client'

import { usePathname } from 'next/navigation'
import { Moon, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import Image from 'next/image'

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const getTabName = () => {
    if (pathname === '/') return 'Dashboard'
    if (pathname.includes('/ask')) return 'Ask Tab'
    if (pathname.includes('/upload')) return 'Upload Tab'
    if (pathname.includes('/logs')) return 'Logs Tab'
    return 'Data Whisperer'
  }

  return (
    <div className="w-full px-6 py-4 flex items-center justify-between border-b dark:border-gray-700 bg-white dark:bg-gray-900 z-50">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">{getTabName()}</h2>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white transition"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <User className="w-5 h-5 text-gray-700 dark:text-white" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Admin</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 text-sm z-50">
              <a href="#" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
              <a href="#" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
              <a href="#" className="block px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
