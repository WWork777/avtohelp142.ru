import Portfolio from './Portfolio';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Наши работы - Портфолио эвакуатора в Кемерово',
  description:
    'Посмотрите примеры наших работ по эвакуации автомобилей в Кемерово. Профессиональная эвакуация различных типов транспорта.',
  openGraph: {
    title: 'Наши работы - Портфолио эвакуатора в Кемерово',
    description:
      'Посмотрите примеры наших работ по эвакуации автомобилей в Кемерово. Профессиональная эвакуация различных типов транспорта.',
  },
};

export default function PortfolioPage() {
  return <Portfolio />;
}
