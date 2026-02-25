import Image from "next/image";
import styles from "./Hero.module.scss";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.hero_container}>
        <div className={styles.text_content}>
          <h1>Эвакуатор в Кемерово</h1>
          <div className={styles.line} />
          <p>
            Круглосуточные услуги эвакуации автомобилей быстро и недорого <br />{" "}
            Приедем в течение 20 мин
          </p>
        </div>
        <a className={styles.CTA_button} href="tel:+79234807070">
          <span className={styles.button_icon} aria-hidden="true">
            <Image
              src={"/icons/arrow-gray.svg"}
              className={styles.button_arrow}
              height={40}
              width={40}
              alt="arrow"
            />
          </span>
          <span className={styles.button_text}>Заказать эвакуатор</span>
        </a>
      </div>

      {/* Плавающая кнопка */}
      <a
        href="https://garage-42.ru"
        className={styles.floating_button}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.floating_button_text}>Перейти на сайт СТО</span>
      </a>
    </section>
  );
}
