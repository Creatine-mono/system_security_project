"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function VulnerabilityPage() {
  const [cveId, setCveId] = useState("");
  const [packageName, setPackageName] = useState("");
  const [cvssVector, setCvssVector] = useState("");
  const [showRawData, setShowRawData] = useState(false);

  const [cveResult, setCveResult] = useState<string | null>(null);
  const [epssResult, setEpssResult] = useState<string | null>(null);
  const [packageResult, setPackageResult] = useState<string | null>(null);
  const [cvssResult, setCvssResult] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const [loading, setLoading] = useState({
    cve: false,
    epss: false,
    package: false,
    cvss: false,
    ai: false,
  });

  const lookupCVE = async () => {
    setLoading({ ...loading, cve: true, ai: true });
    setCveResult(null);
    setAiAnalysis(null);

    try {
      // 1. Fetch CVE data
      const response = await fetch(`/api/vulnerability/cve?id=${cveId}`);
      const data = await response.json();

      if (response.ok) {
        setCveResult(data.result);

        // 2. Automatically trigger AI analysis
        try {
          const aiResponse = await fetch('/api/vulnerability/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cveId, rawData: data.result }),
          });
          const aiData = await aiResponse.json();

          if (aiResponse.ok) {
            setAiAnalysis(aiData.analysis);
          }
        } catch (aiError) {
          console.error('AI Analysis failed:', aiError);
        }
      } else {
        setCveResult(`오류: ${data.error}`);
      }
    } catch (error) {
      setCveResult(`오류: ${error}`);
    }

    setLoading({ ...loading, cve: false, ai: false });
  };

  const getEPSS = async () => {
    setLoading({ ...loading, epss: true });
    setEpssResult(null);

    try {
      const response = await fetch(`/api/vulnerability/epss?id=${cveId}`);
      const data = await response.json();

      if (response.ok) {
        setEpssResult(data.result);
      } else {
        setEpssResult(`오류: ${data.error}`);
      }
    } catch (error) {
      setEpssResult(`오류: ${error}`);
    }

    setLoading({ ...loading, epss: false });
  };

  const checkPackage = async () => {
    setLoading({ ...loading, package: true });
    setPackageResult(null);

    try {
      const response = await fetch(`/api/vulnerability/package?name=${packageName}`);
      const data = await response.json();

      if (response.ok) {
        setPackageResult(data.result);
      } else {
        setPackageResult(`오류: ${data.error}`);
      }
    } catch (error) {
      setPackageResult(`오류: ${error}`);
    }

    setLoading({ ...loading, package: false });
  };

  const calculateCVSS = async () => {
    setLoading({ ...loading, cvss: true });
    setCvssResult(null);

    try {
      const response = await fetch('/api/vulnerability/cvss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vector: cvssVector }),
      });
      const data = await response.json();

      if (response.ok) {
        setCvssResult(data.result);
      } else {
        setCvssResult(`오류: ${data.error}`);
      }
    } catch (error) {
      setCvssResult(`오류: ${error}`);
    }

    setLoading({ ...loading, cvss: false });
  };

  const analyzeWithAI = async () => {
    if (!cveResult) {
      alert('먼저 CVE 정보를 조회해주세요');
      return;
    }

    setLoading({ ...loading, ai: true });
    setAiAnalysis(null);

    try {
      const response = await fetch('/api/vulnerability/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cveId, rawData: cveResult }),
      });
      const data = await response.json();

      if (response.ok) {
        setAiAnalysis(data.analysis);
      } else {
        setAiAnalysis(`오류: ${data.error}`);
      }
    } catch (error) {
      setAiAnalysis(`오류: ${error}`);
    }

    setLoading({ ...loading, ai: false });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🛡️ 취약점 분석 시스템</h1>
        <p className="text-muted-foreground mt-2">
          CVE 조회, EPSS 점수, 패키지 취약점 검사 등 보안 분석 도구
        </p>
      </div>

      <Tabs defaultValue="cve" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cve">CVE 조회</TabsTrigger>
          <TabsTrigger value="epss">EPSS 점수</TabsTrigger>
          <TabsTrigger value="package">패키지 검사</TabsTrigger>
          <TabsTrigger value="cvss">CVSS 계산</TabsTrigger>
        </TabsList>

        <TabsContent value="cve">
          <Card>
            <CardHeader>
              <CardTitle>🔍 CVE 상세 조회</CardTitle>
              <CardDescription>
                CVE ID를 입력하여 한국어 분석 및 상세 정보를 조회합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="CVE-2021-44228"
                  value={cveId}
                  onChange={(e) => setCveId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && lookupCVE()}
                />
                <Button onClick={lookupCVE} disabled={loading.cve || loading.ai}>
                  {(loading.cve || loading.ai) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading.ai ? 'AI 분석 중...' : '조회'}
                </Button>
              </div>

              {/* 1. AI 한국어 분석 (최우선 표시) */}
              {aiAnalysis && (
                <div className="rounded-lg border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5 p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="default" className="text-base px-3 py-1">
                      🤖 AI 한국어 분석 (Claude Sonnet)
                    </Badge>
                    <Badge variant="outline">최초 분석</Badge>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                      {aiAnalysis}
                    </pre>
                  </div>
                </div>
              )}

              {/* 2. 한국 보안 정보 링크 */}
              {cveResult && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🇰🇷</span>
                    <div>
                      <h4 className="font-semibold">한국 보안 정보 확인</h4>
                      <p className="text-sm text-muted-foreground">
                        국내 보안기관의 관련 정보를 확인하세요
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://www.boho.or.kr/kr/bbs/list.do?searchCnd=1&searchWrd=${cveId}&bbsId=B0000133&menuNo=205020`, '_blank')}
                    >
                      🇰🇷 KISA 보안공지
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://www.krcert.or.kr/`, '_blank')}
                    >
                      🇰🇷 KrCERT 홈페이지
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://nvd.nist.gov/vuln/detail/${cveId}`, '_blank')}
                    >
                      🌐 NVD 상세보기
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cveId}`, '_blank')}
                    >
                      🌐 CVE.org
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://www.exploit-db.com/search?cve=${cveId}`, '_blank')}
                    >
                      💣 Exploit-DB
                    </Button>
                  </div>
                </div>
              )}

              {/* 3. NVD 원본 데이터 (접기/펼치기) */}
              {cveResult && (
                <div className="rounded-lg border border-muted bg-muted/30">
                  <button
                    onClick={() => setShowRawData(!showRawData)}
                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">📊 NVD 원본 데이터 (영문)</Badge>
                      <span className="text-sm text-muted-foreground">
                        미국 NIST 데이터베이스
                      </span>
                    </div>
                    <span className="text-sm font-mono">
                      {showRawData ? '▲ 접기' : '▼ 펼치기'}
                    </span>
                  </button>

                  {showRawData && (
                    <div className="border-t border-muted p-4 overflow-auto max-h-[500px]">
                      <pre className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">
                        {cveResult}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {loading.ai && !aiAnalysis && (
                <div className="rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-6 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-3" />
                  <p className="text-sm font-medium">AI가 취약점을 분석하고 있습니다...</p>
                  <p className="text-xs text-muted-foreground mt-1">약 30초 소요됩니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="epss">
          <Card>
            <CardHeader>
              <CardTitle>📊 EPSS 점수 조회</CardTitle>
              <CardDescription>
                취약점 악용 가능성 예측 점수 (30일 내 악용 확률)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="CVE-2021-44228"
                  value={cveId}
                  onChange={(e) => setCveId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && getEPSS()}
                />
                <Button onClick={getEPSS} disabled={loading.epss}>
                  {loading.epss && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  조회
                </Button>
              </div>

              {epssResult && (
                <div className="rounded-lg bg-muted p-4 overflow-auto max-h-[500px]">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {epssResult}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="package">
          <Card>
            <CardHeader>
              <CardTitle>📦 Python 패키지 취약점 검사</CardTitle>
              <CardDescription>
                Python 패키지의 알려진 취약점을 검사합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="requests"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkPackage()}
                />
                <Button onClick={checkPackage} disabled={loading.package}>
                  {loading.package && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  검사
                </Button>
              </div>

              {packageResult && (
                <div className="rounded-lg bg-muted p-4 overflow-auto max-h-[500px]">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {packageResult}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cvss">
          <Card>
            <CardHeader>
              <CardTitle>🧮 CVSS 점수 계산</CardTitle>
              <CardDescription>
                CVSS 벡터 스트링을 입력하여 점수를 계산합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H"
                  value={cvssVector}
                  onChange={(e) => setCvssVector(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && calculateCVSS()}
                />
                <Button onClick={calculateCVSS} disabled={loading.cvss}>
                  {loading.cvss && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  계산
                </Button>
              </div>

              {cvssResult && (
                <div className="rounded-lg bg-muted p-4 overflow-auto max-h-[500px]">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {cvssResult}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>💡 사용 예시</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">CVE ID</Badge>
              <code className="text-sm">CVE-2021-44228</code>
              <span className="text-muted-foreground text-sm">(Log4Shell)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Package</Badge>
              <code className="text-sm">requests</code>
              <span className="text-muted-foreground text-sm">(Python HTTP 라이브러리)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">CVSS Vector</Badge>
              <code className="text-sm">CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
