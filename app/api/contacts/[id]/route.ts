import { NextResponse } from "next/server";
import { getSupabase, NOT_CONFIGURED_MESSAGE } from "@/lib/supabase";
import { isValidPhone } from "@/lib/phone";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 503 });

  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return NextResponse.json({ error: "이름을 입력하세요." }, { status: 400 });
    update.name = name;
  }
  if (body.phone !== undefined) {
    const phone = String(body.phone).replace(/\D/g, "");
    if (!isValidPhone(phone))
      return NextResponse.json({ error: "전화번호 형식이 올바르지 않습니다." }, { status: 400 });
    update.phone = phone;
  }
  if (body.email !== undefined) update.email = body.email?.trim() || null;
  if (body.memo !== undefined) update.memo = body.memo?.trim() || null;
  if (body.is_favorite !== undefined) update.is_favorite = Boolean(body.is_favorite);

  const { data, error } = await supabase
    .from("contacts")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: Params) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: NOT_CONFIGURED_MESSAGE }, { status: 503 });

  const { id } = await params;
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
