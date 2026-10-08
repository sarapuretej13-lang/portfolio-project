import { useLocation } from 'react-router-dom'
import { RiBellLine, RiExternalLinkLine } from 'react-icons/ri'

const PAGE_TITLES = {
  '/':             'Dashboard',
  '/about':        'About',
  '/skills':       'Skills',
  '/projects':     'Projects',
  '/blogs':        'Blogs',
  '/experience':   'Experience',
  '/testimonials': 'Testimonials',
  '/services':     'Services',
  '/contact':      'Contact Messages',
  '/media':        'Media Library',
}

export default function Header() {
  const { pathname } = useLocation()
  const base = '/' + pathname.split('/')[1]
  const title = PAGE_TITLES[base] || 'CMS'

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <a
          href={import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:3000'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
        >
          <RiExternalLinkLine size={16} />
          View Portfolio
        </a>
      </div>
    </header>
  )
}
