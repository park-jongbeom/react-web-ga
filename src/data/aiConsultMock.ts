import { z } from 'zod'

const AiConsultMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
})

const AiConsultSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  suggestedPrompts: z.array(z.string().min(1)).min(1).max(6),
  messages: z.array(AiConsultMessageSchema).min(1),
})

const aiConsultRaw = {
  title: 'AI 상담',
  description:
    '진학 목표, 예산, 성적을 알려주시면 맞춤형 유학 경로를 추천해 드립니다.',
  suggestedPrompts: [
    '미국 CC 편입 루트가 궁금해요.',
    '예산 3만 달러로 가능한 학교 추천해줘.',
    'GPA 3.4인데 컴퓨터공학 가능한가요?',
    '직업학교와 커뮤니티 컬리지 차이 알려줘.',
  ],
  messages: [
    {
      id: 'm1',
      role: 'assistant',
      content:
        '안녕하세요! 목표 전공, 희망 예산, 현재 성적을 알려주시면 맞춤 경로를 안내해 드릴게요.',
    },
  ],
}

export const aiConsultData = AiConsultSchema.parse(aiConsultRaw)

export type AiConsultMessage = z.infer<typeof AiConsultMessageSchema>
