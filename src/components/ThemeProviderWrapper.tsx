'use client'

import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <>{children}</> // Prevent hydration mismatch

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-screen flex bg-sky-50 text-gray-900 dark:bg-[#e6f0f4] dark:text-gray-900 transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden bg-sky-50 dark:bg-[#e6f0f4]">
          <Topbar />
          <main className="flex-1 overflow-auto p-6 bg-white dark:bg-[#d9ebf1]">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
