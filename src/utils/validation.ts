/**
 * Zod 기반 입력값 검증 스키마
 * 
 * 보안 원칙:
 * - Validation+SQLi 방어: 런타임 타입 검증
 * - 모든 사용자 입력값 검증
 * - SQL 인젝션 방어를 위한 특수 문자 제한
 * - 타입 안전성 보장
 */

import { z } from 'zod'

/**
 * 이메일 검증 스키마
 * - RFC 5322 기본 검증
 * - SQL 인젝션 방어: 특수 문자 제한
 * - XSS 방어: 길이 제한
 */
export const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요.')
  .max(254, '이메일은 최대 254자까지 가능합니다.')
  .email('올바른 이메일 형식을 입력해주세요.')
  .refine(
    (email) => {
      // SQL 인젝션 방어: 위험한 문자 제한
      const dangerousChars = /[;'"\\<>]/
      return !dangerousChars.test(email)
    },
    {
      message: '이메일에는 사용할 수 없는 문자가 포함되어 있습니다.',
    }
  )
  .refine(
    (email) => {
      // 추가 검증: 공백 제한
      return !/\s/.test(email)
    },
    {
      message: '이메일에는 공백을 포함할 수 없습니다.',
    }
  )
  .transform((email) => email.toLowerCase().trim())

/**
 * 비밀번호 검증 스키마
 * - 최소 8자, 최대 128자
 * - 대소문자, 숫자 포함 필수
 * - SQL 인젝션 방어: 위험한 문자 제한
 */
export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
  .max(128, '비밀번호는 최대 128자까지 가능합니다.')
  .refine(
    (password) => /[a-z]/.test(password),
    {
      message: '비밀번호는 최소 1개의 소문자를 포함해야 합니다.',
    }
  )
  .refine(
    (password) => /[A-Z]/.test(password),
    {
      message: '비밀번호는 최소 1개의 대문자를 포함해야 합니다.',
    }
  )
  .refine(
    (password) => /[0-9]/.test(password),
    {
      message: '비밀번호는 최소 1개의 숫자를 포함해야 합니다.',
    }
  )
  .refine(
    (password) => {
      // SQL 인젝션 및 XSS 방어: 위험한 문자 제한
      const dangerousChars = /[;'"\\<>]/
      return !dangerousChars.test(password)
    },
    {
      message: '비밀번호에 사용할 수 없는 문자가 포함되어 있습니다.',
    }
  )

/**
 * 로그인 요청 스키마
 */
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

/**
 * Refresh Token 검증 스키마
 */
export const refreshTokenSchema = z
  .string()
  .min(1, 'Refresh Token이 필요합니다.')
  .refine(
    (token) => {
      // JWT 형식 기본 검증 (3개 부분으로 구성)
      const parts = token.split('.')
      return parts.length === 3
    },
    {
      message: '올바른 토큰 형식이 아닙니다.',
    }
  )

/**
 * Refresh 요청 스키마
 */
export const refreshRequestSchema = z.object({
  refreshToken: refreshTokenSchema,
})

/**
 * 일반 문자열 검증 (Sanitization용)
 * - SQL 인젝션 방어
 * - XSS 방어
 * - 길이 제한
 */
export const sanitizedStringSchema = z
  .string()
  .max(1000, '입력값은 최대 1000자까지 가능합니다.')
  .refine(
    (value) => {
      // SQL 인젝션 방어: 위험한 문자 제한
      const dangerousChars = /[;'"\\<>]/
      return !dangerousChars.test(value)
    },
    {
      message: '사용할 수 없는 문자가 포함되어 있습니다.',
    }
  )
  .transform((value) => value.trim())

/**
 * 타입 추론을 위한 타입 정의
 */
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type RefreshRequest = z.infer<typeof refreshRequestSchema>
export type SanitizedString = z.infer<typeof sanitizedStringSchema>
