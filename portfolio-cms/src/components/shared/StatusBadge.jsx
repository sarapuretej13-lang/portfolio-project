export default function StatusBadge({ status }) {
  const map = {
    published: 'badge-green',
    draft:     'badge-yellow',
    unread:    'badge-blue',
    read:      'badge-gray',
    replied:   'badge-green',
    archived:  'badge-gray',
  }
  return (
    <span className={map[status] || 'badge-gray'}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  )
}
