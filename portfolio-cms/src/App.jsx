import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Pages
import Login      from '@/pages/auth/Login'
import Dashboard  from '@/pages/Dashboard'
import AboutPage  from '@/pages/about/AboutPage'
import SkillsPage from '@/pages/skills/SkillsPage'
import ProjectsPage from '@/pages/projects/ProjectsPage'
import ProjectForm  from '@/pages/projects/ProjectForm'
import BlogsPage  from '@/pages/blogs/BlogsPage'
import BlogForm   from '@/pages/blogs/BlogForm'
import ExperiencePage   from '@/pages/experience/ExperiencePage'
import TestimonialsPage from '@/pages/testimonials/TestimonialsPage'
import ServicesPage     from '@/pages/services/ServicesPage'
import ContactPage      from '@/pages/contact/ContactPage'
import MediaPage        from '@/pages/media/MediaPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route path="/"               element={<Dashboard />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/skills"         element={<SkillsPage />} />
          <Route path="/projects"       element={<ProjectsPage />} />
          <Route path="/projects/new"   element={<ProjectForm />} />
          <Route path="/projects/:slug/edit" element={<ProjectForm />} />
          <Route path="/blogs"          element={<BlogsPage />} />
          <Route path="/blogs/new"      element={<BlogForm />} />
          <Route path="/blogs/:slug/edit" element={<BlogForm />} />
          <Route path="/experience"     element={<ExperiencePage />} />
          <Route path="/testimonials"   element={<TestimonialsPage />} />
          <Route path="/services"       element={<ServicesPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/media"          element={<MediaPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="flex h-screen items-center justify-center flex-col gap-4">
            <p className="text-6xl font-bold text-gray-200">404</p>
            <p className="text-gray-500">Page not found</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        } />
      </Routes>
    </AuthProvider>
  )
}
