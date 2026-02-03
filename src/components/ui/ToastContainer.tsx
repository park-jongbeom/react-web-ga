import { useToast } from '../../context/ToastContext'

const typeClasses = {
  success: 'bg-success-100 text-success-800',
  error: 'bg-danger-100 text-danger-800',
  info: 'bg-info-100 text-info-800',
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-[220px] rounded-md px-4 py-3 text-sm shadow ${typeClasses[toast.type]}`}
        >
          <div className="flex items-start justify-between gap-3">
            <span>{toast.message}</span>
            <button
              type="button"
              className="text-xs text-foreground-muted"
              onClick={() => removeToast(toast.id)}
            >
              닫기
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
