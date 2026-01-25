# Database Setup Instructions

## Supabase Tables

You need to create two tables in your Supabase project:

### 1. Forms Table

If you haven't already created the `forms` table, run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  schema JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read forms (for public form access)
CREATE POLICY "Allow public to read forms"
  ON public.forms
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to create forms
CREATE POLICY "Allow authenticated users to create forms"
  ON public.forms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update their forms
CREATE POLICY "Allow authenticated users to update forms"
  ON public.forms
  FOR UPDATE
  TO authenticated
  USING (true);
```

### 2. Form Responses Table

Run this SQL to create the `form_responses` table:

```sql
CREATE TABLE IF NOT EXISTS public.form_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on form_id for faster queries
CREATE INDEX IF NOT EXISTS idx_form_responses_form_id ON public.form_responses(form_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_form_responses_created_at ON public.form_responses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert responses (for public form submissions)
CREATE POLICY "Allow public form submissions"
  ON public.form_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read form responses
CREATE POLICY "Allow users to read form responses"
  ON public.form_responses
  FOR SELECT
  TO authenticated
  USING (true);
```

## Quick Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the SQL from `supabase-migrations.sql` file
4. Click **Run** to execute the SQL

## Alternative: Using Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db push
```

This will apply the migrations from the `supabase-migrations.sql` file.

## Verification

After running the SQL, verify the tables exist:

1. Go to **Table Editor** in Supabase
2. You should see both `forms` and `form_responses` tables
3. Check that the columns match the schema above

## Troubleshooting

If you get permission errors:
- Make sure RLS policies are set correctly
- Check that your Supabase project has the correct API keys
- Verify that the `anon` and `authenticated` roles have the necessary permissions
