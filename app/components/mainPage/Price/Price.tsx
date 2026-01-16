'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './Price.module.scss';

export type SliderCardProps = {
  src: string;
  title: string;
  subtitle: string;
  price: string;
};

export const prices: SliderCardProps[] = [
  {
    src: '/images/Prices/1.jpg',
    title: 'Крытый эвакуатор по России 1',
    subtitle:
      'Перевозка автомобилей внутри закрытой платформы безопасно и аккуратно',
    price: '99 999',
  },
  {
    src: '/images/Prices/1.jpg',
    title: 'Крытый эвакуатор по России 2',
    subtitle:
      'Перевозка автомобилей внутри закрытой платформы безопасно и аккуратно',
    price: '99 999',
  },
  {
    src: '/images/Prices/1.jpg',
    title: 'Крытый эвакуатор по России 3',
    subtitle:
      'Перевозка автомобилей внутри закрытой платформы безопасно и аккуратно',
    price: '99 999',
  },
  {
    src: '/images/Prices/1.jpg',
    title: 'Крытый эвакуатор по России 4',
    subtitle:
      'Перевозка автомобилей внутри закрытой платформы безопасно и аккуратно',
    price: '99 999',
  },
  {
    src: '/images/Prices/1.jpg',
    title: 'Крытый эвакуатор по России 5',
    subtitle:
      'Перевозка автомобилей внутри закрытой платформы безопасно и аккуратно',
    price: '99 999',
  },
  {
    src: '/images/Prices/1.jpg',
    title: 'Крытый эвакуатор по России 6 ',
    subtitle:
      'Перевозка автомобилей внутри закрытой платформы безопасно и аккуратно',
    price: '99 999',
  },
  {
    src: '/images/Prices/1.jpg',
    title: 'Крытый эвакуатор по России 7',
    subtitle:
      'Перевозка автомобилей внутри закрытой платформы безопасно и аккуратно',
    price: '99 999',
  },
];

export function SliderCard({ src, title, subtitle, price }: SliderCardProps) {
  return (
    <a
      className={styles.prices_card}
      style={{ backgroundImage: `url(${src})` }}
      href='tel:+79234807070'
    >
      <div className={styles.text_block}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.bottomRow}>
        <p className={styles.priceValue}>от {price} ₽</p>
        <span className={styles.CTA_button}>
          <span className={styles.button_icon} aria-hidden='true'>
            <Image
              src={'/icons/arrow-E1.svg'}
              className={styles.button_arrow}
              height={40}
              width={40}
              alt='arrow'
            />
          </span>
          <span className={styles.button_text}>Позвонить</span>
        </span>
      </div>
    </a>
  );
}

export default function Price() {
  const [dynamicMainBullets, setDynamicMainBullets] = useState(5);

  useEffect(() => {
    const updateBullets = () => {
      if (window.innerWidth <= 480) {
        setDynamicMainBullets(3);
      } else if (window.innerWidth <= 768) {
        setDynamicMainBullets(4);
      } else {
        setDynamicMainBullets(5);
      }
    };

    updateBullets();
    window.addEventListener('resize', updateBullets);
    return () => window.removeEventListener('resize', updateBullets);
  }, []);

  return (
    <section id='price' className='container'>
      <h2>Под любые задачи</h2>

      <div className={styles.sliderViewport}>
        <Swiper
          modules={[Navigation, Pagination]}
          className={styles.mySwiper}
          spaceBetween={15}
          slidesPerView='auto'
          pagination={{
            clickable: true,
            dynamicBullets: true, // ✅ "умная" пагинация (не показывает все точки)
            dynamicMainBullets: dynamicMainBullets, // адаптивное количество видимых точек
          }}
          breakpoints={{
            320: {
              slidesPerView: 1.1,
              spaceBetween: 15,
            },
            480: {
              slidesPerView: 1.2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2.1,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1600: {
              slidesPerView: 4.5,
              spaceBetween: 20,
            },
          }}
          onInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {prices.map((card) => (
            <SwiperSlide key={card.title}>
              <SliderCard
                src={card.src}
                title={card.title}
                subtitle={card.subtitle}
                price={card.price}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
