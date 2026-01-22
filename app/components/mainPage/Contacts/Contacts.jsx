'use client';

import styles from './Contacts.module.scss';
import './map-second.scss';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// Адреса филиалов с координатами
const offices = [
  {
    id: 'main',
    address: 'Кузнецкий проспект, 83/2',
    district: 'Заводский район',
    coordinates: [55.340886, 86.059988],
    isMain: true,
  },
  {
    id: 'branch1',
    address: 'Красная улица, 14',
    district: 'Центральный район',
    coordinates: [55.348539, 86.088213],
    isMain: false,
  },
  {
    id: 'branch2',
    address: 'Улица Дружбы, 30',
    district: 'Южный м-н, Заводский район',
    coordinates: [55.313163, 86.104077], 
    isMain: false,
  },
  {
    id: 'branch3',
    address: 'Проспект Химиков, 12',
    district: 'Ленинский район',
    coordinates: [55.339708, 86.162970], 
    isMain: false,
  },
  {
    id: 'branch4',
    address: 'Инициативная улица, 6',
    district: 'Кировский район',
    coordinates: [55.393211, 86.003708],
    isMain: false,
  },
];

// Вычисляем центр карты и зум для показа всех филиалов
function calculateMapBounds(coordinates) {
  const latitudes = coordinates.map((coord) => coord[0]);
  const longitudes = coordinates.map((coord) => coord[1]);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // Вычисляем примерный зум на основе размаха координат с запасом
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  // Добавляем запас (padding) для меток по краям
  const padding = 0.01;

  let zoom = 13; // Уменьшаем начальный зум, чтобы показать больше
  if (maxDiff + padding * 2 > 0.05) zoom = 11;
  else if (maxDiff + padding * 2 > 0.03) zoom = 12;
  else if (maxDiff + padding * 2 > 0.02) zoom = 13;
  else if (maxDiff + padding * 2 > 0.01) zoom = 14;
  else zoom = 15;

  return {
    center: [centerLat, centerLng],
    zoom: zoom,
  };
}

export default function YandexMap() {
  const [isMobile, setIsMobile] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const allCoordinates = offices.map((office) => office.coordinates);
  const mapBounds = calculateMapBounds(allCoordinates);
  const mainOffice = offices.find((office) => office.isMain);

  // Устанавливаем bounds после загрузки карты
  useEffect(() => {
    if (mapRef.current) {
      const timer = setTimeout(() => {
        const map = mapRef.current;
        if (map && typeof map.getBounds === 'function') {
          // Пытаемся установить bounds для показа всех меток
          try {
            const bounds = map.geoObjects.getBounds();
            if (bounds) {
              map.setBounds(bounds, {
                checkZoomRange: true,
                duration: 300,
                padding: [80, 80, 80, 80],
              });
            }
          } catch (e) {
            // Если не получилось, используем дефолтные значения
            console.log('Bounds setting failed, using default zoom');
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div id='contacts' className={styles.section_map}>
      <YMaps>
        <div className='ymaps'>
          <Map
            instanceRef={mapRef}
            className='map'
            defaultState={{
              center: mapBounds.center,
              zoom: isMobile ? Math.max(11, mapBounds.zoom - 1) : Math.max(12, mapBounds.zoom),
            }}
          >
            {offices.map((office) => (
              <Placemark
                key={office.id}
                geometry={office.coordinates}
                options={{
                  preset: office.isMain
                    ? 'islands#darkBlueDotIcon'
                    : 'islands#blueDotIcon',
                  iconColor: office.isMain ? '#1e88e5' : '#2196f3',
                }}
                properties={{
                  balloonContentBody: `<strong>${office.address}</strong><br/>${office.district}`,
                  balloonContentHeader: office.isMain
                    ? 'Основной офис'
                    : 'Филиал',
                }}
              />
            ))}
          </Map>
          <div
            className={`${styles.info_block} ${isMobile ? styles.mobile : ''}`}
          >
            <h2>Контакты</h2>

            <div className={styles.address_section}>
              <p className={styles.info_title}>Основной адрес:</p>
              <p className={styles.address_main}>
                г. Кемерово, {mainOffice?.address}, {mainOffice?.district}
              </p>
            </div>

            <div className={styles.branches_section}>
              <p className={styles.info_title}>Филиалы:</p>
              <ul className={styles.branches_list}>
                {offices
                  .filter((office) => !office.isMain)
                  .map((office) => (
                    <li key={office.id} className={styles.branch_item}>
                      <span className={styles.branch_address}>
                        {office.address}
                      </span>
                      <span className={styles.branch_district}>
                        {office.district}
                      </span>
                    </li>
                  ))}
              </ul>
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
              <a
                href='tel:+79236369895'
                className={styles.info_block_bottom_item}
              >
                <p>Max</p>
                <img src='/icons/max-blue.svg' alt='Email' />
              </a>
              <a
                href='https://t.me/avtohelp142'
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
