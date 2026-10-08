import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { testimonialsApi } from '@/api'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useConfirm } from '@/hooks/useConfirm'
import { RiStarLine, RiStarFill, RiEditLine, RiDeleteBinLine } from 'react-icons/ri'

export default function TestimonialsPage() {
  const qc = useQueryClient()
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [avatar, setAvatar] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialsApi.list({ page_size: 100 }),
  })
  const items = data?.data?.results || []

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { rating: 5, status: 'published', featured: false, display_order: 0 },
  })

  const openAdd = () => {
    setEditing(null); setAvatar(null)
    reset({ rating: 5, status: 'published', featured: false, display_order: 0 })
    setShowForm(true)
  }
  const openEdit = (item) => {
    setEditing(item); setAvatar(null); reset(item); setShowForm(true)
  }

  const saveMutation = useMutation({
    mutationFn: (d) => {
      const fd = new FormData()
      Object.entries(d).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v) })
      if (avatar) fd.append('avatar', avatar)
      return editing ? testimonialsApi.update(editing.id, fd) : testimonialsApi.create(fd)
    },
    onSuccess: () => {
      toast.success(editing ? 'Updated!' : 'Added!')
      qc.invalidateQueries(['testimonials'])
      setShowForm(false)
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Save failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => testimonialsApi.delete(id),
    onSuccess: () => { toast.success('Deleted.'); qc.invalidateQueries(['testimonials']) },
  })

  const handleDelete = async (item) => {
    const ok = await confirm(`Delete testimonial from "${item.name}"?`)
    if (ok) deleteMutation.mutate(item.id)
  }

  const Stars = ({ count }) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        i <= count
          ? <RiStarFill key={i} size={14} className="text-amber-400" />
          : <RiStarLine key={i} size={14} className="text-gray-300" />
      ))}
    </div>
  )

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title="Testimonials" subtitle="What your clients say about you" onAdd={openAdd} />

      {items.length === 0 ? (
        <EmptyState icon={RiStarLine} title="No testimonials yet"
          description="Add client testimonials to build trust." onAdd={openAdd} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.id} className="card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <Stars count={item.rating} />
                <div className="flex items-center gap-1">
                  {item.featured && <span className="badge-blue text-xs">Featured</span>}
                  <StatusBadge status={item.status} />
                </div>
              </div>
              <p className="text-sm text-gray-600 italic line-clamp-3">"{item.content}"</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  {item.avatar_url
                    ? <img src={item.avatar_url} alt={item.name} className="w-9 h-9 rounded-full object-cover" />
                    : <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600">
                        {item.name[0]}
                      </div>
                  }
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.position} {item.company && `at ${item.company}`}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="btn-ghost p-1.5"><RiEditLine size={15} /></button>
                  <button onClick={() => handleDelete(item)} className="btn-ghost p-1.5 text-red-500 hover:bg-red-50">
                    <RiDeleteBinLine size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              {editing ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="label">Person Name *</label>
                <input {...register('name', { required: 'Name is required' })}
                  className={`input ${errors.name ? 'input-error' : ''}`} placeholder="John Doe" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Position</label>
                  <input {...register('position')} className="input" placeholder="CTO" />
                </div>
                <div>
                  <label className="label">Company</label>
                  <input {...register('company')} className="input" placeholder="Acme Inc." />
                </div>
              </div>
              <div>
                <label className="label">Testimonial *</label>
                <textarea {...register('content', { required: 'Content is required' })}
                  rows={4} className={`input resize-none ${errors.content ? 'input-error' : ''}`}
                  placeholder="What they said about you..." />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
              </div>
              <div>
                <label className="label">Avatar Photo</label>
                {editing?.avatar_url && !avatar && (
                  <img src={editing.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover mb-2" />
                )}
                <input type="file" accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0] || null)}
                  className="input py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Rating (1-5)</label>
                  <input {...register('rating', { min: 1, max: 5 })} type="number" min="1" max="5" className="input" />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select {...register('status')} className="input">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input {...register('featured')} type="checkbox" id="t-featured"
                  className="w-4 h-4 text-primary-600 rounded" />
                <label htmlFor="t-featured" className="text-sm font-medium text-gray-700">Featured</label>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
                  {saveMutation.isPending ? 'Saving...' : editing ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog open={confirmState.open} message={confirmState.message}
        onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  )
}
