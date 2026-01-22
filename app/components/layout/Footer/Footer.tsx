'use client';
import styles from './Footer.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Footer() {
  const email = 'evak-kemerovo@yandex.ru';
  const phone = '+7(923)480-70-70';
  const address = 'г.Кемерово, пр-кт Кузнецкий, 83/2';
  const addressLink = 'г.Кемерово, пр-кт Кузнецкий, 83/2';
  const pathname = usePathname();
  const router = useRouter();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);

      // Если мы не на главной странице или странице цен, переходим на главную с якорем
      if (pathname !== '/' && pathname !== '/цены' && pathname !== '/ceny') {
        window.location.href = `/${href}`;
        return;
      }

      // Если мы на главной странице или странице цен, скроллим к элементу
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = 100;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const handlePricesLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    const targetId = 'form';
    
    // Если мы не на странице цен, переходим на неё с якорем
    if (pathname !== '/цены' && pathname !== '/ceny') {
      window.location.href = '/цены/#form';
      return;
    }
    
    // Если мы уже на странице цен, просто скроллим к калькулятору
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerHeight = 100;
      const targetPosition = targetElement.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer style={{ backgroundColor: '#ffffff' }}>
      <div className={styles.footer}>
        <div className={styles.left_side}>
          <div className={styles.top}>
            {/* <Link href='/' className={styles.logo}>
              <Image src='/images/logo.png' alt='Логотип' width={110} height={110} priority />
            </Link> */}

            <div className={styles.nav}>
              <Link href='/#form' onClick={(e) => handleLinkClick(e, '#form')}>
                Услуги эвакуатора
              </Link>
              <Link
                href='/цены/#form'
                onClick={handlePricesLinkClick}
              >
                Цены
              </Link>
              <Link
                href='/#gallery'
                onClick={(e) => handleLinkClick(e, '#gallery')}
              >
                Портфолио
              </Link>
              <Link
                href='/#contacts'
                onClick={(e) => handleLinkClick(e, '#contacts')}
              >
                Контакты
              </Link>
              <Link href='/#blog' onClick={(e) => handleLinkClick(e, '#blog')}>
                Блог
              </Link>
              <Link
                href='/#services'
                onClick={(e) => handleLinkClick(e, '#services')}
              >
                О нас
              </Link>
              <Link
                href='/#contacts'
                onClick={(e) => handleLinkClick(e, '#contacts')}
              >
                Тех помощь
              </Link>
            </div>
          </div>

          <div className={styles.bottom}>
            <Link href='/#about'>Политика конфиденциальности</Link>
            <Link href='/#about'>Условия использования</Link>
          </div>
        </div>

        <div className={styles.right_side}>
          <div className={styles.links}>
            <a
              href='https://t.me/avtohelp142'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                className={styles.icon}
                src='/icons/tg-yellow.svg'
                alt='Telegram'
                width={42}
                height={42}
              />
            </a>
            <a href='tel:+79236369895'>
              <Image
                className={styles.icon}
                src='/icons/max-yellow.svg'
                alt='Max'
                width={42}
                height={42}
              />
            </a>
          </div>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={`tel:${phone}`}>{phone}</a>
          <a
            href={`https://yandex.ru/maps/?text=${encodeURIComponent(address)}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            {address}
          </a>
        </div>
      </div>
    </footer>
  );
}
