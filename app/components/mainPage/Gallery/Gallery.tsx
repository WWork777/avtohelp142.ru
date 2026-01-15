import Image from 'next/image';
import Link from 'next/link';
import styles from './Gallery.module.scss';

const images = [
  '/images/Gallery/1.png',
  '/images/Gallery/2.png',
  '/images/Gallery/3.png',
  '/images/Gallery/4.png',
  '/images/Gallery/5.png',
  '/images/Gallery/6.png',
];

export default function Gallery() {
  return (
    <section id='gallery' className='container'>
      <h2>Работа компании — с нами безопасно</h2>

      <div className={styles.grid}>
        {images.map((src, index) => (
          <div
            key={index}
            className={styles.item}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      <div className={styles.bottom_gallery}>
        <Link className={styles.CTA_button} href='/portfolio'>
          <span className={styles.button_icon} aria-hidden='true'>
            <Image
              src={'/icons/arrow-white.svg'}
              className={styles.button_arrow}
              height={40}
              width={40}
              alt='arrow'
            />
          </span>
          <span className={styles.button_text}>Больше работ</span>
        </Link>
      </div>
    </section>
  );
}
