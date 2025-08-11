import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Formatar Label API",
  description: "API multitenant para converter labels em IDs do ClickUp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}


