export type QuestionType = "short" | "long" | "radio" | "checkbox" | "rating"

export interface QuestionOption {
  id: string
  label: string
}

export interface Question {
  id: string
  type: QuestionType
  label: string
  required: boolean
  options?: QuestionOption[]
}

export interface FormSchema {
  questions: Question[]
}
