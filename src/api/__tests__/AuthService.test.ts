import { login, register } from '../AuthService'

const authApiPostMock = vi.fn()

vi.mock('../axiosInstance', () => ({
  authApi: {
    post: (...args: unknown[]) => authApiPostMock(...args),
  },
}))

vi.mock('../AuditService', () => ({
  logLoginSuccess: vi.fn(),
  logLoginFailure: vi.fn(),
  logLogout: vi.fn(),
  logTokenRefresh: vi.fn(),
}))

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear()
    authApiPostMock.mockReset()
  })

  it('회원가입 성공 시 토큰이 localStorage에 저장된다', async () => {
    authApiPostMock.mockResolvedValue({
      data: {
        success: true,
        data: {
          token: 'access-token',
          user: {
            id: 'user-1',
            email: 'test@example.com',
            full_name: '테스트',
          },
        },
      },
    })

    const result = await register('test@example.com', 'Password123', 'Password123')

    expect(result.success).toBe(true)
    expect(localStorage.getItem('accessToken')).toBe('access-token')
    expect(localStorage.getItem('refreshToken')).toBe('')
  })

  it('로그인 성공 시 토큰이 localStorage에 저장된다', async () => {
    authApiPostMock.mockResolvedValue({
      data: {
        success: true,
        data: {
          token: 'access-token',
          user: {
            id: 'user-1',
            email: 'test@example.com',
            full_name: '테스트',
          },
        },
      },
    })

    const result = await login('test@example.com', 'Password123')

    expect(result.success).toBe(true)
    expect(localStorage.getItem('accessToken')).toBe('access-token')
    expect(localStorage.getItem('refreshToken')).toBe('')
  })
})
