-- Update RLS policy to allow public reading of form responses
-- This allows the admin dashboard to work without authentication
-- In production, you may want to add proper authentication

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow users to read form responses" ON form_responses;

-- Create new policy that allows public reading
CREATE POLICY "Allow public to read form responses"
ON form_responses
FOR SELECT
TO anon, authenticated
USING (true);
