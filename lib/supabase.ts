import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** 환경변수가 모두 설정되어 있는지 여부 */
export const isSupabaseConfigured =
  Boolean(url && anonKey) && !url!.includes("xxxxxxxxxxxx");

let client: SupabaseClient | null = null;

/** Supabase 클라이언트를 반환합니다. 환경변수가 없으면 null 을 반환합니다. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) client = createClient(url!, anonKey!);
  return client;
}

export const NOT_CONFIGURED_MESSAGE =
  "Supabase 환경변수가 설정되지 않았습니다. .env.local 에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 를 입력하세요.";
