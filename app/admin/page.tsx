import { getUserForms } from "@/app/actions/forms";
import { FormsList } from "@/components/admin/FormsList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Forms - Admin",
  description: "View and manage all your published forms",
};

export default async function AdminFormsPage() {
  const { data: forms, error } = await getUserForms();

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <FormsList forms={forms ?? []} error={error} />
      </div>
    </div>
  );
}
