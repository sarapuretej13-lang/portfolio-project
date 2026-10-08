import Image from 'next/image'
import Link from 'next/link'
import { RiDownloadLine, RiArrowRightLine, RiGithubLine, RiLinkedinLine, RiMailLine } from 'react-icons/ri'

export default function HeroSection({ about }) {
  if (!about) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">Welcome to my Portfolio</h1>
          <p className="text-gray-400 mt-4">Content is being loaded from CMS...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="hero" className="min-h-screen flex items-center px-4 pt-16">
      <div className="max-w-6xl mx-auto w-full py-20">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/20 border border-primary-600/30 text-primary-400 text-sm font-medium mb-6">
              {about.available_for_hire
                ? <>🟢 Available for new opportunities</>
                : <>Currently unavailable</>}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
              Hi, I'm <span className="gradient-text">{about.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-2xl md:text-3xl font-medium text-gray-300 mb-4">{about.title}</p>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              {about.short_bio || about.bio?.slice(0, 200)}
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              <Link href="/#projects" className="btn-primary">
                View My Work <RiArrowRightLine size={18} />
              </Link>
              {about.resume && (
                <a href={about.resume} download className="btn-outline">
                  <RiDownloadLine size={18} /> Download CV
                </a>
              )}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              {about.github_url && (
                <a href={about.github_url} target="_blank" rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                  aria-label="GitHub">
                  <RiGithubLine size={22} />
                </a>
              )}
              {about.linkedin_url && (
                <a href={about.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                  aria-label="Internshala">
                  <RiLinkedinLine size={22} />
                </a>
              )}
              {about.email && (
                <a href={`mailto:${about.email}`}
                  className="p-3 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                  aria-label="Email">
                  <RiMailLine size={22} />
                </a>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="relative shrink-0 animate-fade-in">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-600 to-purple-600 blur-2xl opacity-30" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary-600/30 ring-4 ring-primary-600/10">
                {about.profile_image ? (
                  <Image
                    src={about.profile_image}
                    alt={about.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-700 to-purple-800 flex items-center justify-center">
                    <span className="text-7xl font-bold text-white/80">
                      {about.name?.[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {about.years_of_experience > 0 && (
              <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white rounded-2xl px-4 py-2 shadow-xl">
                <p className="text-2xl font-bold leading-none">{about.years_of_experience}+</p>
                <p className="text-xs opacity-80">Years Exp.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
