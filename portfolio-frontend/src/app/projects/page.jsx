import { api } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { RiGithubLine, RiExternalLinkLine, RiArrowRightLine, RiStarFill } from 'react-icons/ri'

export const metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  let projects = []
  try {
    const data = await api.getProjects()
    projects = data?.results || []
  } catch { /* show empty state */ }

  return (
    <div className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          My <span className="gradient-text">Projects</span>
        </h1>
        <p className="text-gray-400 text-lg">All the things I've built and shipped.</p>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No projects yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article key={project.id} className="card-dark overflow-hidden group hover:border-primary-600/50 transition-all duration-300 flex flex-col">
              <div className="relative h-48 bg-gray-800">
                {project.thumbnail_url ? (
                  <Image src={project.thumbnail_url} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/40 to-purple-900/40 text-4xl">💼</div>
                )}
                {project.featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-amber-500/90 rounded-full text-xs font-medium text-white">
                    <RiStarFill size={11} /> Featured
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                  {project.short_description || project.description}
                </p>
                {project.tech_stack_list?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech_stack_list.slice(0, 5).map((t) => (
                      <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-primary-600/20 text-primary-300 border border-primary-600/20">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <Link href={`/projects/${project.slug}`} className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1">
                    View Details <RiArrowRightLine size={14} />
                  </Link>
                  <div className="flex gap-2">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all" aria-label="GitHub"><RiGithubLine size={17} /></a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all" aria-label="Live"><RiExternalLinkLine size={17} /></a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
