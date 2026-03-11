import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ProjectHub - Manage Your Development Projects",
    template: "%s | ProjectHub",
  },
  description:
    "ProjectHub is a modern project manager for developers. Quickly access, manage, and open your development projects in VSCode, Cursor, or Terminal with a single click. All data stored locally on your computer.",
  keywords: [
    "project manager",
    "development tools",
    "code editor",
    "VSCode",
    "Cursor",
    "terminal",
    "developer productivity",
    "project management",
    "local storage",
    "privacy-focused",
  ],
  authors: [{ name: "ProjectHub Team" }],
  creator: "ProjectHub",
  publisher: "ProjectHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://projecthub.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "ProjectHub - Manage Your Development Projects",
    description:
      "Quickly access, manage, and open your development projects in VSCode, Cursor, or Terminal. All data stored locally on your computer.",
    siteName: "ProjectHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProjectHub - Manage Your Development Projects",
    description: "Quickly access, manage, and open your development projects in VSCode, Cursor, or Terminal.",
    creator: "@projecthub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  category: "developer tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
