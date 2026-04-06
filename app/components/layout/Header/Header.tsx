'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.scss';

declare global {
  interface Window {
    ym?: (counterId: number, command: string, goalId: string, options?: any) => void;
  }
}

const sendYandexGoal = (goalId: string) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(106319272, 'reachGoal', goalId);
  }
};

// Универсальная функция для плавного скролла к якорю
const scrollToAnchor = (targetId: string) => {
  // Пробуем несколько раз с интервалом, на случай если элемент ещё не отрендерился
  let attempts = 0;
  const maxAttempts = 10;
  
  const tryScroll = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerHeight = 100;
      const targetPosition = targetElement.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
      return true;
    }
    
    attempts++;
    if (attempts < maxAttempts) {
      setTimeout(tryScroll, 100);
    }
    return false;
  };
  
  tryScroll();
};

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
    // Обработка хэша при загрузке страницы и изменении pathname
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const targetId = hash.substring(1);
        // Небольшая задержка чтобы контент точно отрендерился
        setTimeout(() => {
          scrollToAnchor(targetId);
        }, 300);
      }
    };

    // Вызываем при монтировании и при изменении pathname
    handleHash();
    
    // Слушаем изменения hash в URL
    window.addEventListener('hashchange', handleHash);
    
    return () => {
      window.removeEventListener('hashchange', handleHash);
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);

      const heroElement = document.getElementById('hero');
      if (heroElement) {
        const heroBottom = heroElement.offsetTop + heroElement.offsetHeight;
        setIsPastHero(scrollTop > heroBottom - 100);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

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

  // Универсальный обработчик для якорных ссылок
  const handleAnchorLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.includes('#')) return;
    
    e.preventDefault();
    const hashIndex = href.indexOf('#');
    const targetId = href.substring(hashIndex + 1);
    setMenuOpen(false);

    // Если мы не на главной — переходим на главную с якорем
    if (pathname !== '/') {
      router.push(`/#${targetId}`, { scroll: false });
      setTimeout(() => scrollToAnchor(targetId), 300);
      return;
    }

    // Если уже на главной — просто скроллим
    scrollToAnchor(targetId);
    // Обновляем URL без перезагрузки
    window.history.pushState(null, '', `/#${targetId}`);
  };

  return (
    <header
      className={`${styles.header} ${
        isScrolled && !menuOpen ? styles.scrolled : ''
      } ${isPastHero ? styles.pastHero : ''} ${
        menuOpen ? styles.menuOpen : ''
      }`}
    >
      <div>
        <div className={styles.inner}>
          <Link href='/' className={styles.mobile_logo_header}>
            <Image src='/images/garagelogo.svg' alt='Логотип' width={140} height={70} priority />
          </Link>

          <div className={styles.right_side}>
            <nav className={styles.nav}>
              <Link href='/#form' onClick={(e) => handleAnchorLink(e, '/#form')}>
                Услуги эвакуатора
              </Link>
              <Link href='/#form' onClick={(e) => handleAnchorLink(e, '/#form')}>
                Цены
              </Link>
              {/* <Link href='/#gallery' onClick={(e) => handleAnchorLink(e, '/#gallery')}>
                Портфолио
              </Link> */}
              <Link href='/#contacts' onClick={(e) => handleAnchorLink(e, '/#contacts')}>
                Контакты
              </Link>
              <Link 
              href={`tel:${phone}`} 
              className={styles.mobilePhone}
              onClick={() => sendYandexGoal('telephone')}
            >
              <span>{phone}</span>
            </Link>

            </nav>

            <div className={styles.socials}>
              <a
                href='https://t.me/avtohelp142'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.socialBtn}
                onClick={() => sendYandexGoal('telegram')}
              >
                <span className={styles.iconWrap}>
                  <Image src='/icons/tg.svg' alt='Telegram' width={42} height={42} />
                </span>
                <span className={styles.text}>Telegram</span>
              </a>

              <a
                href='https://max.ru/u/f9LHodD0cOJKIJtCLzt9R39PdOR-MG1fi9sdMh9cEZzuXB-ca-EqbrqgtN4'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.socialBtn}
                onClick={() => sendYandexGoal('max')}
              >
                <span className={styles.iconWrap}>
                  <Image src='/icons/max.svg' alt='MAX' width={42} height={42} />
                </span>
                <span className={styles.text}>MAX</span>
              </a>
            </div>
          </div>

          <div className={styles.mobile_socials}>

            <Link 
              href={`tel:${phone}`} 
              className={styles.mobilePhone1}
              onClick={() => sendYandexGoal('telephone')}
            >
              <span>{phone}</span>
            </Link>
            {/* <a
              href='https://t.me/avtohelp142'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.mobile_social_icon}
              onClick={() => sendYandexGoal('telegram')}
            >
              <Image src='/icons/tg.svg' alt='Telegram' width={28} height={28} />
            </a>
            <a
              href='https://max.ru/u/f9LHodD0cOJKIJtCLzt9R39PdOR-MG1fi9sdMh9cEZzuXB-ca-EqbrqgtN4'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.mobile_social_icon}
              onClick={() => sendYandexGoal('max')}
            >
              <Image src='/icons/max.svg' alt='MAX' width={28} height={28} />
            </a> */}
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
          <Link
            href='/'
            onClick={() => setMenuOpen(false)}
            className={styles.mobile_logo_container}
          >
            <Image
              src='/images/garagelogo.svg'
              alt='Логотип'
              width={120}
              height={120}
              className={styles.mobile_logo}
            />
          </Link>
          <nav>
            <Link href='/#form' onClick={(e) => handleAnchorLink(e, '/#form')}>
              Услуги эвакуатора
            </Link>
            <Link href='/#form' onClick={(e) => handleAnchorLink(e, '/#form')}>
              Цены
            </Link>
            <Link href='/#gallery' onClick={(e) => handleAnchorLink(e, '/#gallery')}>
              Портфолио
            </Link>
            <Link href='/#contacts' onClick={(e) => handleAnchorLink(e, '/#contacts')}>
              Контакты
            </Link>
            <Link href='/#blog' onClick={(e) => handleAnchorLink(e, '/#blog')}>
              Блог
            </Link>
            <Link href='/#services' onClick={(e) => handleAnchorLink(e, '/#services')}>
              О нас
            </Link>
            <Link href='/#contacts' onClick={(e) => handleAnchorLink(e, '/#contacts')}>
              Тех помощь
            </Link>
          </nav>
          <div className={styles.mobileContacts}>
            <Link 
              href={`tel:${phone}`} 
              className={styles.mobilePhone}
              onClick={() => sendYandexGoal('telephone')}
            >
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
                onClick={() => sendYandexGoal('telegram')}
              >
                <Image src='/icons/tg.svg' alt='Telegram' width={24} height={24} />
              </a>
              <a
                href='https://max.ru/u/f9LHodD0cOJKIJtCLzt9R39PdOR-MG1fi9sdMh9cEZzuXB-ca-EqbrqgtN4'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => sendYandexGoal('max')}
              >
                <Image src='/icons/max.svg' alt='MAX' width={24} height={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}