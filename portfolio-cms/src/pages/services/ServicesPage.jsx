import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { servicesApi } from '@/api'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useConfirm } from '@/hooks/useConfirm'
import { RiServiceLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri'

export default function ServicesPage() {
  const qc = useQueryClient()
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.list({ page_size: 100 }),
  })
  const items = data?.data?.results || []

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { status: 'published', featured: false, display_order: 0 },
  })

  const openAdd = () => {
    setEditing(null)
    reset({ status: 'published', featured: false, display_order: 0 })
    setShowForm(true)
  }
  const openEdit = (item) => { setEditing(item); reset(item); setShowForm(true) }

  const saveMutation = useMutation({
    mutationFn: (d) => editing ? servicesApi.update(editing.id, d) : servicesApi.create(d),
    onSuccess: () => {
      toast.success(editing ? 'Updated!' : 'Added!')
      qc.invalidateQueries(['services'])
      setShowForm(false)
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Save failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => servicesApi.delete(id),
    onSuccess: () => { toast.success('Deleted.'); qc.invalidateQueries(['services']) },
  })

  const handleDelete = async (item) => {
    const ok = await confirm(`Delete service "${item.title}"?`)
    if (ok) deleteMutation.mutate(item.id)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title="Services" subtitle="Services you offer to clients" onAdd={openAdd} />

      {items.length === 0 ? (
        <EmptyState icon={RiServiceLine} title="No services yet"
          description="Add the services you offer." onAdd={openAdd} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.id} className="card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {item.icon && (
                    <span className="text-2xl">{item.icon}</span>
                  )}
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                </div>
                <div className="flex items-center gap-1">
                  {item.featured && <span className="badge-blue text-xs">Featured</span>}
                  <StatusBadge status={item.status} />
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-3">
                {item.short_description || item.description}
              </p>
              {item.features_list?.length > 0 && (
                <ul className="text-xs text-gray-400 space-y-1">
                  {item.features_list.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2 pt-3 border-t border-gray-100 justify-end">
                <button onClick={() => openEdit(item)} className="btn-ghost p-1.5"><RiEditLine size={15} /></button>
                <button onClick={() => handleDelete(item)} className="btn-ghost p-1.5 text-red-500 hover:bg-red-50">
                  <RiDeleteBinLine size={15} />
                </button>
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
              {editing ? 'Edit Service' : 'Add Service'}
            </h3>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="label">Title *</label>
                <input {...register('title', { required: 'Title is required' })}
                  className={`input ${errors.title ? 'input-error' : ''}`} placeholder="Web Development" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="label">Icon (emoji or class)</label>
                <input {...register('icon')} className="input" placeholder="💻 or fa-code" />
              </div>
              <div>
                <label className="label">Short Description</label>
                <input {...register('short_description')} className="input"
                  placeholder="Shown in service card" />
              </div>
              <div>
                <label className="label">Full Description *</label>
                <textarea {...register('description', { required: 'Description is required' })}
                  rows={4} className={`input resize-none ${errors.description ? 'input-error' : ''}`}
                  placeholder="Detailed service description..." />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
              <div>
                <label className="label">Features (one per line)</label>
                <textarea {...register('features')} rows={4} className="input resize-none"
                  placeholder={"Responsive Design\nSEO Optimized\nFast Performance"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Status</label>
                  <select {...register('status')} className="input">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="label">Display Order</label>
                  <input {...register('display_order')} type="number" min="0" className="input" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input {...register('featured')} type="checkbox" id="s-featured"
                  className="w-4 h-4 text-primary-600 rounded" />
                <label htmlFor="s-featured" className="text-sm font-medium text-gray-700">Featured</label>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
                  {saveMutation.isPending ? 'Saving...' : editing ? 'Update' : 'Add Service'}
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
