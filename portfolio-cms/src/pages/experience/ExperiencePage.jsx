import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { experienceApi } from '@/api'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useConfirm } from '@/hooks/useConfirm'
import { RiBriefcaseLine, RiEditLine, RiDeleteBinLine, RiMapPinLine } from 'react-icons/ri'
import { format } from 'date-fns'

const TYPE_LABELS = {
  work: '💼 Work',
  education: '🎓 Education',
  volunteer: '🤝 Volunteer',
  certification: '📜 Certification',
}

export default function ExperiencePage() {
  const qc = useQueryClient()
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: () => experienceApi.list({ page_size: 100 }),
  })
  const items = data?.data?.results || []

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { type: 'work', status: 'published', is_current: false, display_order: 0 },
  })

  const isCurrent = watch('is_current')

  const openAdd = () => {
    setEditing(null)
    reset({ type: 'work', status: 'published', is_current: false, display_order: 0 })
    setShowForm(true)
  }
  const openEdit = (item) => { setEditing(item); reset(item); setShowForm(true) }

  const saveMutation = useMutation({
    mutationFn: (d) => editing ? experienceApi.update(editing.id, d) : experienceApi.create(d),
    onSuccess: () => {
      toast.success(editing ? 'Updated!' : 'Added!')
      qc.invalidateQueries(['experience'])
      setShowForm(false)
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Save failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => experienceApi.delete(id),
    onSuccess: () => { toast.success('Deleted.'); qc.invalidateQueries(['experience']) },
  })

  const handleDelete = async (item) => {
    const ok = await confirm(`Delete "${item.position} at ${item.company}"?`)
    if (ok) deleteMutation.mutate(item.id)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title="Experience" subtitle="Work history, education & certifications" onAdd={openAdd} />

      {items.length === 0 ? (
        <EmptyState icon={RiBriefcaseLine} title="No experience entries yet"
          description="Add your work history, education, and certifications." onAdd={openAdd} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 text-lg">
                  {TYPE_LABELS[item.type]?.split(' ')[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800">{item.position}</h3>
                    {item.is_current && <span className="badge-green">Current</span>}
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-sm text-primary-600 font-medium">{item.company}</p>
                  {item.location && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <RiMapPinLine size={12} /> {item.location}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {item.start_date && format(new Date(item.start_date), 'MMM yyyy')}
                    {' – '}
                    {item.is_current ? 'Present' : item.end_date
                      ? format(new Date(item.end_date), 'MMM yyyy')
                      : '—'}
                    {item.duration && <span className="ml-1 text-gray-500">· {item.duration}</span>}
                  </p>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(item)} className="btn-ghost p-1.5"><RiEditLine size={16} /></button>
                <button onClick={() => handleDelete(item)} className="btn-ghost p-1.5 text-red-500 hover:bg-red-50">
                  <RiDeleteBinLine size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              {editing ? 'Edit Experience' : 'Add Experience'}
            </h3>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Type</label>
                  <select {...register('type')} className="input">
                    {Object.entries(TYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l.split(' ')[1]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select {...register('status')} className="input">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Position / Degree *</label>
                <input {...register('position', { required: 'Position is required' })}
                  className={`input ${errors.position ? 'input-error' : ''}`}
                  placeholder="Senior Developer / B.Sc. Computer Science" />
                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
              </div>
              <div>
                <label className="label">Company / Institution *</label>
                <input {...register('company', { required: 'Company is required' })}
                  className={`input ${errors.company ? 'input-error' : ''}`}
                  placeholder="Company or School Name" />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
              </div>
              <div>
                <label className="label">Location</label>
                <input {...register('location')} className="input" placeholder="New York, USA" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date *</label>
                  <input {...register('start_date', { required: 'Start date is required' })}
                    type="date" className={`input ${errors.start_date ? 'input-error' : ''}`} />
                  {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>}
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input {...register('end_date')} type="date" className="input" disabled={isCurrent} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input {...register('is_current')} type="checkbox" id="is_current"
                  className="w-4 h-4 text-primary-600 rounded" />
                <label htmlFor="is_current" className="text-sm font-medium text-gray-700">
                  Currently working here
                </label>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea {...register('description')} rows={3}
                  className="input resize-none" placeholder="Key responsibilities and achievements..." />
              </div>
              <div>
                <label className="label">Technologies Used</label>
                <input {...register('technologies')} className="input"
                  placeholder="React, Node.js, AWS (comma-separated)" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
                  {saveMutation.isPending ? 'Saving...' : editing ? 'Update' : 'Add Entry'}
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
