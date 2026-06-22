"use client"

import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { FileAttachment } from "@/types/form"
import {
  fileToAttachment,
  formatFileSize,
  MAX_ATTACHMENT_SIZE,
} from "@/lib/file-attachment"
import { FileUp, X } from "lucide-react"

interface AttachmentInputProps {
  label: string
  required?: boolean
  value?: FileAttachment
  onChange?: (value: FileAttachment | undefined) => void
}

export function AttachmentInput({
  label,
  required,
  value,
  onChange,
}: AttachmentInputProps) {
  const { t } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReading, setIsReading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsReading(true)

    try {
      const attachment = await fileToAttachment(file)
      onChange?.(attachment)
    } catch (err) {
      if (err instanceof Error && err.message === "FILE_TOO_LARGE") {
        setError(t.fileTooLarge)
      } else {
        setError(t.fileReadError)
      }
      onChange?.(undefined)
    } finally {
      setIsReading(false)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const handleClear = () => {
    setError(null)
    onChange?.(undefined)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={isReading}
      />

      <div className="mt-3 space-y-3">
        {value ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(value.size)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              aria-label={t.removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={openFilePicker}
            disabled={isReading}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/20 px-6 py-8 transition-colors hover:bg-muted/40 hover:border-border disabled:opacity-50"
          >
            <FileUp className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium">{t.chooseFile}</span>
            <span className="text-xs text-muted-foreground text-center">
              {t.maxFileSize} {formatFileSize(MAX_ATTACHMENT_SIZE)}
            </span>
          </button>
        )}

        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFilePicker}
            disabled={isReading}
          >
            {t.replaceFile}
          </Button>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  )
}
