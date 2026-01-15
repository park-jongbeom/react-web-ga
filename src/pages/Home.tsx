import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          미국 유학의 새로운 시작,
          <br />
          <span className="text-primary-600">Go Almond</span>와 함께하세요
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AI 기반 맞춤형 진로 설계로 당신만의 최적의 유학 경로를 찾아보세요.
          <br />
          일반 대학, CC 편입, 직업학교까지 모든 옵션을 한눈에.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/dashboard"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
          >
            시작하기
          </Link>
          <button className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium text-lg">
            더 알아보기
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          주요 서비스
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              일반 대학 및 CC 편입 프로그램
            </h3>
            <p className="text-gray-600">
              4년제 대학과 커뮤니티 컬리지 편입 프로그램을 통해 효율적이고
              경제적인 유학 경로를 제시합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              직업학교 및 단기 참관 수업
            </h3>
            <p className="text-gray-600">
              실용적인 기술을 배울 수 있는 직업학교와 단기 프로그램을 통해
              빠르게 취업으로 이어지는 경로를 제공합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              AI 기반 맞춤 추천
            </h3>
            <p className="text-gray-600">
              개인의 학업 배경, GPA, 예산, 진로 목표를 분석하여 최적의 유학
              경로를 AI가 추천합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-16 bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          프로그램 안내
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border-l-4 border-primary-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              커뮤니티 컬리지 편입 프로그램
            </h3>
            <p className="text-gray-600 mb-4">
              경제적인 비용으로 시작하여 4년제 대학으로 편입하는 효율적인
              경로입니다.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>저렴한 학비로 시작</li>
              <li>명문 대학 편입 기회</li>
              <li>유연한 학업 일정</li>
            </ul>
          </div>

          <div className="border-l-4 border-primary-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              직업학교 프로그램
            </h3>
            <p className="text-gray-600 mb-4">
              실용적인 기술을 배워 빠르게 취업으로 이어지는 프로그램입니다.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>단기 집중 교육</li>
              <li>실무 중심 커리큘럼</li>
              <li>취업 연계 지원</li>
            </ul>
          </div>
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section id="ai-recommendation" className="py-16">
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            AI가 당신의 유학 경로를 설계합니다
          </h2>
          <p className="text-xl mb-8 text-center text-primary-50 max-w-2xl mx-auto">
            학업 성적, 예산, 진로 목표를 종합 분석하여 최적의 프로그램을
            추천합니다.
          </p>
          <div className="flex justify-center">
            <Link
              to="/dashboard"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
            >
              AI 추천 받기
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          문의하기
        </h2>
        <div className="max-w-md mx-auto">
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                이름
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                이메일
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="이메일을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                문의 내용
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="문의 내용을 입력하세요"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              문의하기
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home
