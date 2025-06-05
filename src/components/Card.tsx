import { ReactNode } from 'react'

interface CardProps {
  title?: string
  description?: string
  children: ReactNode
}

export function Card({ title, description, children }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 space-y-2">
      {title && <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>}
      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      <div>{children}</div>
    </div>
  )
}
