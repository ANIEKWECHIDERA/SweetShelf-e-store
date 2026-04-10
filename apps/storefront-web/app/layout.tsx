import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
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
      <body className="min-h-full bg-[var(--color-cream)] font-sans text-[var(--color-brown-800)]">
        <div className="flex min-h-full flex-col">
          {children}
          <a
            href="https://wa.me/2348012345678?text=Hi%2C+I'd+like+to+enquire+about+a+custom+order"
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-6 right-6 inline-flex size-14 items-center justify-center rounded-full bg-[var(--color-caramel-400)] text-white shadow-lg"
          >
            WA
          </a>
        </div>
      </body>
    </html>
  );
}
