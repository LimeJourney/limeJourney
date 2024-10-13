import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { SubscriptionProvider } from "@/app/contexts/SubscriptionContext";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import "react-quill/dist/quill.snow.css";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
      >
        <SubscriptionProvider>{children}</SubscriptionProvider>
        <Toaster />
      </body>
    </html>
  );
}
