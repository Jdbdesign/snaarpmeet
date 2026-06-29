import type { Metadata } from "next";
import { Anton, Barlow, Instrument_Serif } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Snaarpmeet — Meetings your team actually wants",
  description:
    "HD video, AI notes, screen sharing, and breakout rooms — all in your browser. No downloads. No friction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${anton.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
