"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Question } from "@/types/form"
import { QuestionEditor } from "./QuestionEditor"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionListProps {
  questions: Question[]
  onUpdate: (id: string, updates: Partial<Question>) => void
  onDelete: (id: string) => void
  onReorder: (activeId: string, overId: string) => void
  onAddOption: (questionId: string) => void
  onDeleteOption: (questionId: string, optionId: string) => void
  onUpdateOption: (questionId: string, optionId: string, label: string) => void
}

function SortableQuestionItem({
  question,
  onUpdate,
  onDelete,
  onAddOption,
  onDeleteOption,
  onUpdateOption,
}: {
  question: Question
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
  onAddOption?: () => void
  onDeleteOption?: (optionId: string) => void
  onUpdateOption?: (optionId: string, label: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute left-0 top-6 cursor-grab active:cursor-grabbing p-2 text-muted-foreground hover:text-foreground transition-colors",
          isDragging && "cursor-grabbing"
        )}
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="pl-10">
        <QuestionEditor
          question={question}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddOption={onAddOption}
          onDeleteOption={onDeleteOption}
          onUpdateOption={onUpdateOption}
        />
      </div>
    </div>
  )
}

export function QuestionList({
  questions,
  onUpdate,
  onDelete,
  onReorder,
  onAddOption,
  onDeleteOption,
  onUpdateOption,
}: QuestionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={questions.map((q) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No questions yet. Add a question to get started!
            </div>
          ) : (
            questions.map((question) => (
              <SortableQuestionItem
                key={question.id}
                question={question}
                onUpdate={(updates) => onUpdate(question.id, updates)}
                onDelete={() => onDelete(question.id)}
                onAddOption={() => onAddOption(question.id)}
                onDeleteOption={(optionId) =>
                  onDeleteOption(question.id, optionId)
                }
                onUpdateOption={(optionId, label) =>
                  onUpdateOption(question.id, optionId, label)
                }
              />
            ))
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}
