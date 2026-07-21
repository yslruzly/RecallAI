import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recall — Ask your notes anything",
  description:
    "Upload your study notes and get grounded answers — every reply comes only from what you uploaded, with sources to prove it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
