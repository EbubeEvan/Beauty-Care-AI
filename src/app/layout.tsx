import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/design-system/theme-provider";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";

const ClientProviders = dynamic(() => import("@/Providers/ClientProviders"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Beautycare AI",
    default: "Beautycare AI",
  },
  description: "An AI Beauty Specialist",
  metadataBase: new URL("https://beauty-care-ai.vercel.app/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProviders>{children}</ClientProviders>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
