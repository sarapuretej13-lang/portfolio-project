export default function ServicesSection({ services }) {
  if (!services?.length) return null
  return (
    <section id="services" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">What I <span className="gradient-text">Offer</span></h2>
          <p className="section-subtitle">Services I provide to help your business grow</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id}
              className="card-dark p-6 hover:border-primary-600/50 transition-all duration-300 group">
              {service.icon && (
                <div className="text-4xl mb-4">{service.icon}</div>
              )}
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {service.short_description || service.description}
              </p>
              {service.features_list?.length > 0 && (
                <ul className="space-y-2">
                  {service.features_list.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
