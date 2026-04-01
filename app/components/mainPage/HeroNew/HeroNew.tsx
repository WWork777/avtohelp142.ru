'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import styles from './HeroNew.module.scss';
import OrderModal from '../ModalNew/ModalNew';
// --- Утилиты из твоего кода ---
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

const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  const normalized = numbers.startsWith('8') ? '7' + numbers.slice(1) : numbers;
  const withCode = normalized.startsWith('7') ? normalized : '7' + normalized;
  
  if (withCode.length <= 1) return '+7';
  if (withCode.length <= 4) return `+7 (${withCode.slice(1)}`;
  if (withCode.length <= 7) return `+7 (${withCode.slice(1, 4)}) ${withCode.slice(4)}`;
  if (withCode.length <= 9) return `+7 (${withCode.slice(1, 4)}) ${withCode.slice(4, 7)}-${withCode.slice(7)}`;
  if (withCode.length <= 11) return `+7 (${withCode.slice(1, 4)}) ${withCode.slice(4, 7)}-${withCode.slice(7, 9)}-${withCode.slice(9, 11)}`;
  return `+7 (${withCode.slice(1, 4)}) ${withCode.slice(4, 7)}-${withCode.slice(7, 9)}-${withCode.slice(9, 11)}`;
};

const getPhoneNumbers = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 11);
};

type SubmitStatus = 'idle' | 'success' | 'error';

// --- Компонент ---
export default function TowTruckHero() {
  const [formData, setFormData] = useState({ name: '', phone: '', agreed: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phone' ? formatPhone(value) : (type === 'checkbox' ? checked : value),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/send-to-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, phone: getPhoneNumbers(formData.phone) }),
      });

      if (!response.ok) throw new Error('Ошибка сети');

      setSubmitStatus('success');
      sendYandexGoal('form_submit_success');
      setTimeout(() => {
        setFormData({ name: '', phone: '', agreed: true });
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      sendYandexGoal('form_submit_error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}><img src="/icons/wizard.svg" alt="Arrow" width="15" height="15" /> ПОДАЧА 15 МИНУТ</div>
          
          <h1 className={styles.title}>
            ЭВАКУАТОР <br />
            <span className={styles.highlight}>КЕМЕРОВО</span>
          </h1>

          <div className={styles.featuresCard}>
            <ul className={styles.features}>
              <li>Удерживаем стоимость на уровне <span>~20% ниже рынка</span></li>
              <li>Сумма фиксируется в договоре. Никаких скрытых платежей.</li>
              <li>Подача через 15 мин. Собственный парк техники.</li>
            </ul>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* <div className={styles.inputsRow}>
              <input 
                type="text" 
                name="name" 
                placeholder="Ваше имя" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type="tel" 
                name="phone" 
                placeholder="+7 (___) ___-__-__" 
                value={formData.phone} 
                onChange={handleInputChange} 
                required 
              />
            </div> */}
            
            <div className={styles.actions}>
              <div className={styles.btnWrapper}>
                    <a 
                        href="tel:+79234807070" 
                        className={styles.btnPrimary}
                        onClick={() => sendYandexGoal('call_clicked')} // Опционально: трекаем клик по звонку
                    >
                        ВЫЗВАТЬ ЭВАКУАТОР <span className={styles.arrow}>→</span>
                    </a>
                    {/* <p className={styles.promo}>🔥 Выгода -10% на первый вызов</p> */}
                    </div>
              
             
              <button  type="button" className={styles.btnSecondary}>
                <img src="/icons/calc.svg" alt="Arrow" width="20" height="20" />Рассчитать
              </button>
            </div>
            
            {/* {submitStatus === 'success' && <p className={styles.successMsg}>Заявка успешно отправлена!</p>}
            {submitStatus === 'error' && <p className={styles.errorMsg}>Ошибка. Попробуйте еще раз.</p>} */}
          </form>
        </div>

        {/* Правая часть остается без изменений */}
        <div className={styles.statusCard}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Статус автопарка</h3>
              <p>Обновлено: только что</p>
            </div>
            <span className={styles.onlineDot}></span>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statIcon}>🚚</span>
              <div className={styles.statVal}>12</div>
              <div className={styles.statLabel}>МАШИН СВОБОДНО</div>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statIcon}>⏳</span>
              <div className={styles.statVal}>14:30</div>
              <div className={styles.statLabel}>СРЕД. ВРЕМЯ ПОДАЧИ</div>
            </div>
          </div>
          <div className={styles.mapPreview}>
            <button 
            className={styles.mapBtn} 
            onClick={() => setIsModalOpen(true)} // Теперь кнопка на карте открывает модалку
            > <img src="/icons/place.svg" alt="Arrow" width="20" height="20" /> Найти ближайший</button>
          </div>
          <OrderModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  formatPhone={formatPhone} // Используем ту же функцию форматирования
/>
          <div className={styles.infoFooter}>
            {/* <span className={styles.infoIcon}>i</span> */} <img src="/icons/inform.svg" alt="Arrow" width="20" height="20" />
            <p>Работаем во всех округах Кемерово. Принимаем карты, наличные и переводы.</p>
          </div>
        </div>
      </div>

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