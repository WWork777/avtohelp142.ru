'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.scss';

export default function Header() {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const pathname = usePathname();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);

      // Проверяем, прошли ли мы Hero секцию
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        const heroBottom = heroElement.offsetTop + heroElement.offsetHeight;
        setIsPastHero(scrollTop > heroBottom - 100);
      }
    };

    // Вызываем сразу для начального состояния
    handleScroll();

    window.addEventListener('scroll', handleScroll);

    // Очистка при размонтировании
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);

      // Если мы не на главной странице, переходим на главную с якорем
      if (pathname !== '/') {
        window.location.href = `/${href}`;
        setMenuOpen(false);
        return;
      }

      // Если мы на главной странице, скроллим к элементу
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = 100; // Высота хедера
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }

      setMenuOpen(false);
    }
  };

  return (
    <header
      className={`${styles.header} ${
        isScrolled && !menuOpen ? styles.scrolled : ''
      } ${isPastHero ? styles.pastHero : ''} ${
        menuOpen ? styles.menuOpen : ''
      }`}
    >
      {/* Остальной код без изменений */}
      <div>
        <div className={styles.inner}>
          {/* <Link href='/' className={styles.logo}>
            <Image src='/images/logo.png' alt='Логотип' width={80} height={80} priority />
          </Link> */}

          {/* Навигация desktop */}
          <div className={styles.right_side}>
            <nav className={styles.nav}>
              <Link href='/#form' onClick={(e) => handleLinkClick(e, '#form')}>
                Услуги эвакуатора
              </Link>
              <Link
                href='/#price'
                onClick={(e) => handleLinkClick(e, '#price')}
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
            </nav>

            {/* Контакты и кнопка */}
            <div className={styles.socials}>
              <a
                href='https://t.me/+yicmz5BqXSM4MzRi'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.socialBtn}
              >
                <span className={styles.iconWrap}>
                  <Image
                    src='/icons/tg.svg'
                    alt='Telegram'
                    width={42}
                    height={42}
                  />
                </span>
                <span className={styles.text}>Telegram</span>
              </a>

              <div className={styles.socialBtn}>
                <span className={styles.iconWrap}>
                  <Image
                    src='/icons/max.svg'
                    alt='MAX'
                    width={42}
                    height={42}
                  />
                </span>
                <span className={styles.text}>MAX</span>
              </div>
            </div>
          </div>

          <button
            className={styles.burger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {/* Мобильное меню */}
      <div
        className={`${styles.mobileMenuOverlay} ${
          menuOpen ? styles.mobileMenuOverlayActive : ''
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`${styles.mobileMenu} ${
            menuOpen ? styles.mobileMenuActive : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* <Link
            href='/'
            onClick={() => setMenuOpen(false)}
            className={styles.mobile_logo_container}
          >
            <Image
              src='/images/logo.png'
              alt='Логотип'
              width={80}
              height={80}
              className={styles.mobile_logo}
            />
          </Link> */}
          <nav>
            <Link href='/#form' onClick={(e) => handleLinkClick(e, '#form')}>
              Услуги эвакуатора
            </Link>
            <Link href='/#price' onClick={(e) => handleLinkClick(e, '#price')}>
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
          </nav>
          <div className={styles.mobileContacts}>
            <Link href={`tel:${phone}`}>
              <span>{phone}</span>
            </Link>
            <div className={styles.socials}>
              <a
                href='https://t.me/+yicmz5BqXSM4MzRi'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Image
                  src='/icons/tg.svg'
                  alt='Telegram'
                  width={24}
                  height={24}
                />
              </a>
              <div>
                <Image src='/icons/max.svg' alt='MAX' width={24} height={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
