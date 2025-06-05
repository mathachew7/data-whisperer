'use client'

import { MessageCircle, Activity, Database, Cloud, BarChart2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import { MetricCard } from '../components/MetricCard'
import { ChatWidget } from '../components/ChatWidget'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function HomePage() {
  const [status, setStatus] = useState('Online')
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus((prev) => (prev === 'Online' ? 'Stable' : 'Online'))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Welcome to Data Whisperer</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowChat((prev) => !prev)}
            className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-gray-600">
        Your AI-powered co-pilot for data pipelines. Track your pipelines, uploads, API connections, and queries all in one place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Active Pipelines" value={12} status="active" updated="2 mins ago" icon={<Activity className="w-4 h-4" />} />
        <MetricCard title="JSON Files Uploaded" value={47} status="active" updated="5 mins ago" icon={<Database className="w-4 h-4" />} />
        <MetricCard title="API Connections" value={8} status="idle" updated="10 mins ago" icon={<Cloud className="w-4 h-4" />} />
        <MetricCard title="Queries Performed" value={329} status="active" updated="just now" icon={<BarChart2 className="w-4 h-4" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Pipeline Health (Last 7 Days)">
          <div className="h-48">
            <Line
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    label: 'Errors',
                    data: [2, 1, 3, 0, 4, 2, 1],
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                  },
                  {
                    label: 'Success',
                    data: [10, 12, 15, 14, 16, 12, 18],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </DashboardCard>

        <DashboardCard title="Log Types Breakdown">
          <div className="h-48">
            <Bar
              data={{
                labels: ['Info', 'Warning', 'Error'],
                datasets: [
                  {
                    label: 'Logs',
                    data: [120, 45, 20],
                    backgroundColor: ['#3B82F6', '#FBBF24', '#EF4444'],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard title="Ask Pipeline Questions" description="Query your logs and get AI-powered answers." href="/ask" />
        <FeatureCard title="Upload Logs" description="Upload JSON/CSV logs for processing." href="/upload" />
        <FeatureCard title="View System Logs" description="Inspect system logs and events." href="/logs" />
      </div>

      <div className="text-sm text-gray-500 mt-8">System Status: <span className="font-medium text-green-600">{status}</span></div>

      {showChat && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[500px] h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-xl border p-2">
          <ChatWidget onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  )
}

function DashboardCard({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function FeatureCard({
  title,
  description,
  href
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <a href={href} className="block bg-white shadow rounded-lg p-4 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  )
}
