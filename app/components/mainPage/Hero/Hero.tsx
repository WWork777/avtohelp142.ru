// Hero.tsx
"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.scss";

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

// 📱 Функция форматирования телефона: +7 (999) 123-45-67
const formatPhone = (value: string): string => {
  // Удаляем всё кроме цифр
  const numbers = value.replace(/\D/g, '');
  
  // Если начинается с 8, заменяем на 7
  const normalized = numbers.startsWith('8') ? '7' + numbers.slice(1) : numbers;
  
  // Если не начинается с 7, добавляем 7
  const withCode = normalized.startsWith('7') ? normalized : '7' + normalized;
  
  // Форматируем
  if (withCode.length <= 1) return '+7';
  if (withCode.length <= 4) return `+7 (${withCode.slice(1)}`;
  if (withCode.length <= 7) return `+7 (${withCode.slice(1, 4)}) ${withCode.slice(4)}`;
  if (withCode.length <= 9) return `+7 (${withCode.slice(1, 4)}) ${withCode.slice(4, 7)}-${withCode.slice(7)}`;
  if (withCode.length <= 11) return `+7 (${withCode.slice(1, 4)}) ${withCode.slice(4, 7)}-${withCode.slice(7, 9)}-${withCode.slice(9, 11)}`;
  
  return `+7 (${withCode.slice(1, 4)}) ${withCode.slice(4, 7)}-${withCode.slice(7, 9)}-${withCode.slice(9, 11)}`;
};

// Получаем только цифры из отформатированного номера
const getPhoneNumbers = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 11);
};

type FormData = {
  name: string;
  phone: string;
  agreed: boolean;
};

type SubmitStatus = 'idle' | 'success' | 'error';

export default function Hero() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    agreed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'phone') {
      // Форматируем телефон
      const formatted = formatPhone(value);
      setFormData(prev => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Отправляем только цифры телефона
      const submitData = {
        ...formData,
        phone: getPhoneNumbers(formData.phone),
      };

      console.log('📤 Отправка:', submitData);

      const response = await fetch('/api/send-to-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json().catch(() => ({}));
      console.log('📥 Статус:', response.status, 'Ответ:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP ${response.status}`);
      }

      setSubmitStatus('success');
      sendYandexGoal('form_submit_success');
      
      setTimeout(() => {
        setFormData({ name: '', phone: '', agreed: false });
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error: any) {
      console.error('❌ Ошибка:', error.message);
      setSubmitStatus('error');
      sendYandexGoal('form_submit_error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.hero_content}>
        
        {/* Левая колонка: заголовок + описание */}
        <div className={styles.hero_left}>
          <div className={styles.hero_top}>
            <h1>Эвакуатор в Кемерово</h1>
            <div className={styles.line} />
          </div>
          
          <div className={styles.hero_bottom}>
            <p>
              Круглосуточные услуги эвакуации автомобилей быстро и недорого <br />
              Приедем в течение 20 мин
            </p>
          </div>
        </div>

        {/* Правая колонка: форма */}
        <div className={styles.hero_right}>
          <div className={styles.form_content}>
            <form onSubmit={handleSubmit}>
              <div className={styles.step}>
                <h3 className={styles.step_title}>ОСТАВИТЬ ЗАЯВКУ</h3>
              </div>

              <div className={styles.contacts_row}>
                <div className={styles.input_wrapper}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ваше имя *"
                    className={styles.input}
                    required
                    disabled={isSubmitting}
                    autoComplete="name"
                    maxLength={50}
                  />
                </div>
                
                <div className={styles.input_wrapper}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+7 (___) ___-__-__"
                    className={styles.input}
                    required
                    disabled={isSubmitting}
                    autoComplete="tel"
                    maxLength={18} // +7 (999) 123-45-67 = 18 символов
                  />
                </div>
              </div>

              <div className={styles.step}>
                <label className={styles.checkbox_label}>
                  <input
                    type="checkbox"
                    name="agreed"
                    checked={formData.agreed}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                  <span>
                    Я согласен с{' '}
                    <Link href="/privacy" target="_blank" className={styles.policy_link}>
                      политикой конфиденциальности
                    </Link>{' '}
                    *
                  </span>
                </label>
              </div>

              {submitStatus === 'error' && (
                <p className={styles.message_error}>
                  ❌ Ошибка отправки. Позвоните нам: <a href="tel:+79234807070">+7 (923) 480-70-70</a>
                </p>
              )}
              
              {submitStatus === 'success' && (
                <p className={styles.message_success}>
                  ✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.
                </p>
              )}

              <div className={styles.form_bottomRow}>
                <div className={styles.text_block}>
                  <p>
                    Приедем в течение <strong>20 минут</strong>
                  </p>
                  <span className={styles.priceDetails}>Круглосуточно, без выходных</span>
                </div>
                
                <button 
                  type="submit" 
                  className={styles.CTA_button}
                  disabled={isSubmitting || !formData.agreed}
                >
                  <span className={styles.button_text}>
                    {isSubmitting ? 'Отправка...' : 'Заказать эвакуатор'}
                  </span>
                  <span className={styles.button_icon} aria-hidden="true">
                    <Image
                      src={"/icons/arrow-gray.svg"}
                      className={styles.button_arrow}
                      height={22}
                      width={22}
                      alt="arrow"
                    />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

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