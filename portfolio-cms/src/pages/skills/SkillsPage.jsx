import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { skillsApi } from '@/api'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useConfirm } from '@/hooks/useConfirm'
import { RiCodeSSlashLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri'

const PROFICIENCY_COLORS = {
  beginner: 'bg-gray-200',
  intermediate: 'bg-blue-400',
  advanced: 'bg-primary-500',
  expert: 'bg-green-500',
}

export default function SkillsPage() {
  const qc = useQueryClient()
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => skillsApi.list({ page_size: 100 }),
  })
  const { data: catData } = useQuery({
    queryKey: ['skill-categories'],
    queryFn: () => skillsApi.listCategories(),
  })

  const skills = data?.data?.results || []
  const categories = catData?.data || []

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { proficiency_percentage: 80, status: 'published', display_order: 0 },
  })

  const openAdd = () => { setEditing(null); reset({ proficiency_percentage: 80, status: 'published', display_order: 0 }); setShowForm(true) }
  const openEdit = (skill) => { setEditing(skill); reset(skill); setShowForm(true) }

  const saveMutation = useMutation({
    mutationFn: (data) => editing ? skillsApi.update(editing.id, data) : skillsApi.create(data),
    onSuccess: () => {
      toast.success(editing ? 'Skill updated!' : 'Skill added!')
      qc.invalidateQueries(['skills'])
      setShowForm(false)
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Save failed.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => skillsApi.delete(id),
    onSuccess: () => { toast.success('Skill deleted.'); qc.invalidateQueries(['skills']) },
  })

  const handleDelete = async (skill) => {
    const ok = await confirm(`Delete "${skill.name}"? This cannot be undone.`)
    if (ok) deleteMutation.mutate(skill.id)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title="Skills"
        subtitle={`${skills.length} skill${skills.length !== 1 ? 's' : ''} total`}
        onAdd={openAdd}
      />

      {skills.length === 0 ? (
        <EmptyState icon={RiCodeSSlashLine} title="No skills yet" description="Add your technical skills to showcase on your portfolio." onAdd={openAdd} />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'Category', 'Proficiency', 'Level', 'Status', 'Order', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{skill.name}</td>
                  <td className="px-4 py-3 text-gray-500">{skill.category_name || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${PROFICIENCY_COLORS[skill.proficiency] || 'bg-primary-500'}`}
                          style={{ width: `${skill.proficiency_percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{skill.proficiency_percentage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{skill.proficiency}</td>
                  <td className="px-4 py-3"><StatusBadge status={skill.status} /></td>
                  <td className="px-4 py-3 text-gray-500">{skill.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(skill)} className="btn-ghost p-1.5" title="Edit">
                        <RiEditLine size={16} />
                      </button>
                      <button onClick={() => handleDelete(skill)} className="btn-ghost p-1.5 text-red-500 hover:bg-red-50" title="Delete">
                        <RiDeleteBinLine size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Skill Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">{editing ? 'Edit Skill' : 'Add Skill'}</h3>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="label">Skill Name *</label>
                <input {...register('name', { required: 'Name is required' })} className={`input ${errors.name ? 'input-error' : ''}`} placeholder="e.g. Python" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Category</label>
                <select {...register('category')} className="input">
                  <option value="">— Select Category —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Proficiency Level</label>
                  <select {...register('proficiency')} className="input">
                    {['beginner', 'intermediate', 'advanced', 'expert'].map((p) => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Percentage (0-100)</label>
                  <input {...register('proficiency_percentage', { min: 0, max: 100 })} type="number" className="input" />
                </div>
              </div>
              <div>
                <label className="label">Icon Class</label>
                <input {...register('icon')} className="input" placeholder="e.g. devicon-python-plain" />
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
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
                  {saveMutation.isPending ? 'Saving...' : editing ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmState.open}
        message={confirmState.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  )
}
