import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChronoLens // Analytical Comparative Historiography Workstation",
  description: "Enterprise-grade isomorphic historical and geopolitical event comparison platform powered by Wikidata SPARQL and constrained Pydantic synthesis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-200 antialiased font-sans selection:bg-neutral-800 selection:text-neutral-100">
        {children}
      </body>
    </html>
  );
}

