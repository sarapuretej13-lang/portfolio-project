import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { RiUploadCloud2Line, RiCloseLine } from 'react-icons/ri'

export default function ImageUpload({ value, onChange, label = 'Upload Image', accept = 'image/*' }) {
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
    onChange(file)
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  })

  const currentImage = preview || value

  const clear = (e) => {
    e.stopPropagation()
    setPreview(null)
    onChange(null)
  }

  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        {currentImage ? (
          <div className="relative inline-block">
            <img
              src={currentImage}
              alt="Preview"
              className="h-32 w-auto max-w-full rounded-lg object-cover mx-auto"
            />
            <button
              type="button"
              onClick={clear}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
            >
              <RiCloseLine size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <RiUploadCloud2Line size={32} className="text-gray-400" />
            <p className="text-sm text-gray-500">
              {isDragActive ? 'Drop the file here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
