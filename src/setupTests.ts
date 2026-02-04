import '@testing-library/jest-dom/vitest'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error - 테스트 환경 ResizeObserver 폴리필
global.ResizeObserver = ResizeObserverMock
