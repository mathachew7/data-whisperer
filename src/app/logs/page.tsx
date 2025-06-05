'use client'

import React, { useState, Fragment } from 'react'
import { FileText } from 'lucide-react'

const mockLogs = [
  {
    id: 1,
    type: 'Info',
    message: 'Pipeline X started successfully.',
    timestamp: '2025-06-03 14:22:01',
    metadata: { source: 'PipelineX', duration: '30s', triggeredBy: 'system' },
    description: 'Pipeline X was initialized to fetch and transform data from source A.'
  },
  {
    id: 2,
    type: 'Warning',
    message: 'API latency exceeded threshold.',
    timestamp: '2025-06-03 13:48:55',
    metadata: { endpoint: '/api/data', latency: '1200ms' },
    description: 'The latency of /api/data exceeded the acceptable range of 1s.'
  },
  {
    id: 3,
    type: 'Error',
    message: 'Failed to fetch data from Source Y.',
    timestamp: '2025-06-03 13:33:20',
    metadata: { source: 'SourceY', errorCode: 500, retry: 'no' },
    description: 'Data fetch failed due to an internal server error from Source Y.'
  },
  {
    id: 4,
    type: 'Info',
    message: 'New logs uploaded via API.',
    timestamp: '2025-06-03 12:15:10',
    metadata: { uploadedBy: 'admin', fileCount: 3 },
    description: 'Admin uploaded 3 new log files via API endpoint.'
  }
]

export default function DataLogsPage() {
  const [logs] = useState(mockLogs)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 bg-white dark:bg-gray-900 rounded-lg shadow text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
        <FileText className="w-6 h-6" />
        System Logs
      </h1>

      <p className="text-gray-600 dark:text-gray-300">
        View all your system activity logs, including errors, warnings, and informational events.
      </p>

      <div className="overflow-auto border rounded-lg border-gray-200 dark:border-gray-700">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map((log) => (
              <Fragment key={log.id}>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        log.type === 'Error'
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          : log.type === 'Warning'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                      }`}
                    >
                      {log.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">{log.message}</td>
                  <td className="px-4 py-3">{log.timestamp}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleExpand(log.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {expandedId === log.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </td>
                </tr>

                {expandedId === log.id && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                      <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                        <strong>Description:</strong> {log.description}
                      </p>
                      {log.metadata && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Metadata:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {Object.entries(log.metadata).map(([key, value]) => (
                              <li key={key}>
                                <span className="font-medium">{key}:</span> {String(value)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
