import { api } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RiArrowLeftLine, RiTimeLine, RiCalendarLine, RiEyeLine } from 'react-icons/ri'
import { format } from 'date-fns'

export async function generateMetadata({ params }) {
  try {
    const blog = await api.getBlog(params.slug)
    return {
      title: blog.title,
      description: blog.excerpt || blog.content?.replace(/<[^>]+>/g, '').slice(0, 160),
    }
  } catch {
    return { title: 'Blog Post' }
  }
}

export default async function BlogDetailPage({ params }) {
  let blog
  try { blog = await api.getBlog(params.slug) }
  catch { notFound() }

  return (
    <div className="pt-24 pb-20 px-4 max-w-3xl mx-auto">
      <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
        <RiArrowLeftLine size={18} /> Back to Blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        {blog.category_name && (
          <span className="text-sm font-medium text-primary-400 mb-3 block">{blog.category_name}</span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{blog.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {blog.author_name && <span>By <span className="text-gray-300">{blog.author_name}</span></span>}
          {blog.published_at && (
            <span className="flex items-center gap-1.5">
              <RiCalendarLine size={14} />
              {format(new Date(blog.published_at), 'MMMM d, yyyy')}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <RiTimeLine size={14} /> {blog.read_time} min read
          </span>
          <span className="flex items-center gap-1.5">
            <RiEyeLine size={14} /> {blog.views} views
          </span>
        </div>

        {blog.tags_list?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags_list.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {blog.cover_image_url && (
        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10">
          <Image src={blog.cover_image_url} alt={blog.title} fill className="object-cover" priority />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-invert prose-gray max-w-none
          prose-headings:text-white prose-p:text-gray-300 prose-a:text-primary-400
          prose-strong:text-white prose-code:text-primary-300 prose-pre:bg-gray-900
          prose-blockquote:border-primary-600 prose-blockquote:text-gray-400"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  )
}
