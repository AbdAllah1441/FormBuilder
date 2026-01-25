"use client"

import { FormSchema, QuestionType } from "@/types/form"
import { FormAction } from "@/lib/form-reducer"
import { QuestionList } from "./QuestionList"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface FormBuilderProps {
  schema: FormSchema
  dispatch: (action: FormAction) => void
}

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: "short", label: "Short Answer" },
  { value: "long", label: "Long Answer" },
  { value: "radio", label: "Multiple Choice (Radio)" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "rating", label: "Rating" },
]

export function FormBuilder({ schema, dispatch }: FormBuilderProps) {
  const handleAddQuestion = (type: QuestionType) => {
    dispatch({ type: "ADD_QUESTION", questionType: type })
  }

  const handleUpdateQuestion = (id: string, updates: Partial<FormSchema["questions"][0]>) => {
    dispatch({ type: "UPDATE_QUESTION", id, updates })
  }

  const handleDeleteQuestion = (id: string) => {
    dispatch({ type: "DELETE_QUESTION", id })
  }

  const handleReorder = (activeId: string, overId: string) => {
    dispatch({ type: "REORDER_QUESTIONS", activeId, overId })
  }

  const handleAddOption = (questionId: string) => {
    dispatch({ type: "ADD_OPTION", questionId })
  }

  const handleDeleteOption = (questionId: string, optionId: string) => {
    dispatch({ type: "DELETE_OPTION", questionId, optionId })
  }

  const handleUpdateOption = (questionId: string, optionId: string, label: string) => {
    dispatch({ type: "UPDATE_OPTION", questionId, optionId, label })
  }

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold">Form Builder</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {questionTypes.map((type) => (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() => handleAddQuestion(type.value)}
                >
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <QuestionList
          questions={schema.questions}
          onUpdate={handleUpdateQuestion}
          onDelete={handleDeleteQuestion}
          onReorder={handleReorder}
          onAddOption={handleAddOption}
          onDeleteOption={handleDeleteOption}
          onUpdateOption={handleUpdateOption}
        />
      </CardContent>
    </Card>
  )
}
