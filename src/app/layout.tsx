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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gold-coffee-beans.up.railway.app'),
  title: "GOLD COFFEE BEANS | Преміальні свіжообсмажені зерна Specialty",
  description:
    "Крафтова ростерія GOLD COFFEE BEANS. Високогірні мікролоти арабіки класу Specialty свіжого врожаю. Прямий імпорт з найкращих терруарів світу, оцінка 88+ SCA.",
  keywords: [
    "Gold Coffee Beans",
    "кава в зернах",
    "specialty coffee",
    "купити каву",
    "свіже обсмаження",
    "арабіка",
    "мікролоти",
    "Geisha coffee",
    "постачання кави для кав'ярень",
  ],
  authors: [{ name: "GOLD COFFEE BEANS & UTS" }],
  creator: "Useful Tech Solutions (UTS)",
  openGraph: {
    title: "GOLD COFFEE BEANS | Мистецтво досконалого зерна",
    description:
      "Преміальні свіжообсмажені мікролоти арабіки класу Specialty 88+ SCA. Каталог лімітованих сортів кави свіжого врожаю.",
    url: "https://gold-coffee-beans.up.railway.app",
    siteName: "GOLD COFFEE BEANS",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GOLD COFFEE BEANS — Преміальні свіжообсмажені зерна Specialty",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GOLD COFFEE BEANS | Мистецтво досконалого зерна",
    description:
      "Преміальні свіжообсмажені мікролоти арабіки класу Specialty 88+ SCA. Каталог лімітованих сортів кави свіжого врожаю.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
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
