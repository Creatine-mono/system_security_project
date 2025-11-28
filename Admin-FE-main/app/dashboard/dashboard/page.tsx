"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlertIcon, GaugeIcon, TrendingUpIcon, AlertTriangleIcon, Search, Loader2, Database, RefreshCw } from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type HistoryItem = {
  id: number
  query: string
  created_at: string
  status?: string
}

type Summary = {
  total: number
  by_action: { action: string; count: number; last_run: string }[]
}

type NewsItem = {
  cve: string
  summary: string
  published: string
}

export default function DashboardPage() {
  const [cveSearch, setCveSearch] = useState("")
  const [searching, setSearching] = useState(false)
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([])
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [news, setNews] = useState<NewsItem[]>([])
  const [newsError, setNewsError] = useState<string | null>(null)
  const [loadingNews, setLoadingNews] = useState(false)

  useEffect(() => {
    loadRecentHistory()
    loadSummary()
    loadNews()
  }, [])

  const handleSearch = async () => {
    if (cveSearch.trim()) {
      setSearching(true)
      try {
        // 백엔드에 기록을 남기기 위해 한번 조회 호출
        await fetch(`/api/vulnerability/cve?id=${encodeURIComponent(cveSearch)}`)
      } catch (_) {
        // 실패해도 히스토리 화면으로 안내
      }
      setSearching(false)
      window.location.href = `/dashboard/cve-history?search=${encodeURIComponent(cveSearch)}`
    }
  }

  async function loadRecentHistory() {
    setHistoryError(null)
    try {
      const res = await fetch("/api/history?action=cve_lookup&limit=10", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "최근 검색을 불러오지 못했습니다.")
      setRecentHistory(data.items || [])
    } catch (err: any) {
      setHistoryError(err.message || "최근 검색을 불러오지 못했습니다.")
    }
  }

  async function loadSummary() {
    setLoadingSummary(true)
    setSummaryError(null)
    try {
      const res = await fetch("/api/dashboard/summary", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "요약 정보를 불러오지 못했습니다.")
      setSummary(data)
    } catch (err: any) {
      setSummaryError(err.message || "요약 정보를 불러오지 못했습니다.")
    } finally {
      setLoadingSummary(false)
    }
  }

  async function loadNews() {
    setLoadingNews(true)
    setNewsError(null)
    try {
      const res = await fetch("/api/vulnerability/news", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "뉴스를 불러오지 못했습니다.")
      setNews(data.items || [])
    } catch (err: any) {
      setNewsError(err.message || "뉴스를 불러오지 못했습니다.")
    } finally {
      setLoadingNews(false)
    }
  }

  const lastCve = recentHistory[0]?.query || "조회 내역 없음"
  const lastTime = recentHistory[0]?.created_at
    ? new Date(recentHistory[0].created_at).toLocaleString()
    : "N/A"
  const totalLookups = summary?.by_action?.find((x) => x.action === "cve_lookup")?.count ?? 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform statistics and performance.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CVE Search</CardTitle>
          <CardDescription>Search for Common Vulnerabilities and Exposures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter CVE ID (e.g., CVE-2024-1234)"
                className="pl-9"
                value={cveSearch}
                onChange={(e) => setCveSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={searching}>
              {searching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Search & Save
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">누적 CVE 조회</CardTitle>
              <GaugeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLookups}</div>
              <p className="text-xs text-muted-foreground">백엔드 기록에 저장된 총 CVE 조회 건수</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 실행 기록</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.total ?? 0}</div>
              <p className="text-xs text-muted-foreground">모든 액션(CVE, EPSS, 패키지 등) 합계</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">요약 새로고침</CardTitle>
              <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                <span>{summaryError ? summaryError : "백엔드 요약을 불러옵니다."}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={loadSummary}
                disabled={loadingSummary}
              >
                {loadingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                새로고침
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>CVE Metrics Overview</CardTitle>
            <CardDescription>CVSS, EPSS, Risk 지표를 한눈에</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>CVE Exploitation News</CardTitle>
            <CardDescription>최근 CVE 관련 기사/요약 7건</CardDescription>
          </CardHeader>
          <CardContent>
            {newsError && <p className="text-sm text-red-500">{newsError}</p>}
            {!newsError && news.length === 0 && !loadingNews && (
              <p className="text-sm text-muted-foreground">뉴스가 없습니다.</p>
            )}
            {loadingNews && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> 불러오는 중...
              </div>
            )}
            <div className="space-y-3">
              {news.map((item, idx) => (
                <div key={idx} className="rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold">{item.cve}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.published ? new Date(item.published).toLocaleString() : "N/A"}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{item.summary || "요약 없음"}</p>
                </div>
              ))}
            </div>
            <div className="pt-3">
              <Button size="sm" variant="ghost" onClick={loadNews} disabled={loadingNews}>
                {loadingNews ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                새로고침
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
