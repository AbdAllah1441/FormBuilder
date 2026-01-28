"use client";

import { useReducer, useState } from "react";
import { FormBuilder } from "@/components/form/FormBuilder";
import { FormPreview } from "@/components/form/FormPreview";
import { ShareButton } from "@/components/form/ShareButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { UserMenu } from "@/components/auth/UserMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { FormSchema } from "@/types/form";
import { formReducer, FormAction } from "@/lib/form-reducer";

export default function Home() {
  const [schema, dispatch] = useReducer(formReducer, { questions: [] });
  const [formTitle, setFormTitle] = useState("");
  const { t } = useLanguage();

  const handleAction = (action: FormAction) => {
    dispatch(action);
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/10">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12">
        <header className="mb-12 md:mb-16 text-center lg:text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
              v1.0 Beta
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl pb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {t.formBuilder}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl lg:mx-0 mx-auto leading-relaxed">
            {t.createForms}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Left: Form Builder */}
          <div className="space-y-6">
            <FormBuilder schema={schema} dispatch={handleAction} />
            <ShareButton
              schema={schema}
              title={formTitle}
              onTitleChange={setFormTitle}
            />
          </div>

          {/* Right: Live Preview */}
          <div className="space-y-6">
            <FormPreview schema={schema} />
          </div>
        </div>
      </div>
    </div>
  );
}
