import Image from 'next/image'
import Link from 'next/link'
import { RiGithubLine, RiExternalLinkLine, RiArrowRightLine, RiStarFill } from 'react-icons/ri'

function ProjectCard({ project }) {
  return (
    <article className="card-dark overflow-hidden group hover:border-primary-600/50 transition-all duration-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-800 overflow-hidden">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/40 to-purple-900/40">
            <span className="text-4xl">💼</span>
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-amber-500/90 rounded-full text-xs font-medium text-white">
            <RiStarFill size={11} /> Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {project.short_description || project.description}
        </p>

        {/* Tech stack */}
        {project.tech_stack_list?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech_stack_list.slice(0, 5).map((t) => (
              <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-primary-600/20 text-primary-300 border border-primary-600/20">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <Link href={`/projects/${project.slug}`}
            className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1">
            View Details <RiArrowRightLine size={14} />
          </Link>
          <div className="flex gap-2">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                aria-label="GitHub" title="Source Code">
                <RiGithubLine size={17} />
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                aria-label="Live Demo" title="Live Demo">
                <RiExternalLinkLine size={17} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ProjectsSection({ projects }) {
  if (!projects?.length) return null

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">My <span className="gradient-text">Projects</span></h2>
          <p className="section-subtitle">Things I've built and shipped</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/projects" className="btn-outline">
            View All Projects <RiArrowRightLine size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
