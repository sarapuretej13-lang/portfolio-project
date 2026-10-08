import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { projectsApi } from '@/api'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useConfirm } from '@/hooks/useConfirm'
import { RiFolderLine, RiEditLine, RiDeleteBinLine, RiStarFill, RiExternalLinkLine, RiGithubLine } from 'react-icons/ri'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm()

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list({ page_size: 100 }),
  })
  const projects = data?.data?.results || []

  const deleteMutation = useMutation({
    mutationFn: (slug) => projectsApi.delete(slug),
    onSuccess: () => { toast.success('Project deleted.'); qc.invalidateQueries(['projects']) },
  })

  const handleDelete = async (project) => {
    const ok = await confirm(`Delete "${project.title}"? This cannot be undone.`)
    if (ok) deleteMutation.mutate(project.slug)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''}`}
        onAdd={() => navigate('/projects/new')}
      />

      {projects.length === 0 ? (
        <EmptyState icon={RiFolderLine} title="No projects yet" description="Showcase your work by adding projects." onAdd={() => navigate('/projects/new')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project.id} className="card overflow-hidden hover:shadow-md transition-shadow">
              {project.thumbnail_url ? (
                <img src={project.thumbnail_url} alt={project.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <RiFolderLine size={40} className="text-primary-400" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{project.title}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    {project.featured && <RiStarFill size={14} className="text-amber-400" />}
                    <StatusBadge status={project.status} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {project.short_description || project.description}
                </p>
                {project.tech_stack_list?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tech_stack_list.slice(0, 4).map((t) => (
                      <span key={t} className="badge bg-gray-100 text-gray-600 text-xs">{t}</span>
                    ))}
                    {project.tech_stack_list.length > 4 && (
                      <span className="badge bg-gray-100 text-gray-500 text-xs">+{project.tech_stack_list.length - 4}</span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-700 transition-colors" title="GitHub">
                        <RiGithubLine size={16} />
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600 transition-colors" title="Live Demo">
                        <RiExternalLinkLine size={16} />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/projects/${project.slug}/edit`)} className="btn-ghost p-1.5">
                      <RiEditLine size={15} />
                    </button>
                    <button onClick={() => handleDelete(project)} className="btn-ghost p-1.5 text-red-500 hover:bg-red-50">
                      <RiDeleteBinLine size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog open={confirmState.open} message={confirmState.message} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  )
}
