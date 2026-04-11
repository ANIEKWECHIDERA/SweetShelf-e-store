import { MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { getWhatsAppHref } from "@sweetshelf/shared-types";
import { CartStoreSync } from "@/components/cart-store-sync";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const serif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SweetShelf Storefront",
  description: "Boutique pastry storefront built for SweetShelf.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="h-screen overflow-hidden bg-[var(--color-cream)] font-sans text-[var(--color-brown-800)]">
        <div className="flex h-full flex-col">
          <CartStoreSync />
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </div>
          <a
            href={getWhatsAppHref("Hi, I'd like to make a custom order")}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 right-4 inline-flex min-h-10 min-w-10 size-12 items-center justify-center rounded-full bg-[var(--color-caramel-400)] text-white shadow-[0_18px_40px_rgba(224,153,58,0.4)] sm:bottom-5 sm:right-5 sm:size-13 lg:bottom-6 lg:right-6 lg:size-14"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="size-6" />
          </a>
        </div>
      </body>
    </html>
  );
}
