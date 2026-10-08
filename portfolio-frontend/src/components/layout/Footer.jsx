import Link from 'next/link'
import { RiGithubLine, RiLinkedinLine, RiHeartFill } from 'react-icons/ri'
import { api } from '@/lib/api'

export default async function Footer() {
  let about = null
  try { about = await api.getAbout() } catch { /* use fallback */ }

  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xl font-bold gradient-text">{'<Portfolio />'}</p>
            {about && (
              <p className="text-sm text-gray-500 mt-1">{about.title}</p>
            )}
          </div>

          <nav className="flex gap-6">
            {['About', 'Skills', 'Projects', 'Blog', 'Contact'].map((item) => (
              <Link
                key={item}
                href={item === 'Blog' ? '/blog' : `/#${item.toLowerCase()}`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {about?.github_url && (
              <a href={about.github_url} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <RiGithubLine size={20} />
              </a>
            )}
            {about?.linkedin_url && (
              <a href={about.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <RiLinkedinLine size={20} />
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800/60 text-center">
          <p className="text-xs text-gray-600 flex items-center justify-center gap-1.5">
            Built with <RiHeartFill className="text-red-500" size={12} />
            {' '}using Next.js, Django & PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  )
}
