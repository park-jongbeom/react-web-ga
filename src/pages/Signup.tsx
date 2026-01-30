/**
 * 회원가입 페이지
 *
 * 보안 원칙 준수:
 * - Validation+SQLi 방어: 입력 검증은 SignupForm에서 처리
 * - 에러 노출 차단: 서버 에러는 일반화된 메시지로 노출
 */

import SignupForm from '../components/SignupForm'
import { BaseContainer, BaseSection } from '../components/ui/Layout'
import { BaseHeading, BaseText } from '../components/ui/Typography'
import { Link } from 'react-router-dom'

function Signup() {
  return (
    <BaseSection
      variant="tight"
      className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <BaseContainer className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <img src="/logo.jpg" alt="Go Almond" className="h-16 w-auto" />
        </Link>
        <BaseHeading level={2} className="mt-6 text-center">
          새 계정 만들기
        </BaseHeading>
        <BaseText variant="caption" className="mt-2 text-center">
          이미 계정이 있으신가요?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            로그인
          </Link>
        </BaseText>
      </BaseContainer>

      <BaseContainer className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignupForm />
        </div>
      </BaseContainer>
    </BaseSection>
  )
}

export default Signup
