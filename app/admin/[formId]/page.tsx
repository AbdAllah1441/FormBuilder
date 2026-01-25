import { getFormById, getFormResponses } from "@/app/actions/forms"
import { AdminDashboard } from "@/components/admin/AdminDashboard"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ formId: string }>
}

export default async function AdminPage({ params }: PageProps) {
  const { formId } = await params
  
  const [formResult, responsesResult] = await Promise.all([
    getFormById(formId),
    getFormResponses(formId),
  ])

  if (formResult.error || !formResult.data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <AdminDashboard
          form={formResult.data}
          responses={responsesResult.data || []}
          responsesError={responsesResult.error}
        />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { formId } = await params
  const { data: form } = await getFormById(formId)

  return {
    title: form ? `${form.title} - Admin Dashboard` : "Admin Dashboard",
    description: "View form responses and analytics",
  }
}
