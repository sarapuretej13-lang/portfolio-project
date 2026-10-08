import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { blogsApi } from '@/api'
import PageHeader from '@/components/shared/PageHeader'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
}

export default function BlogForm() {
  const { slug } = useParams()
  const isEdit = Boolean(slug)
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogsApi.get(slug),
    enabled: isEdit,
  })

  const { data: catData } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => blogsApi.listCategories(),
  })

  const blog = data?.data
  const categories = catData?.data || []

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { status: 'draft', featured: false, read_time: 5 },
  })

  useEffect(() => {
    if (blog) {
      reset(blog)
      setContent(blog.content || '')
    }
  }, [blog, reset])

  const mutation = useMutation({
    mutationFn: (formData) => {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined && k !== 'content') fd.append(k, v)
      })
      fd.append('content', content)
      if (coverImage) fd.append('cover_image', coverImage)
      return isEdit ? blogsApi.update(slug, fd) : blogsApi.create(fd)
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Post updated!' : 'Post created!')
      qc.invalidateQueries(['blogs'])
      navigate('/blogs')
    },
    onError: (e) => toast.error(e.response?.data?.detail || 'Save failed.'),
  })

  if (isEdit && isLoading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Blog Post' : 'New Blog Post'} backTo="/blogs" />

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="max-w-4xl space-y-6">
        {/* Main Fields */}
        <div className="card p-6 space-y-5">
          <div>
            <label className="label">Title *</label>
            <input {...register('title', { required: 'Title is required' })}
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="Post title..." />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Excerpt</label>
            <input {...register('excerpt')} className="input"
              placeholder="Short summary shown in post listings..." />
          </div>
          <div>
            <label className="label">Content *</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={QUILL_MODULES}
                placeholder="Write your post content here..."
              />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 border-b pb-3">Cover Image</h3>
          {isEdit && blog?.cover_image_url && !coverImage && (
            <img src={blog.cover_image_url} alt="Cover" className="h-40 w-auto rounded-lg object-cover" />
          )}
          <input type="file" accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0] || null)}
            className="input py-2" />
        </div>

        {/* Metadata */}
        <div className="card p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-800 border-b pb-3">Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select {...register('category')} className="input">
                <option value="">— No Category —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Read Time (minutes)</label>
              <input {...register('read_time')} type="number" min="1" className="input" />
            </div>
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="label">Tags</label>
              <input {...register('tags')} className="input"
                placeholder="django, python, tutorial (comma-separated)" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input {...register('featured')} type="checkbox" id="blog-featured"
              className="w-4 h-4 text-primary-600 rounded" />
            <label htmlFor="blog-featured" className="text-sm font-medium text-gray-700">
              Featured post
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/blogs')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={mutation.isPending} className="btn-primary px-8">
            {mutation.isPending ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
            ) : isEdit ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
