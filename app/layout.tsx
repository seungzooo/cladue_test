import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "전화번호부",
  description: "연락처를 관리하는 간단한 전화번호부",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
