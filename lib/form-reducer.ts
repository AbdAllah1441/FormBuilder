import { Question, QuestionType, FormSchema } from "@/types/form"

export type FormAction =
  | { type: "ADD_QUESTION"; questionType: QuestionType }
  | { type: "DELETE_QUESTION"; id: string }
  | { type: "UPDATE_QUESTION"; id: string; updates: Partial<Question> }
  | { type: "REORDER_QUESTIONS"; activeId: string; overId: string }
  | { type: "ADD_OPTION"; questionId: string }
  | { type: "DELETE_OPTION"; questionId: string; optionId: string }
  | { type: "UPDATE_OPTION"; questionId: string; optionId: string; label: string }

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function formReducer(state: FormSchema, action: FormAction): FormSchema {
  switch (action.type) {
    case "ADD_QUESTION": {
      let options: { id: string; label: string }[] | undefined
      
      if (action.questionType === "rating") {
        // Rating questions have fixed 1-5 options
        options = Array.from({ length: 5 }, (_, i) => ({
          id: generateId(),
          label: String(i + 1),
        }))
      } else if (action.questionType === "radio" || action.questionType === "checkbox") {
        options = [
          { id: generateId(), label: "Option 1" },
          { id: generateId(), label: "Option 2" },
        ]
      }

      const newQuestion: Question = {
        id: generateId(),
        type: action.questionType,
        label: "New Question",
        required: false,
        ...(options ? { options } : {}),
      }
      return {
        ...state,
        questions: [...state.questions, newQuestion],
      }
    }

    case "DELETE_QUESTION": {
      return {
        ...state,
        questions: state.questions.filter((q) => q.id !== action.id),
      }
    }

    case "UPDATE_QUESTION": {
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.id ? { ...q, ...action.updates } : q
        ),
      }
    }

    case "REORDER_QUESTIONS": {
      const { activeId, overId } = action
      const questions = [...state.questions]
      const activeIndex = questions.findIndex((q) => q.id === activeId)
      const overIndex = questions.findIndex((q) => q.id === overId)

      if (activeIndex === -1 || overIndex === -1) return state

      const [removed] = questions.splice(activeIndex, 1)
      questions.splice(overIndex, 0, removed)

      return {
        ...state,
        questions,
      }
    }

    case "ADD_OPTION": {
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.questionId
            ? {
                ...q,
                options: [
                  ...(q.options || []),
                  { id: generateId(), label: `Option ${(q.options?.length || 0) + 1}` },
                ],
              }
            : q
        ),
      }
    }

    case "DELETE_OPTION": {
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.questionId
            ? {
                ...q,
                options: (q.options || []).filter((o) => o.id !== action.optionId),
              }
            : q
        ),
      }
    }

    case "UPDATE_OPTION": {
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.questionId
            ? {
                ...q,
                options: (q.options || []).map((o) =>
                  o.id === action.optionId ? { ...o, label: action.label } : o
                ),
              }
            : q
        ),
      }
    }

    default:
      return state
  }
}
