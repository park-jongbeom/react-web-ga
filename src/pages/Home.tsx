import { useEffect, useState } from 'react'
import { aiConsultData, type AiConsultMessage } from '../data/aiConsultMock'
import BaseButton from '../components/ui/BaseButton'
import BaseCard from '../components/ui/BaseCard'
import BaseInput from '../components/ui/BaseInput'
import BaseLinkButton from '../components/ui/BaseLinkButton'
import BasePanel from '../components/ui/BasePanel'
import BaseTextarea from '../components/ui/BaseTextarea'
import { BaseGrid, BaseSection } from '../components/ui/Layout'
import { BaseHeading, BaseText } from '../components/ui/Typography'

function Home() {
  const [messages, setMessages] = useState<AiConsultMessage[]>(
    aiConsultData.messages
  )
  const [input, setInput] = useState('')

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f4e8534c-047d-4166-93da-d8d0b4cde43e', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'Home.tsx:init',
        message: 'AI 상담 초기 상태',
        data: {
          title: aiConsultData.title,
          suggestedCount: aiConsultData.suggestedPrompts.length,
          initialMessageCount: aiConsultData.messages.length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
  }, [])

  const handleSend = () => {
    const trimmed = input.trim()
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f4e8534c-047d-4166-93da-d8d0b4cde43e', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'H2',
        location: 'Home.tsx:handleSend:pre',
        message: '전송 클릭 전 입력값',
        data: { inputLength: input.length, trimmedLength: trimmed.length },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
    if (!trimmed) return

    const now = Date.now()
    const userMessage: AiConsultMessage = {
      id: `user-${now}`,
      role: 'user',
      content: trimmed,
    }
    const assistantMessage: AiConsultMessage = {
      id: `assistant-${now}`,
      role: 'assistant',
      content: `요청하신 내용(${trimmed})을 바탕으로 예산/성적/목표 전공 정보를 알려주시면 구체적인 경로를 추천드릴게요.`,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f4e8534c-047d-4166-93da-d8d0b4cde43e', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'H2',
        location: 'Home.tsx:handleSend:post',
        message: '메시지 추가 후 예상 길이',
        data: { nextMessageCount: messages.length + 2 },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f4e8534c-047d-4166-93da-d8d0b4cde43e', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'H3',
        location: 'Home.tsx:handleSuggestedPrompt',
        message: '추천 질문 클릭',
        data: { promptLength: prompt.length },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <BaseSection className="text-center py-20">
        <BaseHeading level={1} className="text-5xl mb-6">
          미국 유학의 새로운 시작,
          <br />
          <span className="text-primary-600">Go Almond</span>와 함께하세요
        </BaseHeading>
        <BaseText variant="subtitle" className="mb-8 max-w-2xl mx-auto">
          AI 기반 맞춤형 진로 설계로 당신만의 최적의 유학 경로를 찾아보세요.
          <br />
          일반 대학, CC 편입, 직업학교까지 모든 옵션을 한눈에.
        </BaseText>
        <div className="flex justify-center space-x-4">
          <BaseLinkButton to="/dashboard" size="lg">
            Go ALMOND
          </BaseLinkButton>
          <BaseButton variant="outline" size="lg">
            더 알아보기
          </BaseButton>
        </div>
      </BaseSection>

      {/* Services Section */}
      <BaseSection id="services">
        <BaseHeading level={2} className="text-center mb-12">
          주요 서비스
        </BaseHeading>
        <BaseGrid cols={3} gap="sm">
          <BaseCard variant="interactive" className="rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              University
            </h3>
            <p className="text-gray-600 text-sm">
              4년제 대학 프로그램으로 명문 대학 입학을 준비합니다.
            </p>
          </BaseCard>

          <BaseCard variant="interactive" className="rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Community College
            </h3>
            <p className="text-gray-600 text-sm">
              커뮤니티 컬리지 편입 프로그램으로 경제적인 유학 경로를 제공합니다.
            </p>
          </BaseCard>

          <BaseCard variant="interactive" className="rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Vocational College
            </h3>
            <p className="text-gray-600 text-sm">
              직업학교 프로그램으로 실용적인 기술을 배워 빠르게 취업으로 이어집니다.
            </p>
          </BaseCard>

          <BaseCard variant="interactive" className="rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Elementary Program
            </h3>
            <p className="text-gray-600 text-sm">
              초등 프로그램으로 어린이들의 조기 유학 경로를 지원합니다.
            </p>
          </BaseCard>

          <BaseCard variant="interactive" className="rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              US Life
            </h3>
            <p className="text-gray-600 text-sm">
              미국 생활 적응 프로그램으로 문화와 생활을 지원합니다.
            </p>
          </BaseCard>

          <BaseCard variant="interactive" className="rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              AI 추천
            </h3>
            <p className="text-gray-600 text-sm">
              개인의 학업 배경, GPA, 예산, 진로 목표를 분석하여 최적의 유학 경로를 AI가 추천합니다.
            </p>
          </BaseCard>
        </BaseGrid>
      </BaseSection>

      {/* Programs Section */}
      <BaseSection id="programs">
        <BasePanel className="p-8">
          <BaseHeading level={2} className="text-center mb-12">
            프로그램 안내
          </BaseHeading>
          <BaseGrid cols={2} gap="lg">
            <div className="border-l-4 border-primary-600 pl-6">
              <BaseHeading level={3} className="mb-3">
                커뮤니티 컬리지 편입 프로그램
              </BaseHeading>
              <BaseText className="mb-4">
                경제적인 비용으로 시작하여 4년제 대학으로 편입하는 효율적인
                경로입니다.
              </BaseText>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>저렴한 학비로 시작</li>
                <li>명문 대학 편입 기회</li>
                <li>유연한 학업 일정</li>
              </ul>
            </div>

            <div className="border-l-4 border-primary-600 pl-6">
              <BaseHeading level={3} className="mb-3">
                직업학교 프로그램
              </BaseHeading>
              <BaseText className="mb-4">
                실용적인 기술을 배워 빠르게 취업으로 이어지는 프로그램입니다.
              </BaseText>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>단기 집중 교육</li>
                <li>실무 중심 커리큘럼</li>
                <li>취업 연계 지원</li>
              </ul>
            </div>
          </BaseGrid>
        </BasePanel>
      </BaseSection>

      {/* AI Recommendation Section */}
      <BaseSection id="ai-recommendation">
        <div className="bg-primary-600 rounded-xl p-12 text-white">
          <BaseHeading
            level={2}
            className="mb-6 text-center text-white"
          >
            AI가 당신의 유학 경로를 설계합니다
          </BaseHeading>
          <BaseText
            variant="subtitle"
            className="mb-8 text-center text-primary-100 max-w-2xl mx-auto"
          >
            학업 성적, 예산, 진로 목표를 종합 분석하여 최적의 프로그램을
            추천합니다.
          </BaseText>
          <div className="flex justify-center">
            <BaseLinkButton to="/dashboard" variant="inverse" size="lg">
              Go ALMOND
            </BaseLinkButton>
          </div>
        </div>
      </BaseSection>

      {/* AI Consult Section */}
      <BaseSection id="ai-consult">
        <BasePanel className="p-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="lg:w-1/2 space-y-4">
              <BaseHeading level={2}>{aiConsultData.title}</BaseHeading>
              <BaseText>{aiConsultData.description}</BaseText>
              <div>
                <BaseText variant="label" className="mb-3">
                  추천 질문
                </BaseText>
                <div className="flex flex-wrap gap-2">
                  {aiConsultData.suggestedPrompts.map((prompt) => (
                    <BaseButton
                      key={prompt}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      variant="soft"
                      size="sm"
                      rounded="full"
                    >
                      {prompt}
                    </BaseButton>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 space-y-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 max-h-80 overflow-y-auto space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  handleSend()
                }}
              >
                <BaseInput
                  id="ai-consult-input"
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="예: 예산 3만 달러, GPA 3.5, 전공은 CS"
                  containerClassName="flex-1"
                />
                <BaseButton type="submit">전송</BaseButton>
              </form>
            </div>
          </div>
        </BasePanel>
      </BaseSection>

      {/* Contact Section */}
      <BaseSection id="contact">
        <BasePanel className="p-8">
          <BaseHeading level={2} className="text-center mb-8">
            문의하기
          </BaseHeading>
          <div className="max-w-md mx-auto">
            <form className="space-y-4">
              <BaseInput
                id="contact-name"
                label="이름"
                placeholder="이름을 입력하세요"
              />
              <BaseInput
                id="contact-email"
                type="email"
                label="이메일"
                placeholder="이메일을 입력하세요"
              />
              <BaseTextarea
                id="contact-message"
                label="문의 내용"
                rows={4}
                placeholder="문의 내용을 입력하세요"
              />
              <BaseButton type="submit" className="w-full">
                문의하기
              </BaseButton>
            </form>
          </div>
        </BasePanel>
      </BaseSection>
    </div>
  )
}

export default Home
