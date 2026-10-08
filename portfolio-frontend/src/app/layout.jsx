import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import { api } from '@/lib/api'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata() {
  try {
    const about = await api.getAbout()
    return {
      title: { default: `${about.name} — Portfolio`, template: `%s | ${about.name}` },
      description: about.short_bio || about.bio?.slice(0, 160),
      openGraph: {
        title: `${about.name} — Portfolio`,
        description: about.short_bio || about.bio?.slice(0, 160),
        type: 'website',
        url: process.env.NEXT_PUBLIC_SITE_URL,
      },
    }
  } catch {
    return {
      title: 'Portfolio',
      description: 'Developer Portfolio',
    }
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="bottom-right"
          toastOptions={{ style: { background: '#1f2937', color: '#f3f4f6', border: '1px solid #374151' } }} />
      </body>
    </html>
  )
}
