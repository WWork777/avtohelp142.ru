'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.scss';

export default function Header() {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+7(923)480-70-70';
  const address = 'г.Кемерово, пр-кт Кузнецкий, 83/2';
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
      if (pathname !== '/' && pathname !== '/цены' && pathname !== '/ceny') {
        window.location.href = `/${href}`;
        setMenuOpen(false);
        return;
      }

      // Если мы на главной странице или странице цен, скроллим к элементу
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

  const handlePricesLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    const targetId = 'form';
    
    // Если мы не на странице цен, переходим на неё с якорем
    if (pathname !== '/цены' && pathname !== '/ceny') {
      window.location.href = '/цены/#form';
      setMenuOpen(false);
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
    
    setMenuOpen(false);
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
          {/* Логотип с текстом - виден на мобильных */}
          <Link href='/' className={styles.mobile_logo_header}>
            {/* <Image src='/images/logo.png' alt='Логотип' width={50} height={50} priority /> */}
            <div className={styles.mobile_logo_text}>
              <p>Эвакуатор</p>
              <p>в Кемерово</p>
            </div>
          </Link>

          {/* Навигация desktop */}
          <div className={styles.right_side}>
            <nav className={styles.nav}>
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
            </nav>

            {/* Контакты и кнопка */}
            <div className={styles.socials}>
              <a
                href='https://t.me/avtohelp142'
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

              <a
                href='tel:+79236369895'
                className={styles.socialBtn}
              >
                <span className={styles.iconWrap}>
                  <Image
                    src='/icons/max.svg'
                    alt='MAX'
                    width={42}
                    height={42}
                  />
                </span>
                <span className={styles.text}>MAX</span>
              </a>
            </div>
          </div>

          {/* Мобильные социальные сети - по центру */}
          <div className={styles.mobile_socials}>
            <a
              href='https://t.me/avtohelp142'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.mobile_social_icon}
            >
              <Image
                src='/icons/tg.svg'
                alt='Telegram'
                width={28}
                height={28}
              />
            </a>
            <a
              href='tel:+79236369895'
              className={styles.mobile_social_icon}
            >
              <Image
                src='/icons/max.svg'
                alt='MAX'
                width={28}
                height={28}
              />
            </a>
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
            <Link href='/цены/#form' onClick={handlePricesLinkClick}>
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
            <Link href={`tel:${phone}`} className={styles.mobilePhone}>
              <span>{phone}</span>
            </Link>
            <div className={styles.mobileAddress}>
              <span>{address}</span>
            </div>
            <div className={styles.socials}>
              <a
                href='https://t.me/avtohelp142'
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
              <a href='tel:+79236369895'>
                <Image src='/icons/max.svg' alt='MAX' width={24} height={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
