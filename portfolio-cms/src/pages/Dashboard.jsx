import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  RiUser3Line, RiCodeSSlashLine, RiFolderLine, RiArticleLine,
  RiBriefcaseLine, RiStarLine, RiServiceLine, RiMailLine,
} from 'react-icons/ri'
import { skillsApi, projectsApi, blogsApi, experienceApi, testimonialsApi, servicesApi, contactApi } from '@/api'
import { useAuth } from '@/context/AuthContext'

const STAT_CONFIG = [
  { key: 'skills',        label: 'Skills',        icon: RiCodeSSlashLine, color: 'bg-blue-500',   to: '/skills' },
  { key: 'projects',      label: 'Projects',      icon: RiFolderLine,     color: 'bg-violet-500', to: '/projects' },
  { key: 'blogs',         label: 'Blog Posts',    icon: RiArticleLine,    color: 'bg-pink-500',   to: '/blogs' },
  { key: 'experience',    label: 'Experience',    icon: RiBriefcaseLine,  color: 'bg-amber-500',  to: '/experience' },
  { key: 'testimonials',  label: 'Testimonials',  icon: RiStarLine,       color: 'bg-green-500',  to: '/testimonials' },
  { key: 'services',      label: 'Services',      icon: RiServiceLine,    color: 'bg-cyan-500',   to: '/services' },
  { key: 'messages',      label: 'Messages',      icon: RiMailLine,       color: 'bg-red-500',    to: '/contact' },
]

export default function Dashboard() {
  const { user } = useAuth()

  const results = useQueries({
    queries: [
      { queryKey: ['skills-count'],        queryFn: () => skillsApi.list({ page_size: 1 }) },
      { queryKey: ['projects-count'],      queryFn: () => projectsApi.list({ page_size: 1 }) },
      { queryKey: ['blogs-count'],         queryFn: () => blogsApi.list({ page_size: 1 }) },
      { queryKey: ['experience-count'],    queryFn: () => experienceApi.list({ page_size: 1 }) },
      { queryKey: ['testimonials-count'],  queryFn: () => testimonialsApi.list({ page_size: 1 }) },
      { queryKey: ['services-count'],      queryFn: () => servicesApi.list({ page_size: 1 }) },
      { queryKey: ['messages-count'],      queryFn: () => contactApi.list({ page_size: 1 }) },
    ],
  })

  const counts = results.map((r) => r.data?.data?.count ?? '—')

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.first_name || user?.username} 👋
        </h2>
        <p className="text-gray-500 mt-1">Here's an overview of your portfolio content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
        {STAT_CONFIG.map(({ key, label, icon: Icon, color, to }, i) => (
          <Link
            key={key}
            to={to}
            className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
          >
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
              <Icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {counts[i]}
              </p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { to: '/projects', label: '+ New Project' },
            { to: '/blogs',    label: '+ New Blog Post' },
            { to: '/skills',   label: '+ Add Skill' },
            { to: '/contact',  label: 'View Messages' },
            { to: '/media',    label: 'Media Library' },
            { to: '/about',    label: 'Edit About' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="btn-secondary text-sm">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
