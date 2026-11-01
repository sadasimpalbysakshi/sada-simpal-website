import { createClient } from "@supabase/supabase-js";

// Sada Simpal's own Supabase project (company account).
//
// The URL and the "publishable" key are DESIGNED to be public — they ship to
// every visitor's browser. What protects your data is Row Level Security
// (see supabase/schema.sql), not hiding these two values.
//
// NEVER put the "secret" / service_role key in this project.
//
// You can override both with a .env.local file (see .env.example).
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? "https://nxvhlqnjfhasknfmxegu.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "sb_publishable_KYd0VNMPqQc_YpclSKNRig_JvGHXKbW";

export const supabase = createClient(supabaseUrl, supabaseKey);
