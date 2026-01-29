import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xlayiymdhgixsqtcivzq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYXlpeW1kaGdpeHNxdGNpdnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MTY4MzksImV4cCI6MjA4NTI5MjgzOX0.U-tijNKjpzJNZUnDGwFR6W2UmykPB3NkklDmhRXAb4c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
