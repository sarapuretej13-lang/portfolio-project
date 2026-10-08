import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { projectsApi } from '@/api'
import PageHeader from '@/components/shared/PageHeader'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function ProjectForm() {
  const { slug } = useParams()
  const isEdit = Boolean(slug)
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectsApi.get(slug),
    enabled: isEdit,
  })

  const project = data?.data

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { status: 'draft', featured: false, display_order: 0 },
  })

  useEffect(() => {
    if (project) reset(project)
  }, [project, reset])

  const [thumbnail, setThumbnail] = useState(null)

  const mutation = useMutation({
    mutationFn: (formData) => {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v)
      })
      if (thumbnail) fd.append('thumbnail', thumbnail)
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      return isEdit
        ? projectsApi.update(slug, fd)
        : projectsApi.create(fd)
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Project updated!' : 'Project created!')
      qc.invalidateQueries(['projects'])
      navigate('/projects')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Save failed.'),
  })

  if (isEdit && isLoading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Project' : 'New Project'}
        backTo="/projects"
      />

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="max-w-3xl space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-800 border-b pb-3">Project Details</h3>
          <div>
            <label className="label">Title *</label>
            <input {...register('title', { required: 'Title is required' })}
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="My Awesome Project" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Short Description</label>
            <input {...register('short_description')} className="input"
              placeholder="One-line summary (shown in cards)" />
          </div>
          <div>
            <label className="label">Full Description *</label>
            <textarea {...register('description', { required: 'Description is required' })}
              rows={5} className={`input resize-none ${errors.description ? 'input-error' : ''}`}
              placeholder="Detailed project description..." />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="label">Tech Stack</label>
            <input {...register('tech_stack')} className="input"
              placeholder="Python, Django, React, PostgreSQL (comma-separated)" />
          </div>
        </div>

        {/* Links */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 border-b pb-3">Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">GitHub URL</label>
              <input {...register('github_url')} type="url" className="input"
                placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="label">Live Demo URL</label>
              <input {...register('live_url')} type="url" className="input"
                placeholder="https://myproject.com" />
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 border-b pb-3">Thumbnail</h3>
          {isEdit && project?.thumbnail_url && !thumbnail && (
            <div>
              <p className="label mb-2">Current Thumbnail</p>
              <img src={project.thumbnail_url} alt="Current" className="h-32 w-auto rounded-lg object-cover" />
            </div>
          )}
          <div>
            <label className="label">{isEdit ? 'Replace Thumbnail' : 'Upload Thumbnail'}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0] || null)}
              className="input py-2"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 border-b pb-3">Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="label">Display Order</label>
              <input {...register('display_order')} type="number" min="0" className="input" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input {...register('featured')} type="checkbox" id="featured"
              className="w-4 h-4 text-primary-600 rounded" />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Mark as featured project
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/projects')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={mutation.isPending} className="btn-primary px-8">
            {mutation.isPending ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
            ) : isEdit ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}
