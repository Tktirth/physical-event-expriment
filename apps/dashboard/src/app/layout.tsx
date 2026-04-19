import type { Metadata } from 'next';
import './globals.css';
import DashboardLayoutWrapper from './components/DashboardLayoutWrapper';

export const metadata: Metadata = {
  title: 'OmniFlow | Stadium Command Center',
  description: 'AI-Powered Event Experience & Crowd Intelligence Platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DashboardLayoutWrapper>
          {children}
        </DashboardLayoutWrapper>
      </body>
    </html>
  );
}
