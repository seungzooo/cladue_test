import ContactManager from "@/components/ContactManager";
import SetupGuide from "@/components/SetupGuide";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">📒 전화번호부</h1>
        <p className="mt-1 text-sm text-slate-500">
          연락처를 추가하고, 검색하고, 수정하거나 삭제할 수 있습니다.
        </p>
      </header>
      {isSupabaseConfigured ? <ContactManager /> : <SetupGuide />}
    </main>
  );
}
