"use server";

import { createServerClient } from "@/lib/supabase/server";
import { FormSchema } from "@/types/form";

export interface FormData {
  id: string;
  title: string;
  schema: FormSchema;
  created_at: string;
  user_id?: string;
}

export async function createForm(title: string, schema: FormSchema) {
  // Check if Supabase is configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      error:
        "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
      data: null,
    };
  }

  const supabase = await createServerClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a form", data: null };
  }

  const { data, error } = await supabase
    .from("forms")
    .insert({
      title,
      schema,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating form:", error);
    return {
      error:
        error.message || "Failed to create form. Please check your Supabase configuration.",
      data: null,
    };
  }

  if (!data) {
    return { error: "No data returned from Supabase", data: null };
  }

  return { error: null, data: data as FormData };
}

export async function getFormById(id: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching form:", error);
    return { error: error.message, data: null };
  }

  return { error: null, data: data as FormData };
}

export async function updateForm(id: string, title: string, schema: FormSchema) {
  // Check if Supabase is configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      error:
        "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
      data: null,
    };
  }

  const supabase = await createServerClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update a form", data: null };
  }

  // Check if user owns this form
  const { data: existingForm } = await supabase
    .from("forms")
    .select("user_id")
    .eq("id", id)
    .single();

  if (existingForm?.user_id && existingForm.user_id !== user.id) {
    return { error: "You don't have permission to update this form", data: null };
  }

  // First, try to update
  const { error: updateError } = await supabase
    .from("forms")
    .update({
      title,
      schema,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Error updating form:", updateError);
    return {
      error:
        updateError.message ||
        "Failed to update form. Please check your Supabase configuration.",
      data: null,
    };
  }

  // Then fetch the updated form
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching updated form:", error);
    return { error: error.message || "Failed to fetch updated form.", data: null };
  }

  if (!data) {
    return { error: "No data returned from Supabase", data: null };
  }

  return { error: null, data: data as FormData };
}

export interface FormResponse {
  id: string;
  form_id: string;
  responses: Record<string, any>;
  created_at: string;
}

export async function submitFormResponse(
  formId: string,
  responses: Record<string, any>
) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("form_responses")
    .insert({
      form_id: formId,
      responses,
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting form:", error);
    return { error: error.message, data: null };
  }

  return { error: null, data };
}

export async function getFormResponses(formId: string) {
  // Check if Supabase is configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      error:
        "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
      data: null,
    };
  }

  const supabase = await createServerClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to view responses", data: null };
  }

  // Check if user owns this form
  const { data: form } = await supabase
    .from("forms")
    .select("user_id")
    .eq("id", formId)
    .single();

  if (form?.user_id && form.user_id !== user.id) {
    return { error: "You don't have permission to view these responses", data: null };
  }

  const { data, error } = await supabase
    .from("form_responses")
    .select("*")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching form responses:", error);
    return { error: error.message || "Failed to fetch responses.", data: null };
  }

  return { error: null, data: (data || []) as FormResponse[] };
}

export async function getUserForms() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in", data: null };
  }

  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user forms:", error);
    return { error: error.message, data: null };
  }

  return { error: null, data: (data || []) as FormData[] };
}
