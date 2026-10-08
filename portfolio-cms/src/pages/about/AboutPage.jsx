import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { aboutApi } from '@/api'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import PageHeader from '@/components/shared/PageHeader'

export default function AboutPage() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: () => aboutApi.get(),
    retry: false,
  })

  const about = data?.data

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm()

  useEffect(() => {
    if (about) reset(about)
  }, [about, reset])

  const mutation = useMutation({
    mutationFn: (formData) => aboutApi.update(formData),
    onSuccess: () => {
      toast.success('About saved successfully!')
      qc.invalidateQueries(['about'])
    },
    onError: (err) => {
      console.log('Full error:', err.response?.data)
      const data = err.response?.data
      if (data && typeof data === 'object') {
        // Show first error found
        const firstKey = Object.keys(data)[0]
        const msg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey]
        toast.error(`${firstKey}: ${msg}`)
      } else {
        toast.error('Save failed. Please try again.')
      }
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title="About" subtitle="Your personal information shown on the portfolio." />

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="card p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-800 border-b pb-3">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Full Name *</label>
              <input {...register('name', { required: 'Name is required' })}
                className={`input ${errors.name ? 'input-error' : ''}`} placeholder="Your Name" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Title *</label>
              <input {...register('title', { required: 'Title is required' })}
                className={`input ${errors.title ? 'input-error' : ''}`} placeholder="Full Stack Developer" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input {...register('email')} type="email" className="input" placeholder="you@email.com" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input {...register('phone')} className="input" placeholder="+1 234 567 890" />
            </div>
            <div>
              <label className="label">Location</label>
              <input {...register('location')} className="input" placeholder="City, Country" />
            </div>
            <div>
              <label className="label">Years of Experience</label>
              <input {...register('years_of_experience')} type="number" min="0" className="input" />
            </div>
          </div>
          <div>
            <label className="label">Short Bio (max 500 chars)</label>
            <input {...register('short_bio')} className="input" placeholder="One-liner tagline shown in hero section" />
          </div>
          <div>
            <label className="label">Full Bio *</label>
            <textarea {...register('bio', { required: 'Bio is required' })}
              rows={5} className={`input resize-none ${errors.bio ? 'input-error' : ''}`}
              placeholder="Tell your story..." />
            {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
          </div>
          <div className="flex items-center gap-3">
            <input {...register('available_for_hire')} type="checkbox" id="available"
              className="w-4 h-4 text-primary-600 rounded" />
            <label htmlFor="available" className="text-sm font-medium text-gray-700">
              Available for hire
            </label>
          </div>
        </div>

        {/* Social Links */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 border-b pb-3">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'github_url', label: 'GitHub', placeholder: 'https://github.com/...' },
              { name: 'linkedin_url', label: 'Internshala', placeholder: 'https://internshala.com/student/...' },
              { name: 'website_url', label: 'Website', placeholder: 'https://yoursite.com' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="label">{label}</label>
                <input {...register(name)} type="text" className="input" placeholder={placeholder} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {about && (
            <button type="button" onClick={() => reset(about)} disabled={!isDirty} className="btn-secondary">
              Reset Changes
            </button>
          )}
          <button type="submit" disabled={mutation.isPending} className="btn-primary px-8">
            {mutation.isPending ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
            ) : 'Save About'}
          </button>
        </div>
      </form>
    </div>
  )
}
