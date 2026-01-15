'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Portfolio.module.scss';

const portfolioImages = [
  '/images/Gallery/1.png',
  '/images/Gallery/2.png',
  '/images/Gallery/3.png',
  '/images/Gallery/4.png',
  '/images/Gallery/5.png',
  '/images/Gallery/6.png',
];

export default function Portfolio() {
  return (
    <div className={styles.portfolio}>
      <div className={styles.container}>
        <h1>Наши работы</h1>
        <p className={styles.subtitle}>
          Посмотрите примеры наших работ по эвакуации автомобилей
        </p>

        {portfolioImages.length > 0 ? (
          <div className={styles.grid}>
            {portfolioImages.map((src, index) => (
              <div
                key={index}
                className={styles.item}
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>Фотографии будут добавлены в ближайшее время</p>
          </div>
        )}

        <div className={styles.back_button}>
          <Link className={styles.CTA_button} href='/'>
            <span className={styles.button_icon} aria-hidden='true'>
              <Image
                src={'/icons/arrow-white.svg'}
                className={styles.button_arrow}
                height={40}
                width={40}
                alt='arrow'
              />
            </span>
            <span className={styles.button_text}>Вернуться на сайт</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
