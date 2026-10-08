import Image from 'next/image'
import { RiMapPinLine, RiMailLine, RiPhoneLine, RiDownloadLine, RiCheckboxCircleLine } from 'react-icons/ri'

export default function AboutSection({ about }) {
  if (!about) return null

  const stats = [
    { value: `${about.years_of_experience}+`, label: 'Years Experience' },
    { value: about.available_for_hire ? 'Open' : 'Busy', label: 'For Hire' },
  ]

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">About <span className="gradient-text">Me</span></h2>
          <p className="section-subtitle">Get to know me better</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden">
              {about.profile_image ? (
                <Image src={about.profile_image} alt={about.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-700 to-purple-800 flex items-center justify-center rounded-2xl">
                  <span className="text-8xl font-bold text-white/60">{about.name?.[0]}</span>
                </div>
              )}
            </div>
            {/* Floating stats */}
            <div className="absolute -bottom-5 -right-5 hidden lg:flex gap-3">
              {stats.map((s) => (
                <div key={s.label} className="card-dark px-4 py-3 text-center shadow-xl">
                  <p className="text-xl font-bold gradient-text">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">{about.title}</h3>
            <p className="text-gray-400 leading-relaxed mb-6">{about.bio}</p>

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { icon: RiMapPinLine, label: 'Location', value: about.location },
                { icon: RiMailLine,   label: 'Email',    value: about.email },
                { icon: RiPhoneLine,  label: 'Phone',    value: about.phone },
              ].filter((i) => i.value).map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 card-dark rounded-xl">
                  <Icon size={18} className="text-primary-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-sm text-gray-200">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {about.resume && (
                <a href={about.resume} download className="btn-primary">
                  <RiDownloadLine size={18} /> Download Resume
                </a>
              )}
              <a href={`mailto:${about.email}`} className="btn-outline">
                <RiMailLine size={18} /> Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
