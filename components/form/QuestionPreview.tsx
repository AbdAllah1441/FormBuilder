"use client"

import { Question } from "@/types/form"
import { ShortAnswerInput } from "./ShortAnswerInput"
import { LongAnswerInput } from "./LongAnswerInput"
import { RadioInput } from "./RadioInput"
import { CheckboxInput } from "./CheckboxInput"
import { RatingInput } from "./RatingInput"
import { AttachmentInput } from "./AttachmentInput"
import { useState } from "react"
import { FileAttachment } from "@/types/form"

interface QuestionPreviewProps {
  question: Question
}

export function QuestionPreview({ question }: QuestionPreviewProps) {
  const [value, setValue] = useState<
    string | string[] | number | FileAttachment | undefined
  >(undefined)

  const handleChange = (
    newValue: string | string[] | number | FileAttachment | undefined
  ) => {
    setValue(newValue)
  }

  switch (question.type) {
    case "short":
      return (
        <ShortAnswerInput
          label={question.label}
          required={question.required}
          value={value as string}
          onChange={handleChange as (value: string) => void}
        />
      )
    case "long":
      return (
        <LongAnswerInput
          label={question.label}
          required={question.required}
          value={value as string}
          onChange={handleChange as (value: string) => void}
        />
      )
    case "radio":
      return (
        <RadioInput
          label={question.label}
          required={question.required}
          options={question.options || []}
          value={value as string}
          onChange={handleChange as (value: string) => void}
        />
      )
    case "checkbox":
      return (
        <CheckboxInput
          label={question.label}
          required={question.required}
          options={question.options || []}
          value={value as string[]}
          onChange={handleChange as (value: string[]) => void}
        />
      )
    case "rating":
      return (
        <RatingInput
          label={question.label}
          required={question.required}
          value={value as number}
          onChange={handleChange as (value: number) => void}
        />
      )
    case "attachment":
      return (
        <AttachmentInput
          label={question.label}
          required={question.required}
          value={value as FileAttachment}
          onChange={handleChange as (value: FileAttachment | undefined) => void}
        />
      )
    default:
      return null
  }
}
