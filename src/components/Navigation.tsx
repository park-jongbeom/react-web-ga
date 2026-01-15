function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          <a
            href="#programs"
            className="py-4 text-gray-600 hover:text-primary-600 font-medium border-b-2 border-transparent hover:border-primary-600 transition-colors"
          >
            프로그램 안내
          </a>
          <a
            href="#services"
            className="py-4 text-gray-600 hover:text-primary-600 font-medium border-b-2 border-transparent hover:border-primary-600 transition-colors"
          >
            서비스 소개
          </a>
          <a
            href="#ai-recommendation"
            className="py-4 text-gray-600 hover:text-primary-600 font-medium border-b-2 border-transparent hover:border-primary-600 transition-colors"
          >
            AI 추천
          </a>
          <a
            href="#contact"
            className="py-4 text-gray-600 hover:text-primary-600 font-medium border-b-2 border-transparent hover:border-primary-600 transition-colors"
          >
            문의하기
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
