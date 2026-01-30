import BaseNavLink from './ui/BaseNavLink'

function Navigation() {
  return (
    <nav className="bg-surface border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          <BaseNavLink href="#programs">프로그램 안내</BaseNavLink>
          <BaseNavLink href="#services">서비스 소개</BaseNavLink>
          <BaseNavLink href="#ai-recommendation">AI 추천</BaseNavLink>
          <BaseNavLink href="#contact">문의하기</BaseNavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
