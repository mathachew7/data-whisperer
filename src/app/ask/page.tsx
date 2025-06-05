'use client'

import { ChatWidget } from '@/components/ChatWidget'

export default function ChatPage() {
  return (
    <div className="p-6 md:pl-8 pr-6 pt-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Chat Assistant
      </h1>
      <div className="w-full h-[65vh] max-w-5xl mx-auto rounded-2xl shadow-2xl border dark:border-gray-800 overflow-hidden">
        <ChatWidget onClose={() => {}} />
      </div>
    </div>
  )
}
