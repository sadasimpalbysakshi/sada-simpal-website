import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pfswquqnptcnmtzehzon.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmc3dxdXFucHRjbm10emVoem9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NDQwNjYsImV4cCI6MjA4NTAyMDA2Nn0.YMBlebSlYAUPo1YcZTD3-gsoc100-U9J2m0ehCH78AE";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
