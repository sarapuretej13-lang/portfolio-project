/**
 * Portfolio Frontend API client
 * All calls go to the Django REST backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}/api${endpoint}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    cache: 'no-store',  // Always fetch fresh data
    ...options,
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${endpoint}`)
  return res.json()
}

export const api = {
  // About
  getAbout: () => fetchAPI('/about/', { revalidate: 300 }),

  // Skills
  getSkills: () => fetchAPI('/skills/?status=published&page_size=100', { revalidate: 300 }),
  getSkillCategories: () => fetchAPI('/skills/categories/', { revalidate: 300 }),

  // Projects
  getProjects: (params = '') => fetchAPI(`/projects/?status=published&page_size=100${params}`, { revalidate: 60 }),
  getFeaturedProjects: () => fetchAPI('/projects/?status=published&featured=true&page_size=6', { revalidate: 60 }),
  getProject: (slug) => fetchAPI(`/projects/${slug}/`, { revalidate: 60 }),

  // Blogs
  getBlogs: (params = '') => fetchAPI(`/blogs/?status=published&page_size=20${params}`, { revalidate: 60 }),
  getBlog: (slug) => fetchAPI(`/blogs/${slug}/`, { revalidate: 60 }),

  // Experience
  getExperience: () => fetchAPI('/experience/?status=published&page_size=100', { revalidate: 300 }),

  // Testimonials
  getTestimonials: () => fetchAPI('/testimonials/?status=published&page_size=20', { revalidate: 300 }),

  // Services
  getServices: () => fetchAPI('/services/?status=published&page_size=20', { revalidate: 300 }),

  // Contact — POST only (no auth needed)
  sendContact: async (data) => {
    const res = await fetch(`${API_URL}/api/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw json
    return json
  },
}
