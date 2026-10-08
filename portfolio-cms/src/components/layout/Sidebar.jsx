import { NavLink, useNavigate } from 'react-router-dom'
import {
  RiDashboardLine, RiUser3Line, RiCodeSSlashLine, RiFolderLine,
  RiArticleLine, RiBriefcaseLine, RiStarLine, RiServiceLine,
  RiMailLine, RiImageLine, RiLogoutBoxLine, RiMenuLine, RiCloseLine,
} from 'react-icons/ri'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/',              icon: RiDashboardLine,  label: 'Dashboard' },
  { to: '/about',         icon: RiUser3Line,      label: 'About' },
  { to: '/skills',        icon: RiCodeSSlashLine, label: 'Skills' },
  { to: '/projects',      icon: RiFolderLine,     label: 'Projects' },
  { to: '/blogs',         icon: RiArticleLine,    label: 'Blogs' },
  { to: '/experience',    icon: RiBriefcaseLine,  label: 'Experience' },
  { to: '/testimonials',  icon: RiStarLine,       label: 'Testimonials' },
  { to: '/services',      icon: RiServiceLine,    label: 'Services' },
  { to: '/contact',       icon: RiMailLine,       label: 'Contact' },
  { to: '/media',         icon: RiImageLine,      label: 'Media' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar text-white transition-all duration-300
        ${collapsed ? 'w-16' : 'w-60'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-primary-400">
            Portfolio CMS
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <RiMenuLine size={20} /> : <RiCloseLine size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
        >
          <RiLogoutBoxLine size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
