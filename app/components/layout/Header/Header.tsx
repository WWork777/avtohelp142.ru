"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";

export default function Header() {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Фон появляется когда страница прокручена больше чем на 50px
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // Очистка при размонтировании
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  

  return (
    <header className={`${styles.header} ${ isScrolled && !menuOpen ? styles.scrolled : ""}`}>
        {/* Остальной код без изменений */}
        <div>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>
                    <Image
                    src="/images/logo.png"
                    alt="Логотип"
                    width={80}
                    height={80}
                    priority
                    />
                </Link>

                {/* Навигация desktop */}
                <div className={styles.right_side}>
                    <nav className={styles.nav}>
                        <Link href="/#about">Контакты</Link>
                        <Link href="/#about">Цены</Link>
                        <Link href="/#about">Портфолио</Link>
                        <Link href="/#about">Услуги эвакуатора</Link>
                        <Link href="/#about">Блог</Link>
                        <Link href="/#products">О нас</Link>
                        <Link href="/#services">Услуги</Link>
                        <Link href="/#contacts">Тех помощь</Link>
                    </nav>

                    {/* Контакты и кнопка */}
                    <div className={styles.socials}>
                        <Link
                            href="https://m.vk.com/tridsat_dva"
                            target="_blank"
                            className={styles.socialBtn}
                        >
                            <span className={styles.iconWrap}>
                            <Image
                                src="/icons/tg.svg"
                                alt="Telegram"
                                width={42}
                                height={42}
                            />
                            </span>
                            <span className={styles.text}>Telegram</span>
                        </Link>

                        <Link
                            href="https://wa.me/79029830005"
                            target="_blank"
                            className={styles.socialBtn}
                        >
                            <span className={styles.iconWrap}>
                            <Image
                                src="/icons/max.svg"
                                alt="MAX"
                                width={42}
                                height={42}
                            />
                            </span>
                            <span className={styles.text}>MAX</span>
                        </Link>
                        </div>
            </div>
            

            <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
                    <span />
                    <span />
                    <span />
            </button>
            </div>
        </div>
      {/* Мобильное меню */}
      <div
        className={`${styles.mobileMenuOverlay} ${
          menuOpen ? styles.mobileMenuOverlayActive : ""
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`${styles.mobileMenu} ${
            menuOpen ? styles.mobileMenuActive : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={styles.mobile_logo_container}
          >
            <img src="/svg/logo.svg" alt="" className={styles.mobile_logo} />
          </Link>
          <nav>
            <Link href="/#about" onClick={() => setMenuOpen(false)}>
              О компании
            </Link>
            <Link href="/#products" onClick={() => setMenuOpen(false)}>
              Продукция
            </Link>
            <Link href="/#services" onClick={() => setMenuOpen(false)}>
              Услуги
            </Link>
            <Link href="/#contacts" onClick={() => setMenuOpen(false)}>
              Контакты
            </Link>
          </nav>
          <div className={styles.mobileContacts}>
            <Link href={`tel:${phone}`}>
              <span>{phone}</span>
            </Link>
            <div className={styles.socials}>
              <Link href="https://m.vk.com/tridsat_dva" target="_blank">
                <Image
                  src="/svg/vk.svg"
                  alt="whatsapp"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="https://wa.me/79029830005" target="_blank">
                <Image
                  src="/svg/wa.svg"
                  alt="whatsapp"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
