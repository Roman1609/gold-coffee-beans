import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GOLD COFFEE BEANS | Преміальні свіжообсмажені кавові зерна Specialty",
  description: "Ексклюзивна колекція високогірної арабіки класу Specialty від Gold Coffee Beans. Пряме постачання та обсмаження свіжих партій.",
  keywords: ["Gold Coffee Beans", "кава в зернах", "specialty coffee", "купити каву", "свіже обсмаження", "арабіка", "постачання кави"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
