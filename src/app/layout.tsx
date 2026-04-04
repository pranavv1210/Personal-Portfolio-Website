import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NeuralNetworkBackground from './components/NeuralNetworkBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pranav V',
  description: 'A premium scrollytelling personal portfolio website.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#121212] text-white antialiased`}>
        <NeuralNetworkBackground />
        {children}
      </body>
    </html>
  )
}
