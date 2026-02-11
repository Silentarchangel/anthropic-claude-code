import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supplier Reconciliation",
  description: "Compare supplier prices and fill order forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
