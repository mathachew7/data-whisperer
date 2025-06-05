import { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  status: 'active' | 'idle' | 'error'
  updated: string
  icon?: ReactNode
}

export function MetricCard({ title, value, status, updated, icon }: MetricCardProps) {
  const statusMap = {
    active: { text: 'Active', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-800' },
    idle: { text: 'Idle', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-800' },
    error: { text: 'Error', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-800' },
  }

  const statusInfo = statusMap[status]

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Last updated {updated}</p>
      </div>
      <div className={`flex items-center justify-center ${statusInfo.bg} ${statusInfo.color} rounded-full w-10 h-10`}>
        {icon}
        <span className="sr-only">{statusInfo.text}</span>
      </div>
    </div>
  )
}
