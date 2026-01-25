"use client"

import { Question, QuestionType } from "@/types/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, X } from "lucide-react"
import { useState } from "react"

interface QuestionEditorProps {
  question: Question
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
  onAddOption?: () => void
  onDeleteOption?: (optionId: string) => void
  onUpdateOption?: (optionId: string, label: string) => void
}

export function QuestionEditor({
  question,
  onUpdate,
  onDelete,
  onAddOption,
  onDeleteOption,
  onUpdateOption,
}: QuestionEditorProps) {
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null)
  const [editingOptionLabel, setEditingOptionLabel] = useState("")

  const handleTypeChange = (newType: QuestionType) => {
    const updates: Partial<Question> = { type: newType }
    
    // Add default options for types that need them
    if (
      (newType === "radio" || newType === "checkbox" || newType === "rating") &&
      !question.options
    ) {
      updates.options = [
        { id: Math.random().toString(36).substring(2, 9), label: "Option 1" },
        { id: Math.random().toString(36).substring(2, 9), label: "Option 2" },
      ]
    }
    
    // Remove options for types that don't need them
    if (newType === "short" || newType === "long") {
      updates.options = undefined
    }

    onUpdate(updates)
  }

  const startEditingOption = (optionId: string, currentLabel: string) => {
    setEditingOptionId(optionId)
    setEditingOptionLabel(currentLabel)
  }

  const saveOption = () => {
    if (editingOptionId && editingOptionLabel.trim()) {
      onUpdateOption?.(editingOptionId, editingOptionLabel.trim())
      setEditingOptionId(null)
      setEditingOptionLabel("")
    }
  }

  const cancelEditing = () => {
    setEditingOptionId(null)
    setEditingOptionLabel("")
  }

  return (
    <Card className="mb-6 shadow-sm border-border/50">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Question Type Selector */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">Question Type</Label>
            <div className="mt-3">
              <Select
                value={question.type}
                onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                className="w-full"
              >
                <option value="short">Short Answer</option>
                <option value="long">Long Answer</option>
                <option value="radio">Multiple Choice (Radio)</option>
                <option value="checkbox">Checkboxes</option>
                <option value="rating">Rating</option>
              </Select>
            </div>
          </div>

          {/* Question Label */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">Question Label</Label>
            <div className="mt-3">
              <Input
                value={question.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Enter question label"
                className="w-full"
              />
            </div>
          </div>

          {/* Required Toggle */}
          <div className="flex items-center justify-between py-2">
            <Label className="text-sm font-semibold">Required</Label>
            <Switch
              checked={question.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
            />
          </div>

          {/* Options Editor (for radio, checkbox only - rating has fixed 1-5) */}
          {(question.type === "radio" || question.type === "checkbox") &&
            question.options && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  {question.type !== "rating" && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={onAddOption}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Option
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      {editingOptionId === option.id ? (
                        <>
                          <Input
                            value={editingOptionLabel}
                            onChange={(e) =>
                              setEditingOptionLabel(e.target.value)
                            }
                            onBlur={saveOption}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveOption()
                              } else if (e.key === "Escape") {
                                cancelEditing()
                              }
                            }}
                            className="flex-1"
                            autoFocus
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={saveOption}
                          >
                            ✓
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={cancelEditing}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Input
                            value={option.label}
                            readOnly
                            onClick={() => {
                              if (question.type !== "rating") {
                                startEditingOption(option.id, option.label)
                              }
                            }}
                            className={`flex-1 ${question.type === "rating" ? "cursor-default" : "cursor-pointer"}`}
                          />
                          {question.type !== "rating" && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => onDeleteOption?.(option.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Delete Button */}
          <div className="pt-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="w-full bg-[#c74245] text-white hover:bg-[#FF6467]/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Question
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
