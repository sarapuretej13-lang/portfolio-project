import Image from 'next/image'
import { RiStarFill, RiDoubleQuotesL } from 'react-icons/ri'

export default function TestimonialsSection({ testimonials }) {
  if (!testimonials?.length) return null
  return (
    <section id="testimonials" className="py-20 px-4 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">What <span className="gradient-text">Clients Say</span></h2>
          <p className="section-subtitle">Feedback from people I've worked with</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="card-dark p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <RiDoubleQuotesL size={28} className="text-primary-500/50" />
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <RiStarFill key={i} size={14}
                      className={i <= t.rating ? 'text-amber-400' : 'text-gray-700'} />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed italic flex-1">"{t.content}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
                {t.avatar_url ? (
                  <Image src={t.avatar_url} alt={t.name} width={40} height={40}
                    className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-600/30 flex items-center justify-center
                    text-primary-400 font-bold text-sm">
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.position}{t.company && ` · ${t.company}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
