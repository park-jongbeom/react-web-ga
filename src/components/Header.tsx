import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-primary-600 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-300">Go</span>
              <span className="text-2xl font-bold text-white ml-3 relative inline-flex items-center">
                <span className="relative inline-flex items-center">
                  <span className="relative inline-block font-sans">
                    <span className="relative inline-block">
                      A
                      {/* Leaf icon integrated into A - positioned at crossbar */}
                      <svg
                        className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary-200 pointer-events-none z-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        stroke="white"
                        strokeWidth="1.5"
                      >
                        {/* Leaf shape - simplified */}
                        <path
                          d="M12 3C9 3 7 5 7 8c0 2 1 3.5 2 4.5L8 18l2-1.5 2-3.5 2 3.5 2 1.5-1-5.5c1-1 2-2.5 2-4.5 0-3-2-5-5-5z"
                          fill="currentColor"
                          stroke="white"
                        />
                      </svg>
                    </span>
                    <span className="ml-0.5">LMOND</span>
                  </span>
                </span>
              </span>
            </div>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-white hover:text-primary-100 font-medium transition-colors"
            >
              홈
            </Link>
            <Link
              to="/dashboard"
              className="text-white hover:text-primary-100 font-medium transition-colors"
            >
              대시보드
            </Link>
            <button className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              로그인
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
