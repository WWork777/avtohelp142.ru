import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.scss';

import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://evakuator-kemerovo.ru'), // Замените на ваш реальный домен
  title: {
    default: 'Эвакуатор в Кемерово - Круглосуточно | Быстро и Недорого',
    template: '%s | Эвакуатор в Кемерово',
  },
  description:
    'Эвакуатор в Кемерово круглосуточно. Быстрая эвакуация автомобилей, мотоциклов и спецтехники. Приедем в течение 20 минут. Низкие цены, профессиональный сервис. Звоните: +7(923)480-70-70',
  keywords: [
    'эвакуатор кемерово',
    'эвакуатор кемерово круглосуточно',
    'вызов эвакуатора кемерово',
    'эвакуация автомобилей кемерово',
    'эвакуатор недорого кемерово',
    'эвакуатор мотоциклов кемерово',
    'эвакуатор дтп кемерово',
    'эвакуатор коммерческий транспорт кемерово',
    'эвакуатор 24 часа кемерово',
    'быстрый эвакуатор кемерово',
  ],
  authors: [{ name: 'Эвакуатор в Кемерово' }],
  creator: 'Эвакуатор в Кемерово',
  publisher: 'Эвакуатор в Кемерово',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://evakuator-kemerovo.ru', // Замените на ваш реальный домен
    siteName: 'Эвакуатор в Кемерово',
    title: 'Эвакуатор в Кемерово - Круглосуточно | Быстро и Недорого',
    description:
      'Круглосуточные услуги эвакуации автомобилей в Кемерово. Быстро, недорого, профессионально. Приедем в течение 20 минут.',
    images: [
      // {
      //   url: '/images/logo.png', // Можно добавить специальное изображение для OG
      //   width: 1200,
      //   height: 630,
      //   alt: 'Эвакуатор в Кемерово',
      // },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Эвакуатор в Кемерово - Круглосуточно',
    description:
      'Круглосуточные услуги эвакуации автомобилей в Кемерово. Быстро, недорого, профессионально.',
    // images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Добавьте коды верификации для Яндекс и Google, если нужно
    // yandex: 'ваш_код_верификации',
    // google: 'ваш_код_верификации',
  },
  alternates: {
    canonical: 'https://evakuator-kemerovo.ru', // Замените на ваш реальный домен
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru'>
      <body className={`${montserrat.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
