import { useState } from 'react'

interface Application {
  id: string
  school: string
  program: string
  status: 'Draft' | 'Submitted' | 'Accepted'
  date: string
}

function Dashboard() {
  const [userProfile] = useState({
    name: '홍길동',
    gpa: 3.5,
    budget: 50000,
    careerGoal: '컴퓨터 공학',
    country: '한국',
  })

  const [applications] = useState<Application[]>([
    {
      id: '1',
      school: 'University of California, Berkeley',
      program: 'Computer Science Transfer Program',
      status: 'Submitted',
      date: '2024-01-10',
    },
    {
      id: '2',
      school: 'Santa Monica College',
      program: 'Associate Degree Program',
      status: 'Draft',
      date: '2024-01-15',
    },
    {
      id: '3',
      school: 'De Anza College',
      program: 'Transfer Program',
      status: 'Accepted',
      date: '2024-01-05',
    },
  ])

  const [aiRecommendations] = useState([
    {
      id: '1',
      school: 'Foothill College',
      program: 'Computer Science Transfer',
      matchScore: 95,
      reason: 'GPA와 예산에 최적화된 프로그램입니다.',
    },
    {
      id: '2',
      school: 'Diablo Valley College',
      program: 'Engineering Transfer',
      matchScore: 88,
      reason: '진로 목표와 높은 일치도를 보입니다.',
    },
    {
      id: '3',
      school: 'Pasadena City College',
      program: 'Computer Science',
      matchScore: 85,
      reason: '경제적이고 우수한 편입 실적을 보유합니다.',
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800'
      case 'Submitted':
        return 'bg-blue-100 text-blue-800'
      case 'Draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Accepted':
        return '합격'
      case 'Submitted':
        return '제출됨'
      case 'Draft':
        return '초안'
      default:
        return status
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
          새 지원서 작성
        </button>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">내 프로필</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">이름</p>
            <p className="text-lg font-semibold text-gray-900">
              {userProfile.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">GPA</p>
            <p className="text-lg font-semibold text-gray-900">
              {userProfile.gpa}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">예산 (USD)</p>
            <p className="text-lg font-semibold text-gray-900">
              ${userProfile.budget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">진로 목표</p>
            <p className="text-lg font-semibold text-gray-900">
              {userProfile.careerGoal}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            프로필 수정하기 →
          </button>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">지원 현황</h2>
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {app.school}
                  </h3>
                  <p className="text-gray-600">{app.program}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    app.status
                  )}`}
                >
                  {getStatusText(app.status)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">제출일: {app.date}</p>
                <div className="space-x-2">
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    상세보기
                  </button>
                  {app.status === 'Draft' && (
                    <button className="text-gray-600 hover:text-gray-700 font-medium text-sm">
                      수정하기
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">AI 추천 프로그램</h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            새로 추천받기
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {aiRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {rec.school}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{rec.program}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {rec.matchScore}
                  </div>
                  <div className="text-xs text-gray-500">매칭 점수</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{rec.reason}</p>
              <div className="flex space-x-2">
                <button className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                  지원하기
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">전체 지원서</p>
          <p className="text-3xl font-bold text-gray-900">
            {applications.length}
          </p>
          <p className="text-sm text-gray-500 mt-2">건</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">합격한 지원서</p>
          <p className="text-3xl font-bold text-green-600">
            {applications.filter((a) => a.status === 'Accepted').length}
          </p>
          <p className="text-sm text-gray-500 mt-2">건</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">평균 매칭 점수</p>
          <p className="text-3xl font-bold text-primary-600">
            {Math.round(
              aiRecommendations.reduce((sum, r) => sum + r.matchScore, 0) /
                aiRecommendations.length
            )}
          </p>
          <p className="text-sm text-gray-500 mt-2">점</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
