'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { RiSendPlaneLine, RiMapPinLine, RiMailLine, RiGithubLine, RiLinkedinLine } from 'react-icons/ri'
import { api } from '@/lib/api'

export default function ContactSection({ about }) {
  const [sending, setSending] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setSending(true)
    try {
      await api.sendContact(data)
      toast.success("Message sent! I'll get back to you soon 🙌")
      reset()
    } catch (err) {
      const msg = err?.message || err?.non_field_errors?.[0] || 'Failed to send. Try again.'
      toast.error(msg)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
          <p className="section-subtitle">Have a project in mind? Let's talk!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-6">
            <p className="text-gray-400 leading-relaxed text-lg">
              I'm always open to new opportunities and interesting projects.
              Whether you have a question or just want to say hi, my inbox is always open!
            </p>

            <div className="space-y-4">
              {about?.location && (
                <div className="flex items-center gap-4 p-4 card-dark rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center">
                    <RiMapPinLine size={20} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Location</p>
                    <p className="text-white text-sm">{about.location}</p>
                  </div>
                </div>
              )}
              {about?.email && (
                <a href={`mailto:${about.email}`}
                  className="flex items-center gap-4 p-4 card-dark rounded-xl hover:border-primary-600/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center">
                    <RiMailLine size={20} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-white text-sm">{about.email}</p>
                  </div>
                </a>
              )}
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {about?.github_url && (
                <a href={about.github_url} target="_blank" rel="noopener noreferrer"
                  className="p-3 card-dark rounded-xl text-gray-400 hover:text-white hover:border-primary-600/50 transition-all"
                  aria-label="GitHub">
                  <RiGithubLine size={22} />
                </a>
              )}
              {about?.linkedin_url && (
                <a href={about.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="p-3 card-dark rounded-xl text-gray-400 hover:text-white hover:border-primary-600/50 transition-all"
                  aria-label="Internshala">
                  <RiLinkedinLine size={22} />
                </a>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Your Name"
                  className={`input-dark ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                  })}
                  type="email"
                  placeholder="you@email.com"
                  className={`input-dark ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Subject</label>
              <input
                {...register('subject')}
                placeholder="What's this about?"
                className="input-dark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Message *</label>
              <textarea
                {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Too short' } })}
                rows={5}
                placeholder="Tell me about your project..."
                className={`input-dark resize-none ${errors.message ? 'border-red-500' : ''}`}
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn-primary w-full justify-center py-3.5"
            >
              {sending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RiSendPlaneLine size={18} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
