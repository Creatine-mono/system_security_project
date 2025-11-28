"use client"

import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

type HistoryItem = { action: string; created_at: string }
type Summary = { by_action: { action: string; count: number; last_run: string }[] }

export function DashboardChart() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, sumRes] = await Promise.all([
          fetch("/api/history?limit=500", { cache: "no-store" }),
          fetch("/api/dashboard/summary", { cache: "no-store" }),
        ])
        const histJson = await histRes.json()
        const sumJson = await sumRes.json()
        if (!histRes.ok) throw new Error(histJson.error || "히스토리를 불러오지 못했습니다.")
        if (!sumRes.ok) throw new Error(sumJson.error || "요약 정보를 불러오지 못했습니다.")
        setHistory(histJson.items || [])
        setSummary(sumJson)
      } catch (err: any) {
        setError(err.message || "지표 데이터를 불러오지 못했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const chartData = useMemo(() => {
    // 최근 7일 날짜 키 생성
    const now = new Date()
    const days: string[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      days.push(d.toISOString().slice(0, 10))
    }

    const dailyTotals: Record<string, { total: number; cve: number }> = {}
    days.forEach((d) => (dailyTotals[d] = { total: 0, cve: 0 }))

    history.forEach((item) => {
      const day = item.created_at.slice(0, 10)
      if (dailyTotals[day]) {
        dailyTotals[day].total += 1
        if (item.action === "cve_lookup") dailyTotals[day].cve += 1
      }
    })

    return days.map((d) => ({
      day: d.slice(5), // MM-DD
      total: dailyTotals[d]?.total ?? 0,
      cve: dailyTotals[d]?.cve ?? 0,
    }))
  }, [history])

  const actionData = useMemo(() => {
    if (!summary?.by_action) return []
    return summary.by_action.map((a) => ({ action: a.action, count: a.count }))
  }, [summary])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[350px] w-full bg-muted/20 rounded-md">
        <p className="text-muted-foreground">지표를 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[350px] w-full bg-muted/20 rounded-md">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} name="총 실행(일간)" />
            <Bar dataKey="cve" fill="#f97316" radius={[4, 4, 0, 0]} name="CVE 조회(일간)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={actionData} layout="vertical" margin={{ top: 10, right: 10, left: 40, bottom: 10 }}>
            <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              dataKey="action"
              type="category"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={140}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 4, 4]} name="누적 실행 횟수" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
