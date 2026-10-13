"use client";

import { useState } from "react";
import type { Contact, ContactInput } from "@/lib/types";
import { formatPhone } from "@/lib/phone";
import ContactForm from "./ContactForm";

type Props = {
  contact: Contact;
  onUpdate: (id: string, input: Partial<ContactInput>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function ContactItem({ contact, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (editing) {
    return (
      <li className="rounded-lg border border-blue-300 bg-white p-4 shadow-sm">
        <ContactForm
          initial={contact}
          onSubmit={async (input) => {
            await onUpdate(contact.id, input);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(formatPhone(contact.phone));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // 클립보드 접근 불가 시 무시
    }
  }

  async function handleDelete() {
    if (confirm(`"${contact.name}" 연락처를 삭제할까요?`)) {
      await onDelete(contact.id);
    }
  }

  return (
    <li className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <button
        onClick={() => onUpdate(contact.id, { is_favorite: !contact.is_favorite })}
        className="mt-0.5 text-xl leading-none"
        title={contact.is_favorite ? "즐겨찾기 해제" : "즐겨찾기"}
        aria-label="즐겨찾기 토글"
      >
        {contact.is_favorite ? (
          <span className="text-amber-400">★</span>
        ) : (
          <span className="text-slate-300">☆</span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-semibold">{contact.name}</span>
          <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
            {formatPhone(contact.phone)}
          </a>
          <button
            onClick={copyPhone}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            {copied ? "복사됨 ✓" : "복사"}
          </button>
        </div>
        {contact.email && (
          <p className="truncate text-sm text-slate-600">{contact.email}</p>
        )}
        {contact.memo && (
          <p className="mt-1 text-sm text-slate-500">{contact.memo}</p>
        )}
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => setEditing(true)}
          className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
        >
          수정
        </button>
        <button
          onClick={handleDelete}
          className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
        >
          삭제
        </button>
      </div>
    </li>
  );
}
