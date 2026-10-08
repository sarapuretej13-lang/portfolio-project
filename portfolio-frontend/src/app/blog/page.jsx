import { api } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { RiTimeLine, RiEyeLine, RiArrowRightLine } from 'react-icons/ri'
import { format } from 'date-fns'

export const metadata = { title: 'Blog' }

export default async function BlogPage() {
  let blogs = []
  try {
    const data = await api.getBlogs()
    blogs = data?.results || []
  } catch { /* empty */ }

  return (
    <div className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Blog & <span className="gradient-text">Articles</span>
        </h1>
        <p className="text-gray-400 text-lg">Thoughts, tutorials and insights.</p>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-500 text-center py-20">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <article key={blog.id} className="card-dark overflow-hidden group hover:border-primary-600/50 transition-all duration-300 flex flex-col">
              {blog.cover_image_url && (
                <div className="relative h-48 overflow-hidden">
                  <Image src={blog.cover_image_url} alt={blog.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                {blog.category_name && (
                  <span className="text-xs font-medium text-primary-400 mb-2">{blog.category_name}</span>
                )}
                <h2 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{blog.excerpt}</p>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <RiTimeLine size={12} /> {blog.read_time} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <RiEyeLine size={12} /> {blog.views}
                    </span>
                  </div>
                  <Link href={`/blog/${blog.slug}`}
                    className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1">
                    Read <RiArrowRightLine size={13} />
                  </Link>
                </div>
                {blog.published_at && (
                  <p className="text-xs text-gray-600 mt-2">
                    {format(new Date(blog.published_at), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
