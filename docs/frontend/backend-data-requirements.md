# 매칭 리포트 백엔드 데이터 요구사항

## 1. 목적
- 매칭 결과 리포트 화면에서 **정적/더미로 표시 중인 값**을 실제 데이터로 대체하기 위함
- 투자자 데모용 리포트 완성도 향상 및 사용자 신뢰도 확보

## 2. 추가 필요 필드 (제안)

### 2.1 School 확장 필드
| 필드 | 타입 | 예시 | 설명 |
|------|------|------|------|
| `global_ranking` | string | `#4` | 글로벌 랭킹 표시 |
| `ranking_field` | string | `Computer Science` | 랭킹 기준 전공 |
| `average_salary` | number | `85000` | 평균 초봉 (USD) |
| `alumni_network_count` | number | `38000` | 동문 네트워크 규모 |
| `feature_badges` | string[] | `["OPT STEM ELIGIBLE", "ON-CAMPUS HOUSING"]` | 특징 배지 |

### 2.2 MatchingResultItem 확장 필드
| 필드 | 타입 | 예시 | 설명 |
|------|------|------|------|
| `estimated_roi` | number | `12.5` | 연간 예상 ROI (%) |

## 3. 프론트 반영 방식
- 현재는 [matchingReportMock.ts](../../src/data/matchingReportMock.ts)에 정적 값으로 표기
- API 응답에 필드가 추가되면 **정적 값 제거 → API 필드로 치환**

## 4. 예시 응답 스키마 (확장)
```json
{
  "success": true,
  "data": {
    "matching_id": "uuid",
    "user_id": "uuid",
    "results": [
      {
        "rank": 1,
        "total_score": 98,
        "estimated_roi": 12.5,
        "school": {
          "id": "uuid",
          "name": "UC Berkeley",
          "global_ranking": "#4",
          "ranking_field": "Computer Science",
          "average_salary": 85000,
          "alumni_network_count": 38000,
          "feature_badges": ["OPT STEM ELIGIBLE", "ON-CAMPUS HOUSING"]
        }
      }
    ]
  }
}
```

## 5. 협업 포인트
- 공식 명세: [04_BACKEND_COOPERATION.md](../04_BACKEND_COOPERATION.md), [matching.md](https://github.com/park-jongbeom/ga-api-platform/blob/main/docs/api/matching.md)
- 필드 확장 시 프론트 타입(`src/types/matching.ts`) 업데이트 필요
