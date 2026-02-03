import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info'

type ToastItem = {
  id: string
  message: string
  type: ToastType
}

type ToastContextValue = {
  toasts: ToastItem[]
  pushToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID()
    const newToast: ToastItem = { id, message, type }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }, [removeToast])

  const value = useMemo(
    () => ({
      toasts,
      pushToast,
      removeToast,
    }),
    [toasts, pushToast, removeToast]
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
