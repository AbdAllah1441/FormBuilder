"use client"

import { FormData, FormResponse } from "@/app/actions/forms"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher"
import { UserMenu } from "@/components/auth/UserMenu"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"
import Link from "next/link"
import { ResponseList } from "./ResponseList"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { isFileAttachment } from "@/lib/file-attachment"
import { Question } from "@/types/form"

interface AdminDashboardProps {
  form: FormData
  responses: FormResponse[]
  responsesError: string | null
}

export function AdminDashboard({ form, responses, responsesError }: AdminDashboardProps) {
  const { t } = useLanguage()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  const formatCsvValue = (question: Question | undefined, value: unknown) => {
    if (value === null || value === undefined) return ""

    if (question?.type === "attachment" && isFileAttachment(value)) {
      return value.name
    }

    if (Array.isArray(value)) {
      return value.join(", ")
    }

    return value.toString()
  }

  const exportToCSV = () => {
    if (responses.length === 0) return

    // Get all unique question IDs from responses
    const allQuestionIds = new Set<string>()
    responses.forEach((response) => {
      Object.keys(response.responses).forEach((qId) => allQuestionIds.add(qId))
    })

    // Map question IDs to labels
    const questionLabels: Record<string, string> = {}
    form.schema.questions.forEach((q) => {
      questionLabels[q.id] = q.label
    })

    // Create CSV header
    const headers = ["Response ID", "Submitted At", ...Array.from(allQuestionIds).map((id) => questionLabels[id] || id)]
    const rows = [headers]

    // Create CSV rows
    responses.forEach((response) => {
      const row = [
        response.id,
        new Date(response.created_at).toLocaleString(),
        ...Array.from(allQuestionIds).map((id) => {
          const question = form.schema.questions.find((q) => q.id === id)
          return formatCsvValue(question, response.responses[id])
        }),
      ]
      rows.push(row)
    })

    // Convert to CSV string
    const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    // Download
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form.title}_responses_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.myForms}
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{form.title}</h1>
          <p className="text-muted-foreground mt-1">{t.adminDashboard}</p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <UserMenu />
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {t.refresh}
          </Button>
          {responses.length > 0 && (
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              {t.exportCSV}
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t.totalResponses}</CardDescription>
            <CardTitle className="text-3xl">{responses.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t.formCreated}</CardDescription>
            <CardTitle className="text-lg font-normal">
              {new Date(form.created_at).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t.questions}</CardDescription>
            <CardTitle className="text-3xl">{form.schema.questions.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Responses */}
      <Card>
        <CardHeader>
          <CardTitle>{t.formResponses}</CardTitle>
          <CardDescription>
            {t.viewResponses}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {responsesError ? (
            <div className="text-center py-8 text-destructive">
              <p>{t.errorLoadingResponses}: {responsesError}</p>
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">{t.noResponses}</p>
              <p className="text-sm">
                {t.shareFormLink}
              </p>
            </div>
          ) : (
            <ResponseList form={form} responses={responses} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
