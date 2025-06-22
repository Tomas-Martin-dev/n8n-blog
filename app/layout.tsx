import type { Metadata } from "next";
import "./globals.css";
import Navigation from "../components/Navigation";
import { Providers } from "../components/Providers";

export const metadata: Metadata = {
  title: "Blog - N8N",
  description: "Blog posts from N8N",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
