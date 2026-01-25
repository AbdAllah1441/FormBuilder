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
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { 
      error: "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.", 
      data: null 
    }
  }

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
    return { error: error.message || "Failed to create form. Please check your Supabase configuration.", data: null }
  }

  if (!data) {
    return { error: "No data returned from Supabase", data: null }
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
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { 
      error: "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.", 
      data: null 
    }
  }

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
    return { error: updateError.message || "Failed to update form. Please check your Supabase configuration.", data: null }
  }

  // Then fetch the updated form
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching updated form:", error)
    return { error: error.message || "Failed to fetch updated form.", data: null }
  }

  if (!data) {
    return { error: "No data returned from Supabase", data: null }
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
