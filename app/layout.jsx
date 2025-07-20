import './globals.css';
import { Inter } from 'next/font/google';
import ThemeProvider from '../components/theme-provider';
import { Toaster } from '../components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'StepSync - Track Your Steps',
  description: 'A beautiful step tracking application to monitor your daily activity',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}