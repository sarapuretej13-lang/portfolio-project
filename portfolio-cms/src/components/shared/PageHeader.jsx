import { useNavigate } from 'react-router-dom'
import { RiArrowLeftLine, RiAddLine } from 'react-icons/ri'

export default function PageHeader({ title, subtitle, onAdd, addLabel = 'Add New', backTo }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Go back"
          >
            <RiArrowLeftLine size={20} />
          </button>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {onAdd && (
        <button onClick={onAdd} className="btn-primary shrink-0">
          <RiAddLine size={18} />
          {addLabel}
        </button>
      )}
    </div>
  )
}
