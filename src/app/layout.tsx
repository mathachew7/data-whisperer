import '../styles/globals.css'
import { ThemeProviderWrapper } from '../components/ThemeProviderWrapper'

export const metadata = {
  title: 'Data Whisperer',
  description: 'AI-powered data co-pilot'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
