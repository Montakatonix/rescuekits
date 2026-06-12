// src/lib/supabase.ts — server-only admin client.
// The browser NEVER talks to Supabase directly in this app.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function createSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Supabase env vars are not set");

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!client) client = createSupabaseAdmin();
  return client;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseAdmin() as unknown as object, prop, receiver);
  },
});

export const DELIVERABLES_BUCKET = "deliverables";
