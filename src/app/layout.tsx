import "./globals.css";

import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { Toaster } from "sonner";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "SmartDocs AI - Automated Code Documentation",
  description:
    "Generate beautiful, accurate documentation for your code using AI. Support for JavaScript, TypeScript, Python, and more.",
  keywords: ["documentation", "AI", "code", "automation", "developer tools"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "SmartDocs AI",
    description: "AI-powered code documentation generator",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartDocs AI",
    description: "AI-powered code documentation generator",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${roboto_mono.variable} antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
