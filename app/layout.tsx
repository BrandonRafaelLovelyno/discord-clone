import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/provider/session-provider";
import { getServerSession } from "next-auth";
import AnimatePresence from "@/components/animate-presence";
import options from "@/lib/auth/option";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { cn } from "@/lib/utils";
import { ThemeToggler } from "@/components/theme-toggler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={cn(
            inter.className,
            "dark:bg-slate-900 light:bg-whtie",
            "flex flex-col"
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <AnimatePresence>
              <ThemeToggler />
              {children}
            </AnimatePresence>
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
