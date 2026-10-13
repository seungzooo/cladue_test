import { NextResponse } from "next/server";
import { getSupabase, NOT_CONFIGURED_MESSAGE } from "@/lib/supabase";
import { isValidPhone } from "@/lib/phone";

export async function GET(req: Request) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 503 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  let query = supabase
    .from("contacts")
    .select("*")
    .order("is_favorite", { ascending: false })
    .order("name", { ascending: true });

  if (q) {
    const digits = q.replace(/\D/g, "");
    const parts = [`name.ilike.%${q}%`, `email.ilike.%${q}%`, `memo.ilike.%${q}%`];
    if (digits) parts.push(`phone.ilike.%${digits}%`);
    query = query.or(parts.join(","));
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 503 });

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").replace(/\D/g, "");

  if (!name) return NextResponse.json({ error: "이름을 입력하세요." }, { status: 400 });
  if (!isValidPhone(phone))
    return NextResponse.json({ error: "전화번호 형식이 올바르지 않습니다." }, { status: 400 });

  const { data, error } = await supabase
    .from("contacts")
    .insert({
      name,
      phone,
      email: body.email?.trim() || null,
      memo: body.memo?.trim() || null,
      is_favorite: Boolean(body.is_favorite),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
