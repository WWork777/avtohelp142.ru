'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import styles from './Form.module.scss';

type ModeType = 'city' | 'intercity';
type WeightType = 'upTo2' | 'over2' | '3t' | 'from3_5' | 'from4' | 'over5';

export default function Form() {
  // Контактные данные (временно закомментированы - нет документов для сбора данных)
  // const [name, setName] = useState<string>('');
  // const [phone, setPhone] = useState<string>('');
  // const [address, setAddress] = useState<string>('');

  // Режим: по городу или межгород
  const [mode, setMode] = useState<ModeType>('city');

  // Вес машины
  const [weight, setWeight] = useState<WeightType>('upTo2');

  // Километры (только для межгорода)
  const [kilometers, setKilometers] = useState<string>('');

  // Состояния формы (временно закомментированы - функционал отправки формы заморожен)
  // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const [submitStatus, setSubmitStatus] = useState<
  //   'idle' | 'success' | 'error'
  // >('idle');
  // const [errorMessage, setErrorMessage] = useState<string>('');

  const phoneNumber = '+79234807070'; // Телефон для временной кнопки

  // Расчет цены
  const price = useMemo(() => {
    // Цены по городу (фиксированные)
    const cityPrices: Record<WeightType, number> = {
      upTo2: 4000,
      over2: 4500,
      '3t': 5500,
      from3_5: 6500,
      from4: 7000,
      over5: 9000,
    };

    // Цены межгород (за км)
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
      // Межгород: цена за км * количество км
      const pricePerKm = intercityPrices[weight];
      const km = parseFloat(kilometers) || 0;
      return pricePerKm * km;
    }
  }, [mode, weight, kilometers]);

  // Функция отправки формы временно заморожена - нет документов для сбора данных
  /* 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Валидация
    if (!name.trim()) {
      setErrorMessage('Пожалуйста, введите ваше имя');
      setSubmitStatus('error');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Пожалуйста, введите ваш телефон');
      setSubmitStatus('error');
      return;
    }

    // Базовая валидация телефона (только проверка на наличие цифр)
    const phoneRegex = /[\d\s\-\+\(\)]/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Пожалуйста, введите корректный номер телефона');
      setSubmitStatus('error');
      return;
    }

    // Валидация километров для межгорода
    if (mode === 'intercity') {
      const km = parseFloat(kilometers);
      if (!kilometers.trim() || isNaN(km) || km <= 0) {
        setErrorMessage('Пожалуйста, введите корректное количество километров');
        setSubmitStatus('error');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-to-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          mode,
          weight,
          kilometers: mode === 'intercity' ? parseFloat(kilometers) : null,
          price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при отправке заявки');
      }

      setSubmitStatus('success');
      // Очищаем форму после успешной отправки
      setName('');
      setPhone('');
      setAddress('');
      setMode('city');
      setWeight('upTo2');
      setKilometers('');

      // Скрываем сообщение об успехе через 5 секунд
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при отправке заявки'
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  */

  return (
    <section id='form' className={`container ${styles.form_background}`}>
      <div className={styles.form_content}>
        {/* Верхние "табы/кнопки" как на макете */}
        <div className={styles.form_topActions}>
          <button type='button'>Онлайн калькулятор</button>
          <button type='button'>Расчет стоимости</button>
          <button type='button' aria-label='Помощь'>
            ?
          </button>
        </div>

        {/* Временно используем div вместо form, пока не готовы документы для сбора данных */}
        <div>
          {/* <form onSubmit={handleSubmit}> */}
          {/* Режим: по городу или межгород */}
          <div className={styles.step}>
            <p className={styles.step_title}>Выберите режим:</p>
            <div className={styles.rudder_grid}>
              <label className={styles.option}>
                <input
                  type='radio'
                  name='mode'
                  value='city'
                  checked={mode === 'city'}
                  onChange={() => {
                    setMode('city');
                    setKilometers('');
                  }}
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
                />
                <span className={styles.option_label}>Межгород</span>
              </label>
            </div>
          </div>

          {/* Вес машины */}
          <div className={styles.step}>
            <p className={styles.step_title}>Вес машины:</p>
            <div className={styles.wheels_grid}>
              <label className={styles.option}>
                <input
                  type='radio'
                  name='weight'
                  value='upTo2'
                  checked={weight === 'upTo2'}
                  onChange={() => setWeight('upTo2')}
                />
                <span className={styles.option_label}>До 2 тонн</span>
              </label>

              <label className={styles.option}>
                <input
                  type='radio'
                  name='weight'
                  value='over2'
                  checked={weight === 'over2'}
                  onChange={() => setWeight('over2')}
                />
                <span className={styles.option_label}>Свыше 2 тонн</span>
              </label>

              <label className={styles.option}>
                <input
                  type='radio'
                  name='weight'
                  value='3t'
                  checked={weight === '3t'}
                  onChange={() => setWeight('3t')}
                />
                <span className={styles.option_label}>3 тонны</span>
              </label>

              <label className={styles.option}>
                <input
                  type='radio'
                  name='weight'
                  value='from3_5'
                  checked={weight === 'from3_5'}
                  onChange={() => setWeight('from3_5')}
                />
                <span className={styles.option_label}>От 3,5 тонн</span>
              </label>

              <label className={styles.option}>
                <input
                  type='radio'
                  name='weight'
                  value='from4'
                  checked={weight === 'from4'}
                  onChange={() => setWeight('from4')}
                />
                <span className={styles.option_label}>От 4 тонн</span>
              </label>

              <label className={styles.option}>
                <input
                  type='radio'
                  name='weight'
                  value='over5'
                  checked={weight === 'over5'}
                  onChange={() => setWeight('over5')}
                />
                <span className={styles.option_label}>Больше 5 тонн</span>
              </label>
            </div>
          </div>

          {/* Километры для межгорода */}
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
                  required
                />
              </div>
            </div>
          )}

          {/* Поля сбора данных временно закомментированы - нет документов для сбора данных пользователей */}
          {/* 
          <div className={styles.step}>
            <p className={styles.step_title}>Адрес забора машины</p>
            <input
              type='text'
              placeholder='Введите адрес'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.step}>
            <p className={styles.step_title}>Ваши контактные данные</p>
            <div className={styles.contacts_row}>
              <input
                type='text'
                placeholder='Ваше имя'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.input}
              />
              <input
                type='tel'
                placeholder='Ваш телефон'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          </div>

          {submitStatus === 'error' && errorMessage && (
            <div className={styles.message_error}>{errorMessage}</div>
          )}
          {submitStatus === 'success' && (
            <div className={styles.message_success}>
              Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
            </div>
          )}
          */}

          {/* Низ: стоимость и кнопка */}
          <div className={styles.form_bottomRow}>
            <p>
              {mode === 'city' ? (
                <>
                  Стоимость составит ~{' '}
                  <strong>{price.toLocaleString('ru-RU')} </strong> ₽
                </>
              ) : (
                <>
                  Стоимость: <strong>{price.toLocaleString('ru-RU')} </strong> ₽
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

            <a
              href={`tel:${phoneNumber}`}
              className={styles.CTA_button}
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
                Вызвать эвакуатор
              </span>
            </a>

            {/* Временно используем ссылку вместо кнопки submit */}
            {/* 
            <button
              className={styles.CTA_button}
              type='submit'
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
                {isSubmitting ? 'Отправка...' : 'Вызвать эвакуатор'}
              </span>
            </button>
            */}
          </div>
        </div>
        {/* </form> */}
      </div>
    </section>
  );
}
