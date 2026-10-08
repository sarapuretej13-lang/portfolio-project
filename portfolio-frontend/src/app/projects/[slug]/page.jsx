import { api } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RiGithubLine, RiExternalLinkLine, RiArrowLeftLine } from 'react-icons/ri'

export async function generateMetadata({ params }) {
  try {
    const project = await api.getProject(params.slug)
    return { title: project.title, description: project.short_description || project.description?.slice(0, 160) }
  } catch {
    return { title: 'Project' }
  }
}

export default async function ProjectDetailPage({ params }) {
  let project
  try { project = await api.getProject(params.slug) }
  catch { notFound() }

  return (
    <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
      <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
        <RiArrowLeftLine size={18} /> Back to Projects
      </Link>

      {project.thumbnail_url && (
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image src={project.thumbnail_url} alt={project.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h1>
        <div className="flex gap-3">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm py-2">
              <RiGithubLine size={18} /> Source Code
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2">
              <RiExternalLinkLine size={18} /> Live Demo
            </a>
          )}
        </div>
      </div>

      {project.tech_stack_list?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech_stack_list.map((t) => (
            <span key={t} className="px-3 py-1 text-sm rounded-full bg-primary-600/20 text-primary-300 border border-primary-600/20">{t}</span>
          ))}
        </div>
      )}

      <div className="prose prose-invert prose-gray max-w-none">
        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{project.description}</p>
      </div>
    </div>
  )
}
