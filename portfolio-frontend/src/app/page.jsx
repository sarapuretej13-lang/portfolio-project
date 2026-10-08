import { api } from '@/lib/api'
import HeroSection        from '@/components/sections/HeroSection'
import AboutSection       from '@/components/sections/AboutSection'
import SkillsSection      from '@/components/sections/SkillsSection'
import ProjectsSection    from '@/components/sections/ProjectsSection'
import ExperienceSection  from '@/components/sections/ExperienceSection'
import ServicesSection    from '@/components/sections/ServicesSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import ContactSection     from '@/components/sections/ContactSection'

async function getData() {
  const [about, skillsData, categories, projects, experience, testimonials, services] =
    await Promise.allSettled([
      api.getAbout(),
      api.getSkills(),
      api.getSkillCategories(),
      api.getFeaturedProjects(),
      api.getExperience(),
      api.getTestimonials(),
      api.getServices(),
    ])

  return {
    about:        about.status === 'fulfilled'        ? about.value       : null,
    skills:       skillsData.status === 'fulfilled'   ? skillsData.value?.results : [],
    categories:   categories.status === 'fulfilled'   ? categories.value  : [],
    projects:     projects.status === 'fulfilled'     ? projects.value?.results : [],
    experience:   experience.status === 'fulfilled'   ? experience.value?.results : [],
    testimonials: testimonials.status === 'fulfilled' ? testimonials.value?.results : [],
    services:     services.status === 'fulfilled'     ? services.value?.results : [],
  }
}

export default async function HomePage() {
  const { about, skills, categories, projects, experience, testimonials, services } = await getData()

  return (
    <>
      <HeroSection        about={about} />
      <AboutSection       about={about} />
      <SkillsSection      skills={skills} categories={categories} />
      <ProjectsSection    projects={projects} />
      <ExperienceSection  experience={experience} />
      <ServicesSection    services={services} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection     about={about} />
    </>
  )
}
