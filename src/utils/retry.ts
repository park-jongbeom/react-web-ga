type RetryOptions = {
  retries?: number
  delayMs?: number
  shouldRetry?: (error: unknown) => boolean
}

const defaultShouldRetry = (error: unknown) => {
  const status = (error as any)?.response?.status
  if (!status) {
    return true
  }
  return status >= 500
}

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const { retries = 3, delayMs = 300, shouldRetry = defaultShouldRetry } = options
  let attempt = 0
  let lastError: unknown

  while (attempt <= retries) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (!shouldRetry(error) || attempt === retries) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      attempt += 1
    }
  }

  throw lastError
}
