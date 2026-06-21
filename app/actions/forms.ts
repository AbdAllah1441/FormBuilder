"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { FormSchema } from "@/types/form";
import type { Form, FormResponse as PrismaFormResponse, Prisma } from "@/lib/generated/prisma/client";

export interface FormData {
  id: string;
  title: string;
  schema: FormSchema;
  created_at: string;
  user_id?: string;
}

export interface FormResponse {
  id: string;
  form_id: string;
  responses: Record<string, unknown>;
  created_at: string;
}

function toFormData(form: Form): FormData {
  return {
    id: form.id,
    title: form.title,
    schema: form.schema as unknown as FormSchema,
    created_at: form.createdAt.toISOString(),
    user_id: form.userId ?? undefined,
  };
}

function toFormResponse(data: PrismaFormResponse): FormResponse {
  return {
    id: data.id,
    form_id: data.formId,
    responses: data.responses as Record<string, unknown>,
    created_at: data.createdAt.toISOString(),
  };
}

export async function createForm(title: string, schema: FormSchema) {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be logged in to create a form", data: null };
  }

  try {
    const form = await prisma.form.create({
      data: {
        title,
        schema: schema as unknown as Prisma.InputJsonValue,
        userId: user.id,
      },
    });

    return { error: null, data: toFormData(form) };
  } catch (error) {
    console.error("Error creating form:", error);
    return { error: "Failed to create form", data: null };
  }
}

export async function getFormById(id: string) {
  try {
    const form = await prisma.form.findUnique({ where: { id } });
    if (!form) {
      return { error: "Form not found", data: null };
    }

    return { error: null, data: toFormData(form) };
  } catch (error) {
    console.error("Error fetching form:", error);
    return { error: "Failed to fetch form", data: null };
  }
}

export async function updateForm(id: string, title: string, schema: FormSchema) {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be logged in to update a form", data: null };
  }

  const existingForm = await prisma.form.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existingForm) {
    return { error: "Form not found", data: null };
  }

  if (existingForm.userId && existingForm.userId !== user.id) {
    return {
      error: "You don't have permission to update this form",
      data: null,
    };
  }

  try {
    const form = await prisma.form.update({
      where: { id },
      data: { title, schema: schema as unknown as Prisma.InputJsonValue },
    });

    return { error: null, data: toFormData(form) };
  } catch (error) {
    console.error("Error updating form:", error);
    return { error: "Failed to update form", data: null };
  }
}

export async function submitFormResponse(
  formId: string,
  responses: Record<string, unknown>,
) {
  try {
    const form = await prisma.form.findUnique({ where: { id: formId } });
    if (!form) {
      return { error: "Form not found", data: null };
    }

    const response = await prisma.formResponse.create({
      data: {
        formId,
        responses: responses as unknown as Prisma.InputJsonValue,
      },
    });

    return { error: null, data: toFormResponse(response) };
  } catch (error) {
    console.error("Error submitting form:", error);
    return { error: "Failed to submit form", data: null };
  }
}

export async function getFormResponses(formId: string) {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be logged in to view responses", data: null };
  }

  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: { userId: true },
  });

  if (!form) {
    return { error: "Form not found", data: null };
  }

  if (form.userId && form.userId !== user.id) {
    return {
      error: "You don't have permission to view these responses",
      data: null,
    };
  }

  try {
    const responses = await prisma.formResponse.findMany({
      where: { formId },
      orderBy: { createdAt: "desc" },
    });

    return {
      error: null,
      data: responses.map(toFormResponse),
    };
  } catch (error) {
    console.error("Error fetching form responses:", error);
    return { error: "Failed to fetch responses", data: null };
  }
}

export async function getUserForms() {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be logged in", data: null };
  }

  try {
    const forms = await prisma.form.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return { error: null, data: forms.map(toFormData) };
  } catch (error) {
    console.error("Error fetching user forms:", error);
    return { error: "Failed to fetch forms", data: null };
  }
}
