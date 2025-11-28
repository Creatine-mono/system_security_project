import { Badge } from "@/components/ui/badge"
import { ExternalLink, Newspaper } from "lucide-react"

export function RecentTransactions() {
  return (
    <div className="space-y-6">
      {exploitationNews.map((news) => (
        <div key={news.id} className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium leading-tight">{news.title}</p>
              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={news.severity === "Critical" ? "destructive" : "secondary"} className="text-xs">
                {news.cveId}
              </Badge>
              <span className="text-xs text-muted-foreground">{news.date}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{news.source}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const exploitationNews = [
  {
    id: "1",
    cveId: "CVE-2024-1234",
    title: "Critical RCE Vulnerability Actively Exploited in the Wild",
    source: "BleepingComputer",
    date: "2024-11-14",
    severity: "Critical",
  },
  {
    id: "2",
    cveId: "CVE-2024-5678",
    title: "Zero-Day Exploit Used in Targeted Attacks Against Enterprises",
    source: "The Hacker News",
    date: "2024-11-13",
    severity: "Critical",
  },
  {
    id: "3",
    cveId: "CVE-2024-9012",
    title: "Privilege Escalation Flaw Discovered in Popular Software",
    source: "SecurityWeek",
    date: "2024-11-12",
    severity: "High",
  },
  {
    id: "4",
    cveId: "CVE-2023-8765",
    title: "Authentication Bypass Vulnerability Patched",
    source: "Dark Reading",
    date: "2024-11-11",
    severity: "Medium",
  },
  {
    id: "5",
    cveId: "CVE-2023-4321",
    title: "SQL Injection Vulnerability Exploited in Recent Campaign",
    source: "Threatpost",
    date: "2024-11-10",
    severity: "High",
  },
]
