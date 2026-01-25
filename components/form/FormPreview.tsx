"use client"

import { FormSchema } from "@/types/form"
import { QuestionPreview } from "./QuestionPreview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FormPreviewProps {
  schema: FormSchema
}

export function FormPreview({ schema }: FormPreviewProps) {
  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold">Form Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {schema.questions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No questions to preview. Add questions in the builder!
            </div>
          ) : (
            schema.questions.map((question) => (
              <div key={question.id} className="pb-4 border-b border-border/30 last:border-0 last:pb-0">
                <QuestionPreview question={question} />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
