export default function SetupGuide() {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
      <h2 className="mb-2 text-base font-semibold">⚙️ Supabase 연결이 필요합니다</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline">
            supabase.com
          </a>
          에서 프로젝트를 만들고, <b>SQL Editor</b>에서{" "}
          <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code> 을 실행합니다.
        </li>
        <li>
          <b>Project Settings → API</b> 에서 <b>Project URL</b> 과 <b>anon public</b> 키를 복사합니다.
        </li>
        <li>
          프로젝트 폴더의 <code className="rounded bg-amber-100 px-1">.env.local</code> 파일에 붙여 넣습니다.
          <pre className="mt-2 overflow-x-auto rounded bg-amber-100 p-3 text-xs">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...`}
          </pre>
        </li>
        <li>
          개발 서버를 다시 시작합니다. (<code className="rounded bg-amber-100 px-1">npm run dev</code>)
        </li>
      </ol>
      <p className="mt-3 text-xs text-amber-700">
        Vercel 에 배포할 때는 프로젝트의 Environment Variables 에 같은 두 값을 추가하세요.
      </p>
    </div>
  );
}
