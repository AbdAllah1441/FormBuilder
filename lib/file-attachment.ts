import { FileAttachment } from "@/types/form"

export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024

export function isFileAttachment(value: unknown): value is FileAttachment {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "type" in value &&
    "size" in value &&
    "data" in value
  )
}

export async function fileToAttachment(file: File): Promise<FileAttachment> {
  if (file.size > MAX_ATTACHMENT_SIZE) {
    throw new Error("FILE_TOO_LARGE")
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== "string") {
        reject(new Error("Failed to read file"))
        return
      }

      const base64 = result.split(",")[1]
      if (!base64) {
        reject(new Error("Failed to read file"))
        return
      }

      resolve({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        data: base64,
      })
    }
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export function attachmentToDataUrl(attachment: FileAttachment): string {
  return `data:${attachment.type};base64,${attachment.data}`
}

export function downloadAttachment(attachment: FileAttachment) {
  const link = document.createElement("a")
  link.href = attachmentToDataUrl(attachment)
  link.download = attachment.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
