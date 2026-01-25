"use client";

import { useState } from "react";
import { FormData, submitFormResponse } from "@/app/actions/forms";
import { QuestionPreview } from "./QuestionPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Question } from "@/types/form";

interface PublicFormProps {
  form: FormData;
  onSubmit: typeof submitFormResponse;
}

export function PublicForm({ form, onSubmit }: PublicFormProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const validateForm = (): boolean => {
    for (const question of form.schema.questions) {
      if (question.required) {
        const response = responses[question.id];
        if (
          response === undefined ||
          response === null ||
          response === "" ||
          (Array.isArray(response) && response.length === 0)
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await onSubmit(form.id, responses);

      if (submitError) {
        setError(submitError);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit form. Please try again.");
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="shadow-lg">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Thank You!</h2>
            <p className="text-muted-foreground">
              Your form has been submitted successfully.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto pb-12">
      {/* Header Card */}
      <Card className="shadow-sm border-border/50 rounded-xl overflow-hidden">
        <CardHeader className="pb-6 pt-6">
          <CardTitle className="text-3xl font-semibold">{form.title}</CardTitle>
          {/* Description could go here if we had one */}
        </CardHeader>
      </Card>

      {/* Questions Stack */}
      <div className="space-y-4">
        {form.schema.questions.map((question) => (
          <Card
            key={question.id}
            className="shadow-sm rounded-xl border border-border/50 transition-all hover:shadow-md"
          >
            <CardContent className="pt-6 pb-6">
              <PublicQuestionPreview
                question={question}
                value={responses[question.id]}
                onChange={(value) => handleResponseChange(question.id, value)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer / Submit */}
      <div className="flex justify-between items-center px-1">
        <div className="text-sm text-muted-foreground">
          {/* Optional form footer text */}
        </div>
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm font-medium mr-4">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-8"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}

interface PublicQuestionPreviewProps {
  question: Question;
  value?: any;
  onChange: (value: any) => void;
}

function PublicQuestionPreview({
  question,
  value,
  onChange,
}: PublicQuestionPreviewProps) {
  // Create a modified question with the value for preview
  const questionWithValue = { ...question };

  switch (question.type) {
    case "short":
      return (
        <ShortAnswerInput
          label={question.label}
          required={question.required}
          value={value || ""}
          onChange={onChange}
        />
      );
    case "long":
      return (
        <LongAnswerInput
          label={question.label}
          required={question.required}
          value={value || ""}
          onChange={onChange}
        />
      );
    case "radio":
      return (
        <RadioInput
          label={question.label}
          required={question.required}
          options={question.options || []}
          value={value}
          onChange={onChange}
        />
      );
    case "checkbox":
      return (
        <CheckboxInput
          label={question.label}
          required={question.required}
          options={question.options || []}
          value={value || []}
          onChange={onChange}
        />
      );
    case "rating":
      return (
        <RatingInput
          label={question.label}
          required={question.required}
          value={value}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

// Import the input components
import { ShortAnswerInput } from "./ShortAnswerInput";
import { LongAnswerInput } from "./LongAnswerInput";
import { RadioInput } from "./RadioInput";
import { CheckboxInput } from "./CheckboxInput";
import { RatingInput } from "./RatingInput";
