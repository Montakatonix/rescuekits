// src/lib/supabase.ts — server-only admin client (service role).
// The browser NEVER talks to Supabase directly in this app.
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("Supabase env vars are not set");

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const DELIVERABLES_BUCKET = "deliverables";
