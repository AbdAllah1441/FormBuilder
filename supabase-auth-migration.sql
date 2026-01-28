-- Run this SQL in your Supabase SQL Editor to add authentication support

-- Add user_id column to forms table
ALTER TABLE forms ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);

-- Update RLS policies for forms table
-- First, drop existing policies
DROP POLICY IF EXISTS "Public read forms" ON forms;
DROP POLICY IF EXISTS "Public insert forms" ON forms;
DROP POLICY IF EXISTS "Public update forms" ON forms;

-- Create new policies that check user ownership
-- Allow anyone to read published forms (for public form submission)
CREATE POLICY "Anyone can read forms" ON forms
  FOR SELECT USING (true);

-- Allow authenticated users to insert their own forms
CREATE POLICY "Users can insert own forms" ON forms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own forms
CREATE POLICY "Users can update own forms" ON forms
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete only their own forms
CREATE POLICY "Users can delete own forms" ON forms
  FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policies for form_responses table
DROP POLICY IF EXISTS "Allow users to read form responses" ON form_responses;
DROP POLICY IF EXISTS "Allow users to insert form responses" ON form_responses;

-- Allow anyone to submit responses to any form
CREATE POLICY "Anyone can submit responses" ON form_responses
  FOR INSERT WITH CHECK (true);

-- Allow form owners to read responses
CREATE POLICY "Form owners can read responses" ON form_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = form_responses.form_id 
      AND forms.user_id = auth.uid()
    )
  );

-- IMPORTANT: Enable email authentication in Supabase Dashboard
-- Go to Authentication > Providers > Email and enable it
-- You may also want to configure:
-- - Email templates for confirmation emails
-- - Site URL for redirects
-- - Password requirements
