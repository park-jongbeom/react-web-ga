import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">GA</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Go Almond</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              홈
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              대시보드
            </Link>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              로그인
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
