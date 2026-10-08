import api from './axios'

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  login:   (data) => api.post('/auth/login/', data),
  logout:  (refresh) => api.post('/auth/logout/', { refresh }),
  me:      () => api.get('/auth/me/'),
  refresh: (refresh) => api.post('/auth/refresh/', { refresh }),
}

// ── About ─────────────────────────────────────────────
export const aboutApi = {
  get:    () => api.get('/about/'),
  create: (data) => api.post('/about/', data),
  update: (data) => api.put('/about/', data),
}

// ── Skills ────────────────────────────────────────────
export const skillsApi = {
  list:              (params) => api.get('/skills/', { params }),
  get:               (id)     => api.get(`/skills/${id}/`),
  create:            (data)   => api.post('/skills/', data),
  update:            (id, data) => api.patch(`/skills/${id}/`, data),
  delete:            (id)     => api.delete(`/skills/${id}/`),
  listCategories:    ()       => api.get('/skills/categories/'),
  createCategory:    (data)   => api.post('/skills/categories/', data),
  deleteCategory:    (id)     => api.delete(`/skills/categories/${id}/`),
}

// ── Projects ──────────────────────────────────────────
export const projectsApi = {
  list:   (params)    => api.get('/projects/', { params }),
  get:    (slug)      => api.get(`/projects/${slug}/`),
  create: (data)      => api.post('/projects/', data),
  update: (slug, data) => api.patch(`/projects/${slug}/`, data),
  delete: (slug)      => api.delete(`/projects/${slug}/`),
  listTags:   ()      => api.get('/projects/tags/'),
  createTag:  (data)  => api.post('/projects/tags/', data),
}

// ── Blogs ─────────────────────────────────────────────
export const blogsApi = {
  list:   (params)    => api.get('/blogs/', { params }),
  get:    (slug)      => api.get(`/blogs/${slug}/`),
  create: (data)      => api.post('/blogs/', data),
  update: (slug, data) => api.patch(`/blogs/${slug}/`, data),
  delete: (slug)      => api.delete(`/blogs/${slug}/`),
  listCategories: ()  => api.get('/blogs/categories/'),
  createCategory: (d) => api.post('/blogs/categories/', d),
}

// ── Experience ────────────────────────────────────────
export const experienceApi = {
  list:   (params)  => api.get('/experience/', { params }),
  get:    (id)      => api.get(`/experience/${id}/`),
  create: (data)    => api.post('/experience/', data),
  update: (id, data) => api.patch(`/experience/${id}/`, data),
  delete: (id)      => api.delete(`/experience/${id}/`),
}

// ── Testimonials ──────────────────────────────────────
export const testimonialsApi = {
  list:   (params)  => api.get('/testimonials/', { params }),
  get:    (id)      => api.get(`/testimonials/${id}/`),
  create: (data)    => api.post('/testimonials/', data),
  update: (id, data) => api.patch(`/testimonials/${id}/`, data),
  delete: (id)      => api.delete(`/testimonials/${id}/`),
}

// ── Services ──────────────────────────────────────────
export const servicesApi = {
  list:   (params)  => api.get('/services/', { params }),
  get:    (id)      => api.get(`/services/${id}/`),
  create: (data)    => api.post('/services/', data),
  update: (id, data) => api.patch(`/services/${id}/`, data),
  delete: (id)      => api.delete(`/services/${id}/`),
}

// ── Contact Messages ──────────────────────────────────
export const contactApi = {
  list:   (params)  => api.get('/contact/messages/', { params }),
  get:    (id)      => api.get(`/contact/messages/${id}/`),
  update: (id, data) => api.patch(`/contact/messages/${id}/`, data),
  delete: (id)      => api.delete(`/contact/messages/${id}/`),
}

// ── Media ─────────────────────────────────────────────
export const mediaApi = {
  list:   (params) => api.get('/media/', { params }),
  upload: (formData) => api.post('/media/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.patch(`/media/${id}/`, data),
  delete: (id)     => api.delete(`/media/${id}/`),
}
