import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "UserStory.ai — Convert PRDs to Sprint-Ready User Stories",
  description: "AI-powered tool that converts any PRD into INVEST-validated user stories with structured acceptance criteria, cross-cutting concerns, and story point estimates. Free and open source.",
  openGraph: {
    title: "UserStory.ai — PRD to User Stories in 60 Seconds",
    description: "Paste any PRD, get sprint-ready user stories with INVEST validation, accessibility, security, performance, and error handling built in.",
    type: "website",
    siteName: "UserStory.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "UserStory.ai — PRD to User Stories in 60 Seconds",
    description: "AI-powered tool that converts any PRD into sprint-ready user stories. Free and open source.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
