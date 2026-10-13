"use client";

import { useCallback, useEffect, useState } from "react";
import type { Contact, ContactInput } from "@/lib/types";
import ContactForm from "./ContactForm";
import ContactItem from "./ContactItem";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "요청에 실패했습니다.");
  return data as T;
}

export default function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<Contact[]>(
        "/api/contacts" + (q ? "?q=" + encodeURIComponent(q) : "")
      );
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "불러오기에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 검색어 디바운스
  useEffect(() => {
    const t = setTimeout(() => load(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query, load]);

  async function handleCreate(input: ContactInput) {
    const created = await api<Contact>("/api/contacts", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setContacts((prev) => sort([created, ...prev]));
    setShowForm(false);
  }

  async function handleUpdate(id: string, input: Partial<ContactInput>) {
    const updated = await api<Contact>("/api/contacts/" + id, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
    setContacts((prev) => sort(prev.map((c) => (c.id === id ? updated : c))));
  }

  async function handleDelete(id: string) {
    await api<void>("/api/contacts/" + id, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="이름, 번호, 이메일, 메모로 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "닫기" : "+ 추가"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <ContactForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="py-8 text-center text-sm text-slate-400">불러오는 중...</p>
      ) : contacts.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          {query ? "검색 결과가 없습니다." : "아직 연락처가 없습니다. 추가해 보세요."}
        </p>
      ) : (
        <>
          <p className="text-xs text-slate-400">{contacts.length}개의 연락처</p>
          <ul className="space-y-2">
            {contacts.map((c) => (
              <ContactItem
                key={c.id}
                contact={c}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function sort(list: Contact[]): Contact[] {
  return [...list].sort((a, b) => {
    if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;
    return a.name.localeCompare(b.name, "ko");
  });
}
