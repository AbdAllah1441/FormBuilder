"use client";

import Link from "next/link";
import { FormListItem } from "@/app/actions/forms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { UserMenu } from "@/components/auth/UserMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowLeft,
  BarChart3,
  ExternalLink,
  FileText,
  Plus,
} from "lucide-react";

interface FormsListProps {
  forms: FormListItem[];
  error: string | null;
}

export function FormsList({ forms, error }: FormsListProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 me-2" />
                {t.backToBuilder}
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{t.myForms}</h1>
          <p className="text-muted-foreground mt-1">{t.manageForms}</p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <UserMenu />
          <Button asChild>
            <Link href="/">
              <Plus className="h-4 w-4 me-2" />
              {t.createNewForm}
            </Link>
          </Button>
        </div>
      </div>

      {error ? (
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      ) : forms.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">{t.noForms}</p>
            <p className="text-muted-foreground mb-6">{t.createFirstForm}</p>
            <Button asChild>
              <Link href="/">{t.createNewForm}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <Card key={form.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">{form.title}</CardTitle>
                <CardDescription>
                  {t.formCreated}:{" "}
                  {new Date(form.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>
                    {form.schema.questions.length} {t.questions}
                  </span>
                  <span>
                    {form.response_count} {t.totalResponses}
                  </span>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button variant="default" size="sm" className="flex-1" asChild>
                    <Link href={`/admin/${form.id}`}>
                      <BarChart3 className="h-4 w-4 me-2" />
                      {t.viewDashboard}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/form/${form.id}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">{t.openPublicForm}</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
