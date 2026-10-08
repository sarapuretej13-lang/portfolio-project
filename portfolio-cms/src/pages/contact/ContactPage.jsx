import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { contactApi } from '@/api'
import PageHeader from '@/components/shared/PageHeader'
import StatusBadge from '@/components/shared/StatusBadge'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EmptyState from '@/components/shared/EmptyState'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useConfirm } from '@/hooks/useConfirm'
import { RiMailLine, RiDeleteBinLine, RiMailOpenLine, RiCheckLine } from 'react-icons/ri'
import { format } from 'date-fns'

const STATUS_OPTIONS = ['unread', 'read', 'replied', 'archived']

export default function ContactPage() {
  const qc = useQueryClient()
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm()
  const [selected, setSelected] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: () => contactApi.list({ page_size: 100 }),
  })
  const messages = data?.data?.results || []

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => contactApi.update(id, { status }),
    onSuccess: () => { toast.success('Status updated.'); qc.invalidateQueries(['contact-messages']) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => contactApi.delete(id),
    onSuccess: () => {
      toast.success('Message deleted.')
      qc.invalidateQueries(['contact-messages'])
      setSelected(null)
    },
  })

  const handleDelete = async (msg) => {
    const ok = await confirm(`Delete message from "${msg.name}"?`)
    if (ok) deleteMutation.mutate(msg.id)
  }

  const unreadCount = messages.filter((m) => m.status === 'unread').length

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <PageHeader
        title="Contact Messages"
        subtitle={unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : `${messages.length} messages total`}
      />

      {messages.length === 0 ? (
        <EmptyState icon={RiMailLine} title="No messages yet" description="Contact form submissions will appear here." />
      ) : (
        <div className="flex gap-5 h-[calc(100vh-200px)]">
          {/* Message list */}
          <div className="w-80 shrink-0 card overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelected(msg)
                  if (msg.status === 'unread') {
                    updateMutation.mutate({ id: msg.id, status: 'read' })
                  }
                }}
                className={`w-full text-left px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors
                  ${selected?.id === msg.id ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-800 truncate">{msg.name}</span>
                  <StatusBadge status={msg.status} />
                </div>
                <p className="text-xs text-gray-500 truncate">{msg.subject || '(no subject)'}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {format(new Date(msg.created_at), 'MMM d, yyyy')}
                </p>
              </button>
            ))}
          </div>

          {/* Message detail */}
          <div className="flex-1 card p-6 overflow-y-auto">
            {selected ? (
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selected.subject || '(No Subject)'}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      From <span className="font-medium text-gray-700">{selected.name}</span>
                      {' '}&lt;{selected.email}&gt;
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(selected.created_at), 'MMMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={selected.status}
                      onChange={(e) => {
                        updateMutation.mutate({ id: selected.id, status: e.target.value })
                        setSelected({ ...selected, status: e.target.value })
                      }}
                      className="input text-xs py-1.5 w-32"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(selected)}
                      className="btn-ghost p-2 text-red-500 hover:bg-red-50"
                      title="Delete"
                    >
                      <RiDeleteBinLine size={16} />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Message'}`}
                    className="btn-primary"
                  >
                    <RiMailOpenLine size={16} />
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <RiMailLine size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-400">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog open={confirmState.open} message={confirmState.message}
        onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  )
}
