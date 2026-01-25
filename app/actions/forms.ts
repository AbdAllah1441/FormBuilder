"use server"

import { createServerClient } from "@/lib/supabase/server"
import { FormSchema } from "@/types/form"

export interface FormData {
  id: string
  title: string
  schema: FormSchema
  created_at: string
}

export async function createForm(title: string, schema: FormSchema) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("forms")
    .insert({
      title,
      schema,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating form:", error)
    return { error: error.message, data: null }
  }

  return { error: null, data: data as FormData }
}

export async function getFormById(id: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching form:", error)
    return { error: error.message, data: null }
  }

  return { error: null, data: data as FormData }
}

export async function updateForm(id: string, title: string, schema: FormSchema) {
  const supabase = createServerClient()
  
  // First, try to update
  const { error: updateError } = await supabase
    .from("forms")
    .update({
      title,
      schema,
    })
    .eq("id", id)

  if (updateError) {
    console.error("Error updating form:", updateError)
    return { error: updateError.message, data: null }
  }

  // Then fetch the updated form
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching updated form:", error)
    return { error: error.message, data: null }
  }

  return { error: null, data: data as FormData }
}

export async function submitFormResponse(formId: string, responses: Record<string, any>) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from("form_responses")
    .insert({
      form_id: formId,
      responses,
    })
    .select()
    .single()

  if (error) {
    console.error("Error submitting form:", error)
    return { error: error.message, data: null }
  }

  return { error: null, data }
}
