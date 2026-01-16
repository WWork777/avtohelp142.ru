'use client';

import styles from './Contacts.module.scss';
import './map-second.scss';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function YandexMap() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div id='contacts' className={styles.section_map}>
      <YMaps>
        <div className='ymaps'>
          <Map
            className='map'
            defaultState={{
              center: [55.340783, 86.061003],
              zoom: isMobile ? 14 : 17,
            }}
          >
            <Placemark
              geometry={[55.340783, 86.061003]}
              options={{ preset: 'islands#darkBlueDotIcon' }}
            />
          </Map>
          <div
            className={`${styles.info_block} ${isMobile ? styles.mobile : ''}`}
          >
            <h2>Контакты</h2>

            <div>
              <p className={styles.info_title}>Адрес:</p>
              <p>г.Кемерово, пр-кт Кузнецкий, 83, с. №2</p>
            </div>

            <div>
              <p className={styles.info_title}>Мы на связи</p>
              <Link href='mailto:evak-kemerovo@yandex.ru'>
                <p>evak-kemerovo@yandex.ru</p>
              </Link>
              <Link href='tel:+7(923)480-70-70'>
                <p>+7(923)480-70-70</p>
              </Link>
            </div>

            <div className={styles.info_block_bottom}>
              <div className={styles.info_block_bottom_item}>
                <p>Max</p>
                <img src='/icons/max-blue.svg' alt='Email' />
              </div>
              <a
                href='https://t.me/+yicmz5BqXSM4MzRi'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.info_block_bottom_item}
              >
                <p>Telegram</p>
                <img src='/icons/tg-blue.svg' alt='Telegram' />
              </a>
            </div>
          </div>
        </div>
      </YMaps>
    </div>
  );
}
