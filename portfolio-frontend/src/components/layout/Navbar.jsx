'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiMenuLine, RiCloseLine } from 'react-icons/ri'

const LINKS = [
  { href: '/#about',       label: 'About' },
  { href: '/#skills',      label: 'Skills' },
  { href: '/#projects',    label: 'Projects' },
  { href: '/#experience',  label: 'Experience' },
  { href: '/#services',    label: 'Services' },
  { href: '/blog',         label: 'Blog' },
  { href: '/#contact',     label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
      ${scrolled ? 'bg-gray-950/95 backdrop-blur-md border-b border-gray-800/60 shadow-xl' : 'bg-transparent'}`}>
      <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold gradient-text">
          {'<Portfolio />'}
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-150"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CMS link */}
        <a
          href={`${process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:5173'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
            border border-gray-700 text-gray-400 hover:border-primary-500 hover:text-white transition-all"
        >
          Admin
        </a>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {open ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-gray-950/98 backdrop-blur-md border-t border-gray-800 px-4 py-4">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="block px-3 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
