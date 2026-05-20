import '@/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
