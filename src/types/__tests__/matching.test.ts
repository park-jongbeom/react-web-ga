import { describe, it, expect } from 'vitest'
import type { School, MatchingResultItem, MatchingResponse } from '../matching'

describe('matching types', () => {
  describe('School 확장 필드', () => {
    it('School 타입에 확장 필드(global_ranking, ranking_field, average_salary, alumni_network_count, feature_badges)가 존재해야 한다', () => {
      const school: School = {
        id: 's1',
        name: 'Test University',
        type: 'University',
        state: 'CA',
        city: 'Berkeley',
        tuition: 40000,
        image_url: '/img.jpg',
        global_ranking: '#4 (Computer Science)',
        ranking_field: 'Computer Science',
        average_salary: 85000,
        alumni_network_count: 38000,
        feature_badges: ['OPT STEM ELIGIBLE', 'ON-CAMPUS HOUSING'],
      }
      expect(school.global_ranking).toBe('#4 (Computer Science)')
      expect(school.ranking_field).toBe('Computer Science')
      expect(school.average_salary).toBe(85000)
      expect(school.alumni_network_count).toBe(38000)
      expect(school.feature_badges).toEqual(['OPT STEM ELIGIBLE', 'ON-CAMPUS HOUSING'])
    })

    it('확장 필드는 null일 수 있다', () => {
      const school: School = {
        id: 's2',
        name: 'Other School',
        type: 'College',
        state: 'NY',
        city: 'New York',
        tuition: 35000,
        image_url: '/other.jpg',
        global_ranking: null,
        ranking_field: null,
        average_salary: null,
        alumni_network_count: null,
        feature_badges: [],
      }
      expect(school.global_ranking).toBeNull()
      expect(school.average_salary).toBeNull()
    })
  })

  describe('MatchingResultItem estimated_roi', () => {
    it('MatchingResultItem 타입에 estimated_roi가 존재해야 한다', () => {
      const item: MatchingResultItem = {
        rank: 1,
        school: {
          id: 's1',
          name: 'UC Berkeley',
          type: 'University',
          state: 'CA',
          city: 'Berkeley',
          tuition: 30000,
          image_url: '/ucb.jpg',
        },
        program: {
          id: 'p1',
          name: 'Computer Science',
          degree: 'Bachelor',
          duration: '4 years',
          opt_available: true,
        },
        total_score: 95,
        score_breakdown: {
          academic: 90,
          english: 88,
          budget: 92,
          location: 95,
          duration: 85,
          career: 91,
        },
        recommendation_type: 'optimal',
        explanation: 'Best fit.',
        pros: [],
        cons: [],
        estimated_roi: 12.5,
      }
      expect(item.estimated_roi).toBe(12.5)
    })
  })

  describe('API 응답 파싱', () => {
    it('확장 필드를 포함한 API 응답이 MatchingResponse로 파싱되어야 한다', () => {
      const raw = {
        matching_id: 'match-123',
        user_id: 'user-1',
        total_matches: 5,
        execution_time_ms: 1200,
        created_at: '2026-02-04T10:00:00Z',
        results: [
          {
            rank: 1,
            estimated_roi: 12.5,
            school: {
              id: 's1',
              name: 'Stanford',
              type: 'University',
              state: 'CA',
              city: 'Stanford',
              tuition: 50000,
              image_url: '/stanford.jpg',
              global_ranking: '#1',
              ranking_field: 'Engineering',
              average_salary: 95000,
              alumni_network_count: 50000,
              feature_badges: ['STEM', 'OPT'],
            },
            program: {
              id: 'p1',
              name: 'CS',
              degree: 'MS',
              duration: '2 years',
              opt_available: true,
            },
            total_score: 98,
            score_breakdown: {
              academic: 95,
              english: 90,
              budget: 85,
              location: 92,
              duration: 88,
              career: 96,
            },
            recommendation_type: 'optimal',
            explanation: 'Strong match.',
            pros: ['Reputation'],
            cons: ['Cost'],
          },
        ],
      }
      const parsed = raw as MatchingResponse
      expect(parsed.results).toHaveLength(1)
      expect(parsed.results[0].estimated_roi).toBe(12.5)
      expect(parsed.results[0].school.global_ranking).toBe('#1')
      expect(parsed.results[0].school.average_salary).toBe(95000)
      expect(parsed.results[0].school.feature_badges).toEqual(['STEM', 'OPT'])
    })
  })
})
