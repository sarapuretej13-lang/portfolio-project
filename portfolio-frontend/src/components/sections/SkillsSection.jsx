export default function SkillsSection({ skills, categories }) {
  if (!skills?.length) return null

  // Group by category
  const grouped = categories?.reduce((acc, cat) => {
    const catSkills = skills.filter((s) => s.category === cat.id)
    if (catSkills.length) acc[cat.name] = catSkills
    return acc
  }, {}) || {}

  const uncategorized = skills.filter((s) => !s.category)
  if (uncategorized.length) grouped['Other'] = uncategorized

  const PROFICIENCY_WIDTH = {
    beginner: '25%', intermediate: '50%', advanced: '75%', expert: '100%',
  }

  return (
    <section id="skills" className="py-20 px-4 bg-gray-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">My <span className="gradient-text">Skills</span></h2>
          <p className="section-subtitle">Technologies and tools I work with</p>
        </div>

        <div className="space-y-10">
          {Object.entries(grouped).map(([catName, catSkills]) => (
            <div key={catName}>
              <h3 className="text-lg font-semibold text-primary-400 mb-5 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-primary-500 inline-block" />
                {catName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catSkills.map((skill) => (
                  <div key={skill.id} className="card-dark p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {skill.icon && <span className="text-lg">{skill.icon}</span>}
                        <span className="text-sm font-medium text-white">{skill.name}</span>
                      </div>
                      <span className="text-xs text-primary-400 font-medium">
                        {skill.proficiency_percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-600 to-purple-500 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.proficiency_percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 capitalize">{skill.proficiency}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
