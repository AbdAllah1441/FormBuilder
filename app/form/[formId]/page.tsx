import { getFormById, submitFormResponse } from "@/app/actions/forms"
import { PublicForm } from "@/components/form/PublicForm"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ formId: string }>
}

export default async function FormPage({ params }: PageProps) {
  const { formId } = await params
  const { data: form, error } = await getFormById(formId)

  if (error || !form) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-12">
      <div className="max-w-2xl mx-auto">
        <PublicForm form={form} onSubmit={submitFormResponse} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { formId } = await params
  const { data: form } = await getFormById(formId)

  return {
    title: form?.title || "Form",
    description: "Fill out this form",
  }
}
