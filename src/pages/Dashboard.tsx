import { useState } from 'react'
import BaseBadge from '../components/ui/BaseBadge'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BasePanel from '../components/ui/BasePanel'
import { BaseGrid, BaseSection } from '../components/ui/Layout'
import { BaseHeading, BaseText } from '../components/ui/Typography'

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

  const getStatusColor = (
    status: string
  ): 'success' | 'info' | 'neutral' => {
    switch (status) {
      case 'Accepted':
        return 'success'
      case 'Submitted':
        return 'info'
      case 'Draft':
        return 'neutral'
      default:
        return 'neutral'
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
    <BaseSection variant="tight" className="space-y-8">
      <div className="flex justify-between items-center">
        <BaseHeading level={2}>대시보드</BaseHeading>
        <BaseButton>새 지원서 작성</BaseButton>
      </div>

      {/* User Profile Card */}
      <BasePanel>
        <BaseHeading level={3} className="mb-4">
          내 프로필
        </BaseHeading>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <BaseText variant="caption" className="mb-1">
              이름
            </BaseText>
            <BaseText variant="subtitle" className="text-gray-900">
              {userProfile.name}
            </BaseText>
          </div>
          <div>
            <BaseText variant="caption" className="mb-1">
              GPA
            </BaseText>
            <BaseText variant="subtitle" className="text-gray-900">
              {userProfile.gpa}
            </BaseText>
          </div>
          <div>
            <BaseText variant="caption" className="mb-1">
              예산 (USD)
            </BaseText>
            <BaseText variant="subtitle" className="text-gray-900">
              ${userProfile.budget.toLocaleString()}
            </BaseText>
          </div>
          <div>
            <BaseText variant="caption" className="mb-1">
              진로 목표
            </BaseText>
            <BaseText variant="subtitle" className="text-gray-900">
              {userProfile.careerGoal}
            </BaseText>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <BaseButton variant="link" size="sm" className="px-0">
            프로필 수정하기 →
          </BaseButton>
        </div>
      </BasePanel>

      {/* Applications Section */}
      <BasePanel>
        <BaseHeading level={3} className="mb-4">
          지원 현황
        </BaseHeading>
        <div className="space-y-4">
          {applications.map((app) => (
            <BaseCard key={app.id} variant="accent" className="rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <BaseHeading level={4}>{app.school}</BaseHeading>
                  <BaseText variant="caption">{app.program}</BaseText>
                </div>
                <BaseBadge variant={getStatusColor(app.status)}>
                  {getStatusText(app.status)}
                </BaseBadge>
              </div>
              <div className="flex justify-between items-center mt-4">
                <BaseText variant="caption">
                  제출일: {app.date}
                </BaseText>
                <div className="space-x-2">
                  <BaseButton variant="link" size="sm" className="px-0">
                    상세보기
                  </BaseButton>
                  {app.status === 'Draft' && (
                    <BaseButton variant="muted" size="sm" className="px-0">
                      수정하기
                    </BaseButton>
                  )}
                </div>
              </div>
            </BaseCard>
          ))}
        </div>
      </BasePanel>

      {/* AI Recommendations Section */}
      <BasePanel>
        <div className="flex justify-between items-center mb-4">
          <BaseHeading level={3}>AI 추천 프로그램</BaseHeading>
          <BaseButton variant="link" size="sm" className="px-0">
            새로 추천받기
          </BaseButton>
        </div>
        <BaseGrid cols={3} gap="sm">
          {aiRecommendations.map((rec) => (
            <BaseCard key={rec.id} variant="accent" className="rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <BaseHeading level={4} className="mb-1">
                    {rec.school}
                  </BaseHeading>
                  <BaseText variant="caption" className="mb-2">
                    {rec.program}
                  </BaseText>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {rec.matchScore}
                  </div>
                  <BaseText variant="caption">매칭 점수</BaseText>
                </div>
              </div>
              <BaseText variant="caption" className="mb-4">
                {rec.reason}
              </BaseText>
              <div className="flex space-x-2">
                <BaseButton className="flex-1" size="sm">
                  지원하기
                </BaseButton>
                <BaseButton variant="outline" size="sm">
                  상세보기
                </BaseButton>
              </div>
            </BaseCard>
          ))}
        </BaseGrid>
      </BasePanel>

      {/* Statistics Section */}
      <BaseGrid cols={3} gap="md">
        <BasePanel>
          <BaseText variant="caption" className="mb-2">
            전체 지원서
          </BaseText>
          <BaseHeading level={2} className="text-3xl">
            {applications.length}
          </BaseHeading>
          <BaseText variant="caption" className="mt-2">
            건
          </BaseText>
        </BasePanel>
        <BasePanel>
          <BaseText variant="caption" className="mb-2">
            합격한 지원서
          </BaseText>
          <BaseHeading level={2} className="text-3xl text-green-600">
            {applications.filter((a) => a.status === 'Accepted').length}
          </BaseHeading>
          <BaseText variant="caption" className="mt-2">
            건
          </BaseText>
        </BasePanel>
        <BasePanel>
          <BaseText variant="caption" className="mb-2">
            평균 매칭 점수
          </BaseText>
          <BaseHeading level={2} className="text-3xl text-primary-600">
            {Math.round(
              aiRecommendations.reduce((sum, r) => sum + r.matchScore, 0) /
                aiRecommendations.length
            )}
          </BaseHeading>
          <BaseText variant="caption" className="mt-2">
            점
          </BaseText>
        </BasePanel>
      </BaseGrid>
    </BaseSection>
  )
}

export default Dashboard
