import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { blogsApi } from '@/api'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useConfirm } from '@/hooks/useConfirm'
import { RiArticleLine, RiEditLine, RiDeleteBinLine, RiStarFill, RiEyeLine } from 'react-icons/ri'
import { format } from 'date-fns'

export default function BlogsPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm()

  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogsApi.list({ page_size: 100 }),
  })
  const blogs = data?.data?.results || []

  const deleteMutation = useMutation({
    mutationFn: (slug) => blogsApi.delete(slug),
    onSuccess: () => { toast.success('Post deleted.'); qc.invalidateQueries(['blogs']) },
  })

  const handleDelete = async (blog) => {
    const ok = await confirm(`Delete "${blog.title}"? This cannot be undone.`)
    if (ok) deleteMutation.mutate(blog.slug)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        subtitle={`${blogs.length} post${blogs.length !== 1 ? 's' : ''}`}
        onAdd={() => navigate('/blogs/new')}
      />

      {blogs.length === 0 ? (
        <EmptyState icon={RiArticleLine} title="No blog posts yet"
          description="Share your knowledge by writing blog posts."
          onAdd={() => navigate('/blogs/new')} />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Title', 'Category', 'Status', 'Views', 'Published', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {blog.featured && <RiStarFill size={14} className="text-amber-400 shrink-0" />}
                      <span className="font-medium text-gray-800 line-clamp-1">{blog.title}</span>
                    </div>
                    {blog.excerpt && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{blog.excerpt}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{blog.category_name || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={blog.status} /></td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-500">
                      <RiEyeLine size={14} /> {blog.views}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {blog.published_at
                      ? format(new Date(blog.published_at), 'MMM d, yyyy')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/blogs/${blog.slug}/edit`)} className="btn-ghost p-1.5">
                        <RiEditLine size={16} />
                      </button>
                      <button onClick={() => handleDelete(blog)} className="btn-ghost p-1.5 text-red-500 hover:bg-red-50">
                        <RiDeleteBinLine size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={confirmState.open} message={confirmState.message}
        onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  )
}
