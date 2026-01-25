"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Copy, Check, Loader2, ExternalLink, BarChart3 } from "lucide-react"
import { createForm, updateForm } from "@/app/actions/forms"
import { FormSchema } from "@/types/form"

interface ShareButtonProps {
  schema: FormSchema
  title: string
  onTitleChange: (title: string) => void
}

export function ShareButton({ schema, title, onTitleChange }: ShareButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishedFormId, setPublishedFormId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const handlePublish = async () => {
    if (!title.trim()) {
      alert("Please enter a form title")
      return
    }

    if (schema.questions.length === 0) {
      alert("Please add at least one question to your form")
      return
    }

    setIsPublishing(true)
    try {
      let result
      if (publishedFormId) {
        // Update existing form
        result = await updateForm(publishedFormId, title.trim(), schema)
      } else {
        // Create new form
        result = await createForm(title.trim(), schema)
      }
      
      if (result.error) {
        alert(`Error ${publishedFormId ? 'updating' : 'publishing'} form: ${result.error}`)
        return
      }

      if (result.data) {
        setPublishedFormId(result.data.id)
        setShowShareDialog(true)
      }
    } catch (error) {
      console.error("Error publishing form:", error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to ${publishedFormId ? 'update' : 'publish'} form. Please try again.`
      alert(`Error: ${errorMessage}`)
    } finally {
      setIsPublishing(false)
    }
  }

  const copyLink = () => {
    if (!publishedFormId) return
    
    const url = `${window.location.origin}/form/${publishedFormId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLink = publishedFormId
    ? `${window.location.origin}/form/${publishedFormId}`
    : ""

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Publish & Share</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">Form Title</label>
          <div className="mt-3">
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter form title"
              className="w-full"
            />
          </div>
        </div>

        {!publishedFormId ? (
          <Button
            onClick={handlePublish}
            disabled={isPublishing || !title.trim() || schema.questions.length === 0}
            className="w-full"
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Publish & Share
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded-md">
              <p className="text-sm font-semibold mb-2">Share Link:</p>
              <div className="flex items-center gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1 text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(shareLink, '_blank')}
                  className="shrink-0"
                  title="Open form in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handlePublish}
                disabled={isPublishing}
                variant="outline"
                className="flex-1"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Form"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`/admin/${publishedFormId}`, '_blank')}
                className="shrink-0"
                title="View responses dashboard in new tab"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
