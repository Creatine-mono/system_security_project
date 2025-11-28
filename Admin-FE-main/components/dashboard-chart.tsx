"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

export function DashboardChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[350px] w-full bg-muted/20 rounded-md">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    )
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={cveData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <XAxis dataKey="cveId" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Legend />
          <Bar dataKey="cvss" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="CVSS Score" />
          <Bar dataKey="epss" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="EPSS (x10)" />
          <Bar dataKey="risk" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Risk Level" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const cveData = [
  {
    cveId: "CVE-2024-1234",
    cvss: 7.8,
    epss: 8.5, // EPSS multiplied by 10 for visibility (0.85 -> 8.5)
    risk: 9, // Critical = 9
  },
  {
    cveId: "CVE-2024-5678",
    cvss: 9.1,
    epss: 9.2,
    risk: 10, // Critical = 10
  },
  {
    cveId: "CVE-2024-9012",
    cvss: 6.5,
    epss: 4.3,
    risk: 7, // High = 7
  },
  {
    cveId: "CVE-2023-8765",
    cvss: 5.4,
    epss: 2.1,
    risk: 5, // Medium = 5
  },
  {
    cveId: "CVE-2023-4321",
    cvss: 8.2,
    epss: 7.8,
    risk: 8, // High = 8
  },
  {
    cveId: "CVE-2023-1111",
    cvss: 4.3,
    epss: 1.5,
    risk: 4, // Medium = 4
  },
]
