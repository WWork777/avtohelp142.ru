'use client';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Services.module.scss';

export interface ServiceCardProps {
  src: string;
  title: string;
  subtitle: string;
}

const services: ServiceCardProps[] = [
  {
    src: '/images/Services/1.jpg',
    title: 'легковые автомобили',
    subtitle: 'Быстрая и бережная эвакуация легковых автомобилей',
  },
  {
    src: '/images/Services/2.jpg',
    title: 'ДТП и сложные случаи',
    subtitle: 'Эвакуация автомобилей после ДТП и сложных ситуаций',
  },
  {
    src: '/images/Services/3.jpg',
    title: 'Коммерческий транспорт',
    subtitle: 'Перевозка микроавтобусов, фургонов и коммерческого транспорта',
  },
  {
    src: '/images/Services/4.jpg',
    title: 'Мотоциклы и спецтехника',
    subtitle: 'Эвакуация мотоциклов, квадроциклов и другой техники',
  },
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = '#form';

    // Если мы не на главной странице, переходим на главную с якорем
    if (pathname !== '/') {
      window.location.href = `/${targetId}`;
      return;
    }

    // Если мы на главной странице, скроллим к элементу
    const targetElement = document.getElementById('form');

    if (targetElement) {
      const headerHeight = 100; // Высота хедера
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id='services' className='container'>
      <div className={styles.services_header}>
        <h2>Услуги эвакуатора</h2>
        <Link
          href='/#form'
          className={styles.CTA_button}
          onClick={handleLinkClick}
        >
          <span className={styles.button_icon} aria-hidden='true'>
            <Image
              src={'/icons/arrow-white.svg'}
              className={styles.button_arrow}
              height={40}
              width={40}
              alt='arrow'
            />
          </span>
          <span className={styles.button_text}>Ознакомиться с ценами</span>
        </Link>
      </div>

      <div className={styles.services_Gallery}>
        {services.map((item, index) => (
          <a
            key={index}
            href='#'
            className={`${styles.card_body} ${
              activeIndex === index ? styles.active : ''
            }`}
            style={{ backgroundImage: `url(${item.src})` }}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <span className={styles.button_icon} aria-hidden='true'>
              <Image
                src={'/icons/arrow-white.svg'}
                className={styles.button_arrow}
                height={40}
                width={40}
                alt='arrow'
              />
            </span>

            <div className={styles.card_footer}>
              <h3 className={styles.card_title}>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
