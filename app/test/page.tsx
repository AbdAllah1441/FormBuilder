"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TestPage() {
  const createForm = async () => {
    const { data, error } = await supabase
      .from("forms")
      .insert({
        title: "My First Form",
        schema: {
          questions: [{ type: "short", label: "What is your name?" }],
        },
      })
      .select()
      .single();

    console.log(data, error);
  };

  return (
    <div>
      <button onClick={createForm}>Create Form</button>
    </div>
  );
}
