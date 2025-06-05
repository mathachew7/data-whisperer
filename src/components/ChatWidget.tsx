'use client'

import { X, Mic, Bot } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export function ChatWidget({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! How can I help you with your pipeline logs today?' }
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const sendMessage = () => {
    if (!input.trim()) return
    const userMessage = { type: 'user', text: input }
    const botReply = { type: 'bot', text: `You said: "${input}"` }
    setMessages((prev) => [...prev, userMessage, botReply])
    setInput('')
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsListening(true)
      console.log('🎤 Microphone access granted. Listening...')
      // TODO: Plug your whisper model / speech-to-text here
    } catch (err) {
      console.error('🚫 Microphone access denied:', err)
      setIsListening(false)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="w-full h-full rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center gap-2 font-semibold">
          <Bot className="w-5 h-5" />
          Data Assistant
        </div>
        <button onClick={onClose} className="text-white hover:text-red-400 transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div
        ref={containerRef}
        className="flex-1 p-4 space-y-3 overflow-y-auto custom-scroll bg-[url('/bg-chat.png')] bg-cover bg-center bg-no-repeat bg-fixed w-full h-full"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`px-4 py-2 text-sm max-w-[80%] whitespace-pre-wrap break-words shadow ${
                msg.type === 'bot'
                  ? 'bg-white dark:bg-blue-800 text-gray-900 dark:text-white rounded-2xl rounded-bl-sm'
                  : 'bg-emerald-600 text-white rounded-2xl rounded-br-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isListening && (
          <div className="text-xs text-center text-red-500 font-medium animate-pulse">
            🎤 Listening...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-2 items-center">
        <input
          className="flex-1 px-3 py-2 rounded-md border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Send
        </button>
        <button
          onClick={startListening}
          className={`p-2 transition ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-blue-600'}`}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
