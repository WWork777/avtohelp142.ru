'use client';

import Image from 'next/image';
import { useMemo, useState, ChangeEvent } from 'react';
import Link from 'next/link';
import styles from './FormNew.module.scss';

type ModeType = 'city' | 'intercity';
type WeightType = 'upTo2' | 'over2' | '3t' | 'from3_5' | 'from4' | 'over5';
type FormStep = 'params' | 'contacts' | 'success';

const WEIGHT_LABELS: Record<WeightType, string> = {
  upTo2: 'До 2 тонн', over2: 'Свыше 2 тонн', '3t': '3 тонны',
  from3_5: 'От 3,5 тонн', from4: 'От 4 тонн', over5: 'Больше 5 тонн',
};

export default function Form() {
  const [currentStep, setCurrentStep] = useState<FormStep>('params');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [mode, setMode] = useState<ModeType>('city');
  const [weight, setWeight] = useState<WeightType>('upTo2');
  const [kilometers, setKilometers] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const phoneNumber = '+79234807070';

  // 🔥 Helper для вызова целей Яндекс.Метрики
  const trackGoal = (goalName: string) => {
    if (typeof window !== 'undefined' && typeof (window as any).ym === 'function') {
      (window as any).ym(106319272, 'reachGoal', goalName);
    }
  };

  // Маска телефона
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('8')) value = '7' + value.slice(1);
    if (!value.startsWith('7')) value = '7' + value;
    
    let formatted = '+7';
    if (value.length > 1) formatted += ` (${value.slice(1, 4)}`;
    if (value.length > 4) formatted += `) ${value.slice(4, 7)}`;
    if (value.length > 7) formatted += `-${value.slice(7, 9)}`;
    if (value.length > 9) formatted += `-${value.slice(9, 11)}`;
    
    setPhone(formatted);
  };

  const price = useMemo(() => {
    const cityPrices: Record<WeightType, number> = {
      upTo2: 4000,
      over2: 4500,
      '3t': 5500,
      from3_5: 6500,
      from4: 7000,
      over5: 9000,
    };

    const intercityPrices: Record<WeightType, number> = {
      upTo2: 90,
      over2: 100,
      '3t': 120,
      from3_5: 140,
      from4: 150,
      over5: 170,
    };

    if (mode === 'city') {
      return cityPrices[weight];
    } else {
      const pricePerKm = intercityPrices[weight];
      const km = parseFloat(kilometers) || 0;
      return pricePerKm * km;
    }
  }, [mode, weight, kilometers]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-to-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone: phone.replace(/\D/g, ''), mode, weight, price, kilometers
        }),
      });
      
      if (response.ok) {
        // 🔥 Отправляем цель в Яндекс.Метрику при успешной отправке
        trackGoal('calc_form');
        setCurrentStep('success');
      }
    } catch (err) {
      setErrorMessage('Ошибка сети');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id='form' className={styles.form_background}>
      <div className={styles.main_container}>
        <h2 className={styles.main_title}>Стоимость услуг</h2>

        <div className={styles.form_content}>
          <div className={styles.form_topActions}>
            <button className={styles.tab_button} type='button'>Онлайн калькулятор</button>
            <button className={styles.tab_button} type='button'>Расчет стоимости</button>
          </div>

          {currentStep !== 'success' && (
            <div className={styles.steps_indicator}>
              <div className={`${styles.step_dot} ${currentStep === 'params' ? styles.active : ''}`}>
                <span className={styles.step_number}>1</span> Параметры
              </div>
              <div className={styles.step_line} />
              <div className={`${styles.step_dot} ${currentStep === 'contacts' ? styles.active : ''}`}>
                <span className={styles.step_number}>2</span> Контакты
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 'params' && (
              <div>
                <div className={styles.step}>
                  <p className={styles.step_title}>Выберите режим:</p>
                  <div className={styles.rudder_grid}>
                    <label className={styles.option}>
                      <input type='radio' checked={mode === 'city'} onChange={() => setMode('city')} />
                      <span className={styles.option_label}>По городу</span>
                    </label>
                    <label className={styles.option}>
                      <input type='radio' checked={mode === 'intercity'} onChange={() => setMode('intercity')} />
                      <span className={styles.option_label}>Межгород</span>
                    </label>
                  </div>
                </div>

                <div className={styles.step}>
                  <p className={styles.step_title}>Вес машины:</p>
                  <div className={styles.wheels_grid}>
                    {Object.entries(WEIGHT_LABELS).map(([val, label]) => (
                      <label key={val} className={styles.option}>
                        <input type='radio' checked={weight === val} onChange={() => setWeight(val as WeightType)} />
                        <span className={styles.option_label}>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {mode === 'intercity' && (
                  <div className={styles.step}>
                    <p className={styles.step_title}>Расстояние (км):</p>
                    <input type='number' className={styles.input_field} value={kilometers} onChange={(e) => setKilometers(e.target.value)} />
                  </div>
                )}

                <div className={styles.form_bottomRow}>
                  <p className={styles.price_label}>Стоимость: <strong className={styles.price_value}>{price.toLocaleString('ru-RU')} ₽</strong></p>
                  <button type='button' className={styles.CTA_button} onClick={() => setCurrentStep('contacts')}>
                    <span className={styles.button_icon}>→</span>
                    <span className={styles.button_text}>Продолжить</span>
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'contacts' && (
              <div>
                <button type='button' className={styles.back_button} onClick={() => setCurrentStep('params')}>← Назад</button>
                <p className={styles.step_title}>Ваши контакты</p>
                <div className={styles.contacts_row}>
                  <input type='text' placeholder='Ваше имя' className={styles.input_field} value={name} onChange={(e) => setName(e.target.value)} required />
                  <input type='tel' placeholder='+7 (___) ___-__-__' className={styles.input_field} value={phone} onChange={handlePhoneChange} required />
                </div>
                <div className={styles.form_bottomRow}>
                  <p className={styles.price_label}>Итого: <strong className={styles.price_value}>{price.toLocaleString('ru-RU')} ₽</strong></p>
                  <button type='submit' className={styles.CTA_button} disabled={isSubmitting}>
                    <span className={styles.button_icon}>✓</span>
                    <span className={styles.button_text}>{isSubmitting ? 'Отправка...' : 'Вызвать эвакуатор'}</span>
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'success' && (
              <div className={styles.success_content}>
                <div className={styles.success_icon}>✅</div>
                <h3>Заявка отправлена!</h3>
                <p>Мы свяжемся с вами через 30 секунд.</p>
                <a href={`tel:${phoneNumber}`} className={styles.success_phone}>{phoneNumber}</a>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}