import { RiAddLine } from 'react-icons/ri'

export default function EmptyState({ icon: Icon, title, description, onAdd, addLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Icon size={32} className="text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-sm text-gray-400 mt-1 max-w-xs">{description}</p>}
      {onAdd && (
        <button onClick={onAdd} className="btn-primary mt-5">
          <RiAddLine size={18} />
          {addLabel || 'Add New'}
        </button>
      )}
    </div>
  )
}
