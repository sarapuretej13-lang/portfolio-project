import { format } from 'date-fns'

const TYPE_COLORS = {
  work:          'bg-primary-600',
  education:     'bg-purple-600',
  certification: 'bg-amber-600',
  volunteer:     'bg-green-600',
}

export default function ExperienceSection({ experience }) {
  if (!experience?.length) return null

  const work = experience.filter((e) => e.type === 'work')
  const education = experience.filter((e) => e.type === 'education' || e.type === 'certification')

  function Timeline({ items, title }) {
    if (!items.length) return null
    return (
      <div>
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-0.5 bg-primary-500" />
          {title}
        </h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />
          <div className="space-y-8">
            {items.map((item, i) => (
              <div key={item.id} className="relative pl-12">
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${TYPE_COLORS[item.type] || 'bg-primary-600'}
                  flex items-center justify-center z-10 text-sm`}>
                  {item.type === 'work' ? '💼' : item.type === 'education' ? '🎓' : '📜'}
                </div>
                <div className="card-dark p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-base font-bold text-white">{item.position}</h4>
                      <p className="text-primary-400 text-sm font-medium">{item.company}</p>
                      {item.location && <p className="text-gray-500 text-xs">{item.location}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">
                        {item.start_date && format(new Date(item.start_date), 'MMM yyyy')}
                        {' – '}
                        {item.is_current ? (
                          <span className="text-green-400 font-medium">Present</span>
                        ) : item.end_date
                          ? format(new Date(item.end_date), 'MMM yyyy')
                          : '—'}
                      </p>
                      {item.duration && (
                        <p className="text-xs text-gray-600 mt-0.5">{item.duration}</p>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-400 mt-3 leading-relaxed">{item.description}</p>
                  )}
                  {item.technologies_list?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.technologies_list.map((t) => (
                        <span key={t} className="px-2 py-0.5 text-xs rounded bg-gray-800 text-gray-400">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="experience" className="py-20 px-4 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">My <span className="gradient-text">Experience</span></h2>
          <p className="section-subtitle">Where I've worked and studied</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Timeline items={work} title="Work Experience" />
          <Timeline items={education} title="Education" />
        </div>
      </div>
    </section>
  )
}
