import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Garden Calm - Медитации с AI-анализом эмоций',
  description: 'Приложение для медитаций с AI-коучем, который анализирует эмоциональное состояние пользователя через чат и рекомендует персонализированные медитации.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
