import { redirect } from 'next/navigation';

export default function Home() {
  // Перенаправляем с главной страницы на страницу чата
  redirect('/chat');
}
