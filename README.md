# 📒 전화번호부 (Next.js + Supabase + Vercel)

연락처(이름, 전화번호, 이메일, 메모, 즐겨찾기)를 추가·검색·수정·삭제하는 웹사이트입니다.

## 1. Supabase 설정

1. https://supabase.com 에서 새 프로젝트를 만듭니다.
2. 왼쪽 메뉴 **SQL Editor** 에서 `supabase/schema.sql` 내용을 붙여 넣고 실행합니다.
3. **Project Settings → API** 에서 `Project URL` 과 `anon public` 키를 복사합니다.

## 2. 로컬 실행

```bash
npm install
# .env.local 파일을 열어 Supabase URL 과 anon 키를 입력합니다
npm run dev                    # http://localhost:3000
```

## 3. Vercel 배포

1. 이 폴더를 GitHub 저장소에 올립니다.
2. https://vercel.com 에서 **Add New → Project** 로 저장소를 가져옵니다.
3. **Environment Variables** 에 아래 두 값을 추가합니다.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy** 를 누르면 끝입니다.

CLI 로 하려면:

```bash
npm i -g vercel
vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

## 구조

```
app/
  page.tsx                    메인 페이지
  api/contacts/route.ts       GET(목록·검색), POST(추가)
  api/contacts/[id]/route.ts  PATCH(수정), DELETE(삭제)
components/
  ContactManager.tsx          상태 관리 + 검색 + 목록
  ContactForm.tsx             추가/수정 폼
  ContactItem.tsx             연락처 한 줄 (즐겨찾기, 복사, 수정, 삭제)
lib/
  supabase.ts                 Supabase 클라이언트
  phone.ts                    전화번호 포맷/검증
supabase/schema.sql           테이블·RLS 정책
```

## 참고

- 현재는 로그인 없이 누구나 사용할 수 있도록 RLS 정책이 `anon` 전체 허용입니다.
  개인용으로만 쓰거나, Supabase Auth 를 붙여 `auth.uid()` 기준 정책으로 바꾸는 것을 권장합니다.
