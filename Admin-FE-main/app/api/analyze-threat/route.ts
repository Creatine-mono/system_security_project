import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cveId, productName, fileName } = body

    // 입력 데이터 검증
    if (!cveId && !productName && !fileName) {
      return NextResponse.json(
        { error: 'CVE ID, 제품명, 또는 파일 중 하나는 입력해주세요.' },
        { status: 400 }
      )
    }

    // CVE 형식 검증 (프론트엔드에서도 하지만 백엔드에서도 한번 더 검증)
    if (cveId) {
      const cvePattern = /^CVE-\d{4}-\d{4,}$/
      if (!cvePattern.test(cveId)) {
        return NextResponse.json(
          { error: '올바른 CVE 형식을 입력하세요 (예: CVE-2024-1234)' },
          { status: 400 }
        )
      }
    }

    // 프롬프트 생성
    const prompt = generateThreatAnalysisPrompt(cveId, productName, fileName)
    
    // 콘솔에 프롬프트 출력
    console.log('='.repeat(80))
    console.log('🔍 CVE 위협 분석 요청')
    console.log('='.repeat(80))
    console.log('📋 입력 데이터:')
    if (cveId) console.log(`   CVE ID: ${cveId}`)
    if (productName) console.log(`   제품명: ${productName}`)
    if (fileName) console.log(`   파일명: ${fileName}`)
    console.log('')
    console.log('🤖 생성된 프롬프트:')
    console.log(prompt)
    console.log('='.repeat(80))

    // 시뮬레이션된 분석 결과 (나중에 Gemini API로 교체)
    const analysisResult = {
      cveId: cveId || "CVE-2024-1234",
      productName: productName || "Sample Product",
      riskLevel: "High",
      cvssScore: 8.2,
      epssScore: 0.75,
      exploitability: "Active",
      affectedVersions: ["1.0.0", "1.1.0", "1.2.0"],
      recommendations: [
        "즉시 보안 패치 적용",
        "네트워크 분리 고려",
        "모니터링 강화"
      ],
      timeline: [
        { date: "2024-01-15", event: "취약점 발견", status: "discovered" },
        { date: "2024-01-20", event: "CVE 할당", status: "assigned" },
        { date: "2024-01-25", event: "공개 공개", status: "published" },
        { date: "2024-02-01", event: "악용 사례 발견", status: "exploited" }
      ],
      prompt: prompt // 디버깅용으로 프롬프트도 포함
    }

    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error('❌ 위협 분석 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

function generateThreatAnalysisPrompt(cveId?: string, productName?: string, fileName?: string): string {
  let prompt = "다음 정보를 바탕으로 CVE 위협을 분석해주세요:\n\n"
  
  if (cveId) {
    prompt += `CVE ID: ${cveId}\n`
  }
  
  if (productName) {
    prompt += `제품명: ${productName}\n`
  }
  
  if (fileName) {
    prompt += `업로드된 파일: ${fileName}\n`
  }
  
  prompt += "\n다음 항목들을 분석해주세요:\n"
  prompt += "1. 위험도 평가 (Critical/High/Medium/Low)\n"
  prompt += "2. CVSS 점수 예측\n"
  prompt += "3. EPSS (Exploit Prediction Scoring System) 점수\n"
  prompt += "4. 악용 가능성\n"
  prompt += "5. 영향받는 버전\n"
  prompt += "6. 권장 보안 조치\n"
  prompt += "7. 취약점 타임라인\n"
  prompt += "8. 추가 보안 고려사항\n\n"
  prompt += "분석 결과를 JSON 형식으로 제공해주세요."
  
  return prompt
}