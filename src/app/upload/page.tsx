'use client'

import { useState } from 'react'
import { UploadCloud } from 'lucide-react'

export default function UploadPage() {
  const [mode, setMode] = useState<'file' | 'api'>('file')
  const [file, setFile] = useState<File | null>(null)
  const [apiUrl, setApiUrl] = useState('')

  const handleUpload = () => {
    if (mode === 'file' && file) {
      console.log('Uploading file:', file)
    } else if (mode === 'api' && apiUrl) {
      console.log('Fetching from API:', apiUrl)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
        <UploadCloud className="w-6 h-6" />
        Upload Logs
      </h1>

      <p className="text-gray-600 dark:text-gray-300">
        Upload your logs in JSON format or provide an API endpoint. The data will be processed and stored for querying through the dashboard.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => setMode('file')}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            mode === 'file'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setMode('api')}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            mode === 'api'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          API Link
        </button>
      </div>

      {mode === 'file' ? (
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Select JSON File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
          {file && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Selected: {file.name}</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            API Endpoint URL
          </label>
          <input
            type="url"
            placeholder="https://api.example.com/logs"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
          {apiUrl && (
            <p className="text-sm text-gray-600 dark:text-gray-400">URL: {apiUrl}</p>
          )}
        </div>
      )}

      <button
        onClick={handleUpload}
        className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition"
      >
        {mode === 'file' ? 'Upload JSON File' : 'Fetch from API'}
      </button>
    </div>
  )
}
