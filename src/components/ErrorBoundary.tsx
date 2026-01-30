/**
 * Error Boundary 컴포넌트
 * 
 * 보안 원칙:
 * - 에러 노출 차단: Stack Trace 등 시스템 내부 정보 필터링
 * - 사용자 친화적 에러 메시지 제공
 * - 민감한 정보 보호
 * - 보안 에러 처리
 */

import React, { Component } from 'react'
import type { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * 에러 메시지 필터링 함수
 * - 상세한 스택 트레이스 제거
 * - 민감한 정보 필터링
 * - 일반화된 메시지만 반환
 */
const filterErrorMessage = (error: Error): string => {
  // 에러 타입별 일반화된 메시지
  if (error.name === 'ChunkLoadError' || error.message.includes('chunk')) {
    return '애플리케이션 업데이트가 있습니다. 페이지를 새로고침해주세요.'
  }

  if (error.name === 'NetworkError' || error.message.includes('network')) {
    return '네트워크 연결을 확인해주세요.'
  }

  if (error.name === 'TypeError' || error.name === 'ReferenceError') {
    return '오류가 발생했습니다. 페이지를 새로고침해주세요.'
  }

  // 보안 관련 에러는 일반화
  if (error.message.includes('token') || error.message.includes('auth')) {
    return '인증 오류가 발생했습니다. 다시 로그인해주세요.'
  }

  // 기타 모든 에러는 일반화된 메시지
  return '예기치 않은 오류가 발생했습니다. 페이지를 새로고침해주세요.'
}

/**
 * 에러 정보에서 민감한 정보 제거
 */
const sanitizeErrorInfo = (error: Error, errorInfo: React.ErrorInfo): {
  message: string
  componentStack: string
} => {
  // 컴포넌트 스택에서 민감한 정보 필터링
  const sanitizedComponentStack = errorInfo.componentStack
    ? errorInfo.componentStack
        .split('\n')
        .slice(0, 3) // 처음 3줄만 유지
        .map((line) => {
          // 파일 경로 제거
          return line.replace(/\(.*\)/g, '').trim()
        })
        .join('\n')
    : ''

  return {
    message: filterErrorMessage(error),
    componentStack: sanitizedComponentStack,
  }
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 에러 발생 시 상태 업데이트
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 정보 저장
    this.setState({
      errorInfo,
    })

    // 콜백 함수 호출 (로그 전송 등)
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // 개발 환경에서만 콘솔에 상세 정보 출력
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error)
      console.error('Error Info:', errorInfo)
    }

    // 프로덕션에서는 상세 정보를 로그 서비스로만 전송 (구현 필요)
    // 예: logErrorToService(sanitizeErrorInfo(error, errorInfo))
  }

  handleReset = () => {
    // 에러 상태 리셋
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback UI가 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 기본 에러 UI
      const sanitized = this.state.error && this.state.errorInfo
        ? sanitizeErrorInfo(this.state.error, this.state.errorInfo)
        : {
            message: '예기치 않은 오류가 발생했습니다.',
            componentStack: '',
          }

      return (
        <div className="min-h-screen bg-surface-subtle flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-surface py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger-100">
                  <svg
                    className="h-6 w-6 text-danger-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="mt-4 text-xl font-bold text-foreground">
                  오류가 발생했습니다
                </h2>
                <p className="mt-2 text-sm text-foreground-muted">
                  {sanitized.message}
                </p>
                <div className="mt-6">
                  <button
                    onClick={this.handleReset}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    다시 시도
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      window.location.href = '/'
                    }}
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    홈으로 돌아가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
