import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BaseBadge from '../BaseBadge'
import BaseButton from '../BaseButton'
import BaseCard from '../BaseCard'
import BaseInput from '../BaseInput'
import BaseLinkButton from '../BaseLinkButton'
import BaseTextarea from '../BaseTextarea'
import { BaseHeading, BaseText } from '../Typography'
import { BaseContainer, BaseGrid, BaseSection } from '../Layout'

describe('Base UI components', () => {
  it('BaseButton 라벨이 렌더링된다', () => {
    render(<BaseButton>테스트 버튼</BaseButton>)
    expect(
      screen.getByRole('button', { name: /테스트 버튼/i })
    ).toBeInTheDocument()
  })

  it('BaseInput 라벨과 입력창이 렌더링된다', () => {
    render(
      <BaseInput id="email" label="이메일" placeholder="you@example.com" />
    )
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument()
  })

  it('BaseTextarea 라벨과 입력창이 렌더링된다', () => {
    render(
      <BaseTextarea id="message" label="문의 내용" placeholder="내용 입력" />
    )
    expect(screen.getByLabelText(/문의 내용/i)).toBeInTheDocument()
  })

  it('BaseCard 제목과 내용이 렌더링된다', () => {
    render(
      <BaseCard title="카드 제목">
        <p>카드 내용</p>
      </BaseCard>
    )
    expect(
      screen.getByRole('heading', { name: /카드 제목/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/카드 내용/i)).toBeInTheDocument()
  })

  it('BaseBadge 텍스트가 렌더링된다', () => {
    render(<BaseBadge>상태</BaseBadge>)
    expect(screen.getByText(/상태/i)).toBeInTheDocument()
  })

  it('BaseLinkButton 링크가 렌더링된다', () => {
    render(
      <MemoryRouter>
        <BaseLinkButton to="/test">테스트 링크</BaseLinkButton>
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /테스트 링크/i })).toBeInTheDocument()
  })

  it('BaseHeading과 BaseText가 렌더링된다', () => {
    render(
      <div>
        <BaseHeading level={2}>제목</BaseHeading>
        <BaseText>설명</BaseText>
      </div>
    )
    expect(screen.getByRole('heading', { name: /제목/i })).toBeInTheDocument()
    expect(screen.getByText(/설명/i)).toBeInTheDocument()
  })

  it('BaseSection과 BaseContainer가 렌더링된다', () => {
    render(
      <BaseSection>
        <BaseContainer>내용</BaseContainer>
      </BaseSection>
    )
    expect(screen.getByText(/내용/i)).toBeInTheDocument()
  })

  it('BaseGrid가 렌더링된다', () => {
    render(
      <BaseGrid cols={2}>
        <div>아이템</div>
      </BaseGrid>
    )
    expect(screen.getByText(/아이템/i)).toBeInTheDocument()
  })
})
