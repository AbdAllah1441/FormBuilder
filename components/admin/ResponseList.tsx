"use client"

import { FormData, FormResponse } from "@/app/actions/forms"
import { Card, CardContent } from "@/components/ui/card"
import { Question } from "@/types/form"

interface ResponseListProps {
  form: FormData
  responses: FormResponse[]
}

function formatResponseValue(question: Question, value: any): string {
  if (value === null || value === undefined || value === "") {
    return "—"
  }

  switch (question.type) {
    case "checkbox":
      if (Array.isArray(value)) {
        const selectedOptions = question.options?.filter((opt) => value.includes(opt.id))
        return selectedOptions?.map((opt) => opt.label).join(", ") || value.join(", ")
      }
      return String(value)
    case "radio":
      if (question.options) {
        const selectedOption = question.options.find((opt) => opt.id === value)
        return selectedOption?.label || String(value)
      }
      return String(value)
    case "rating":
      return String(value)
    default:
      return String(value)
  }
}

export function ResponseList({ form, responses }: ResponseListProps) {
  return (
    <div className="space-y-4">
      {responses.map((response, index) => (
        <Card key={response.id} className="border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/30">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Response #{responses.length - index}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted {new Date(response.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {form.schema.questions.map((question) => {
                  const answer = response.responses[question.id]
                  return (
                    <div key={question.id} className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">
                        {question.label}
                        {question.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground pl-2 border-l-2 border-border/50">
                        {formatResponseValue(question, answer)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
