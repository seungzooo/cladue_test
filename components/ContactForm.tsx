"use client";

import { useState } from "react";
import type { Contact, ContactInput } from "@/lib/types";
import { formatPhone, isValidPhone } from "@/lib/phone";

type Props = {
  initial?: Contact;
  onSubmit: (input: ContactInput) => Promise<void>;
  onCancel?: () => void;
};

export default function ContactForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial ? formatPhone(initial.phone) : "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [memo, setMemo] = useState(initial?.memo ?? "");
  const [favorite, setFavorite] = useState(initial?.is_favorite ?? false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("이름을 입력하세요.");
    if (!isValidPhone(phone)) return setError("전화번호를 확인하세요. (9~11자리)");

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        phone: phone.replace(/\D/g, ""),
        email: email.trim() || null,
        memo: memo.trim() || null,
        is_favorite: favorite,
      });
      if (!initial) {
        setName("");
        setPhone("");
        setEmail("");
        setMemo("");
        setFavorite(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  const input =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className={input}
          placeholder="이름 *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus={!initial}
        />
        <input
          className={input}
          placeholder="전화번호 *"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
        />
        <input
          className={input}
          placeholder="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={input}
          placeholder="메모"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
          />
          즐겨찾기
        </label>
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "저장 중..." : initial ? "수정 저장" : "추가"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
