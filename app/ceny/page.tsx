import Hero from '../components/mainPage/Hero/Hero';
import Services from '../components/mainPage/Services/Services';
// import Price from '../components/mainPage/Price/Price';
import Form from '../components/mainPage/Form/Form';
import Gallery from '../components/mainPage/Gallery/Gallery';
import Contacts from '../components/mainPage/Contacts/Contacts';
import AnchorHandler from '../components/mainPage/AnchorHandler';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Цены на эвакуатор в Кемерово - Круглосуточно | Быстро и Недорого',
  description:
    'Цены на эвакуатор в Кемерово круглосуточно. Быстрая эвакуация автомобилей, мотоциклов и спецтехники. Приедем в течение 20 минут. Низкие цены, профессиональный сервис. Звоните: +7(923)480-70-70',
  openGraph: {
    title: 'Цены на эвакуатор в Кемерово - Круглосуточно | Быстро и Недорого',
    description:
      'Цены на круглосуточные услуги эвакуации автомобилей в Кемерово. Быстро, недорого, профессионально. Приедем в течение 20 минут.',
  },
};

export default function PricesPage() {
  return (
    <>
      <AnchorHandler />
      <Hero />
      <Services />
      {/* <Price /> */}
      <Form />
      <Gallery />
      <Contacts />
    </>
  );
}

