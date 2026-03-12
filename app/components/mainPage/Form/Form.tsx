// app/components/mainPage/Form/Form.tsx
'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './Form.module.scss';

type ModeType = 'city' | 'intercity';
type WeightType = 'upTo2' | 'over2' | '3t' | 'from3_5' | 'from4' | 'over5';
type FormStep = 'params' | 'contacts' | 'success';

// 🔥 Лейблы для веса
const WEIGHT_LABELS: Record<WeightType, string> = {
  upTo2: 'До 2 тонн',
  over2: 'Свыше 2 тонн',
  '3t': '3 тонны',
  from3_5: 'От 3,5 тонн',
  from4: 'От 4 тонн',
  over5: 'Больше 5 тонн',
};

const getWeightLabel = (value: WeightType): string => WEIGHT_LABELS[value];

export default function Form() {
  // 🔥 Шаг формы
  const [currentStep, setCurrentStep] = useState<FormStep>('params');

  // Контактные данные
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [agreed, setAgreed] = useState<boolean>(false);

  // Параметры эвакуации
  const [mode, setMode] = useState<ModeType>('city');
  const [weight, setWeight] = useState<WeightType>('upTo2');
  const [kilometers, setKilometers] = useState<string>('');

  // Состояния формы
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [paramsError, setParamsError] = useState<string>('');

  const phoneNumber = '+79234807070';

  // 🔥 Функция отправки цели Яндекс.Метрики
  const sendYandexGoal = (goalId: string) => {
    if (typeof window !== 'undefined' && (window as any).ym) {
      try {
        (window as any).ym(106319272, 'reachGoal', goalId);
        console.log(`✅ Yandex Metrika goal sent: ${goalId}`);
      } catch (error) {
        console.error('❌ Error sending Yandex Metrika goal:', error);
      }
    }
  };

  // 🔥 Сводка параметров
  const paramsSummary = useMemo(() => {
    const parts: string[] = [];
    
    parts.push(mode === 'city' ? 'По городу' : 'Межгород');
    parts.push(`${getWeightLabel(weight)}`);
    
    if (mode === 'intercity' && kilometers) {
      parts.push(`${parseFloat(kilometers).toLocaleString('ru-RU')} км`);
    }
    
    return parts.join(' • ');
  }, [mode, weight, kilometers]);

  // Расчет цены
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

  // 🔥 Валидация телефона
  const validatePhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 12;
  };

  // 🔥 Валидация параметров (Шаг 1)
  const validateParams = (): boolean => {
    if (mode === 'intercity') {
      const km = parseFloat(kilometers);
      if (!kilometers.trim() || isNaN(km) || km <= 0) {
        setParamsError('Пожалуйста, введите корректное расстояние');
        return false;
      }
    }
    setParamsError('');
    return true;
  };

  // 🔥 Переход к контактам
  const handleContinue = () => {
    if (validateParams()) {
      setCurrentStep('contacts');
      setErrorMessage('');
      const formSection = document.getElementById('form');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // 🔥 Возврат к параметрам
  const handleBack = () => {
    setCurrentStep('params');
    setErrorMessage('');
    setParamsError('');
  };

  // 🔥 Отправка формы (Шаг 2)
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage('');

    // Валидация контактов
    if (!name.trim()) {
      setErrorMessage('Пожалуйста, введите ваше имя');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Пожалуйста, введите ваш телефон');
      return;
    }

    if (!validatePhone(phone)) {
      setErrorMessage('Пожалуйста, введите корректный номер телефона');
      return;
    }

    if (!agreed) {
      setErrorMessage('Необходимо согласие с политикой конфиденциальности');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-to-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: '',
          mode,
          weight,
          kilometers: mode === 'intercity' ? parseFloat(kilometers) : '',
          price,
          agreed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при отправке заявки');
      }

      // 🔥 Переход на экран успеха
      setCurrentStep('success');
      
      // 🔥 ОТПРАВЛЯЕМ ЦЕЛЬ: calc_form (калькулятор)
      sendYandexGoal('calc_form');
      
      // Сброс данных
      setName('');
      setPhone('');
      setAgreed(false);
      setMode('city');
      setWeight('upTo2');
      setKilometers('');
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Произошла ошибка при отправке');
    } finally {
      setIsSubmitting(false);
    }
  }

  // 🔥 Сброс формы и возврат к началу
  const handleNewRequest = () => {
    setCurrentStep('params');
    setErrorMessage('');
    setParamsError('');
  };

  return (
    <section id='form' className={`container ${styles.form_background}`}>
      <div className={styles.form_content}>
        {/* Верхние "табы" */}
        <div className={styles.form_topActions}>
          <button type='button'>Онлайн калькулятор</button>
          <button type='button'>Расчет стоимости</button>
          <button type='button' aria-label='Помощь'>?</button>
        </div>

        {/* 🔥 Индикатор шагов (скрыт на экране успеха) */}
        {currentStep !== 'success' && (
          <div className={styles.steps_indicator}>
            <div className={`${styles.step_dot} ${currentStep === 'params' ? styles.active : ''}`}>
              <span className={styles.step_number}>1</span>
              <span className={styles.step_label}>Параметры</span>
            </div>
            <div className={styles.step_line} />
            <div className={`${styles.step_dot} ${currentStep === 'contacts' ? styles.active : ''}`}>
              <span className={styles.step_number}>2</span>
              <span className={styles.step_label}>Контакты</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 🔹 ШАГ 1: Параметры эвакуации */}
          {currentStep === 'params' && (
            <div className={styles.step_content}>
              {/* Режим */}
              <div className={styles.step}>
                <p className={styles.step_title}>Выберите режим:</p>
                <div className={styles.rudder_grid}>
                  <label className={styles.option}>
                    <input
                      type='radio'
                      name='mode'
                      value='city'
                      checked={mode === 'city'}
                      onChange={() => { setMode('city'); setKilometers(''); }}
                      disabled={isSubmitting}
                    />
                    <span className={styles.option_label}>По городу</span>
                  </label>
                  <label className={styles.option}>
                    <input
                      type='radio'
                      name='mode'
                      value='intercity'
                      checked={mode === 'intercity'}
                      onChange={() => setMode('intercity')}
                      disabled={isSubmitting}
                    />
                    <span className={styles.option_label}>Межгород</span>
                  </label>
                </div>
              </div>

              {/* Вес */}
              <div className={styles.step}>
                <p className={styles.step_title}>Вес машины:</p>
                <div className={styles.wheels_grid}>
                  {[
                    { value: 'upTo2', label: 'До 2 тонн' },
                    { value: 'over2', label: 'Свыше 2 тонн' },
                    { value: '3t', label: '3 тонны' },
                    { value: 'from3_5', label: 'От 3,5 тонн' },
                    { value: 'from4', label: 'От 4 тонн' },
                    { value: 'over5', label: 'Больше 5 тонн' },
                  ].map((item) => (
                    <label key={item.value} className={styles.option}>
                      <input
                        type='radio'
                        name='weight'
                        value={item.value}
                        checked={weight === item.value}
                        onChange={() => setWeight(item.value as WeightType)}
                        disabled={isSubmitting}
                      />
                      <span className={styles.option_label}>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Километры */}
              {mode === 'intercity' && (
                <div className={styles.step}>
                  <p className={styles.step_title}>Расстояние (км):</p>
                  <div className={styles.selectWrap}>
                    <input
                      type='number'
                      min='1'
                      step='1'
                      placeholder='Введите количество км'
                      value={kilometers}
                      onChange={(e) => setKilometers(e.target.value)}
                      className={styles.input}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {/* Ошибка параметров */}
              {paramsError && (
                <div className={styles.message_error}>{paramsError}</div>
              )}

              {/* Низ: стоимость и кнопка "Далее" */}
              <div className={styles.form_bottomRow}>
                <p>
                  {mode === 'city' ? (
                    <>
                      Стоимость: <strong>{price.toLocaleString('ru-RU')} ₽</strong>
                    </>
                  ) : (
                    <>
                      Стоимость: <strong>{price.toLocaleString('ru-RU')} ₽</strong>
                      {kilometers && (
                        <span className={styles.priceDetails}>
                          {' '}
                          ({Math.round(price / parseFloat(kilometers))} ₽/км ×{' '}
                          {parseFloat(kilometers).toLocaleString('ru-RU')} км)
                        </span>
                      )}
                    </>
                  )}
                </p>

                <button
                  type='button'
                  className={styles.CTA_button}
                  onClick={handleContinue}
                  disabled={isSubmitting}
                >
                  <span className={styles.button_icon} aria-hidden='true'>
                    <Image
                      src={'/icons/arrow-E1.svg'}
                      className={styles.button_arrow}
                      height={40}
                      width={40}
                      alt='arrow'
                    />
                  </span>
                  <span className={styles.button_text}>
                    Продолжить
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* 🔹 ШАГ 2: Контакты */}
          {currentStep === 'contacts' && (
            <div className={styles.step_content}>
              {/* 🔙 Кнопка "Назад" */}
              <button
                type='button'
                className={styles.back_button}
                onClick={handleBack}
                disabled={isSubmitting}
              >
                ← Назад, изменить параметры
              </button>

              {/* 🔍 Сводка параметров */}
              <div className={styles.params_summary}>
                <p className={styles.summary_title}>Вы выбрали:</p>
                <p className={styles.summary_text}>{paramsSummary}</p>
                {/* <p className={styles.summary_price}>
                  Итого: <strong>{price.toLocaleString('ru-RU')} ₽</strong>
                </p> */}
              </div>

              {/* Контактные данные */}
              <div className={styles.step}>
                <p className={styles.step_title}>Ваши контактные данные</p>
                <div className={styles.contacts_row}>
                  <input
                    type='text'
                    placeholder='Ваше имя *'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={styles.input}
                    disabled={isSubmitting}
                    autoComplete='name'
                  />
                  <input
                    type='tel'
                    placeholder='Ваш телефон *'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className={styles.input}
                    disabled={isSubmitting}
                    autoComplete='tel'
                  />
                </div>
              </div>

              {/* Чекбокс согласия */}
              <div className={styles.step}>
                <label className={styles.checkbox_label}>
                  <input
                    type='checkbox'
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    disabled={isSubmitting}
                  />
                  <span>
                    Я согласен с{' '}
                    <Link href='/privacy' target='_blank' className={styles.policy_link}>
                      политикой конфиденциальности
                    </Link>{' '}
                    *
                  </span>
                </label>
              </div>

              {/* Сообщения об ошибке */}
              {errorMessage && (
                <div className={styles.message_error}>{errorMessage}</div>
              )}

              {/* Кнопка отправки */}
              <div className={styles.form_bottomRow}>
                <p className={styles.final_price}>
                  Стоимость <strong>{price.toLocaleString('ru-RU')} ₽</strong>
                </p>

                <button
                  className={styles.CTA_button}
                  type='submit'
                  disabled={isSubmitting || !agreed}
                >
                  <span className={styles.button_icon} aria-hidden='true'>
                    <Image
                      src={'/icons/arrow-E1.svg'}
                      className={styles.button_arrow}
                      height={40}
                      width={40}
                      alt='arrow'
                    />
                  </span>
                  <span className={styles.button_text}>
                    {isSubmitting ? 'Отправка...' : 'Заказать эвакуатор'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* 🔹 ШАГ 3: Успешная отправка ✅ */}
          {currentStep === 'success' && (
            <div className={styles.success_content}>
              <div className={styles.success_icon}>
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="40" cy="40" r="40" fill="#10B981" />
                  <path
                    d="M24 40L36 52L56 28"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              
              <h3 className={styles.success_title}>
                Заявка успешно отправлена!
              </h3>
              
              <p className={styles.success_text}>
                Мы свяжемся с вами в ближайшее время по указанному телефону.
              </p>
              
              <p className={styles.success_phone}>
                Или позвоните нам: <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
              </p>

              {/* <button
                type='button'
                className={styles.CTA_button}
                onClick={handleNewRequest}
              >
                <span className={styles.button_icon} aria-hidden='true'>
                  <Image
                    src={'/icons/arrow-E1.svg'}
                    className={styles.button_arrow}
                    height={40}
                    width={40}
                    alt='arrow'
                  />
                </span>
                <span className={styles.button_text}>
                  Отправить ещё заявку
                </span>
              </button> */}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}