import { useState } from 'react'

export function useConfirm() {
  const [state, setState] = useState({ open: false, resolve: null, message: '' })

  const confirm = (message) =>
    new Promise((resolve) => setState({ open: true, resolve, message }))

  const handleConfirm = () => {
    state.resolve(true)
    setState({ open: false, resolve: null, message: '' })
  }

  const handleCancel = () => {
    state.resolve(false)
    setState({ open: false, resolve: null, message: '' })
  }

  return { confirm, confirmState: state, handleConfirm, handleCancel }
}
