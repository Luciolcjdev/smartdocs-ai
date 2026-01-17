import "./globals.css";

import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),

  title: "SmartDocs AI - Automated Code Documentation",
  description:
    "Generate beautiful, accurate documentation for your code using AI. Support for JavaScript, TypeScript, Python, and more.",

  keywords: ["documentation", "AI", "code", "automation", "developer tools"],
  authors: [{ name: "Your Name" }],

  openGraph: {
    title: "SmartDocs AI",
    description: "AI-powered code documentation generator",
    images: ["/og-image.png"], // agora vira URL absoluta automaticamente
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
