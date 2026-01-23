import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../api/AuthService'
import BaseButton from './ui/BaseButton'
import BaseLinkButton from './ui/BaseLinkButton'

function Header() {
  const { isAuthenticated, clearAuth, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      clearAuth()
      navigate('/login')
    } catch (error) {
      // 에러 발생해도 로그아웃 처리
      clearAuth()
      navigate('/login')
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.jpg" 
              alt="Go Almond" 
              className="h-12 w-auto object-contain"
              style={{ maxHeight: '48px' }}
              onError={(e) => {
                console.error('로고 이미지 로드 실패:', e);
              }}
              onLoad={() => {
                console.log('로고 이미지 로드 성공');
              }}
            />
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              홈
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                대시보드
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user && (
                  <span className="text-gray-600 text-sm">
                    {user.email}
                  </span>
                )}
                <BaseButton variant="muted" size="sm" onClick={handleLogout}>
                  로그아웃
                </BaseButton>
              </div>
            ) : (
              <BaseLinkButton to="/login" size="sm">
                로그인
              </BaseLinkButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
