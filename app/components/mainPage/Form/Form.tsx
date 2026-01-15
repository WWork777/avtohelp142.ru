'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import styles from './Form.module.scss';

type CarType = 'moto' | 'small' | 'car' | 'suv' | 'minibus';
type DistanceType = 'passing' | 'city' | 'region' | 'intercity';

export default function Form() {
  // Контактные данные
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // 1) Тип авто
  const [carType, setCarType] = useState<CarType>('moto');

  // 2) Заблокированные колёса
  const [blockedWheels, setBlockedWheels] = useState<0 | 1 | 2 | 3 | 4>(0);

  // 3) Руль заблокирован
  const [steeringLocked, setSteeringLocked] = useState<boolean>(false);

  // 4) Расстояние/тип маршрута
  const [distanceType, setDistanceType] = useState<DistanceType>('passing');

  // Состояния формы
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Заглушка расчёта (потом подменишь своей логикой)
  const price = useMemo(() => {
    let base = 3000;

    if (carType === 'moto') base = 2500;
    if (carType === 'small') base = 3000;
    if (carType === 'car') base = 3500;
    if (carType === 'suv') base = 4500;
    if (carType === 'minibus') base = 5500;

    base += blockedWheels * 400;
    if (steeringLocked) base += 600;

    if (distanceType === 'city') base += 500;
    if (distanceType === 'region') base += 1500;
    if (distanceType === 'intercity') base += 3000;

    return base;
  }, [carType, blockedWheels, steeringLocked, distanceType]);

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
          carType,
          blockedWheels,
          steeringLocked,
          distanceType,
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
      setCarType('moto');
      setBlockedWheels(0);
      setSteeringLocked(false);
      setDistanceType('passing');

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

        <form onSubmit={handleSubmit}>
          {/* Тип авто */}
          <div className={styles.step}>
            <p className={styles.step_title}>Выберите тип авто:</p>
            <div className={styles.types_grid}>
              <label className={styles.option}>
                <input
                  type='radio'
                  name='carType'
                  value='moto'
                  checked={carType === 'moto'}
                  onChange={() => setCarType('moto')}
                />

                <Image
                  className={styles.option_media}
                  src='/images/Form/moto.png'
                  alt=''
                  width={163}
                  height={64}
                />

                <span className={styles.option_label}>Мотоцикл</span>
              </label>

              <label className={styles.option}>
                <input
                  type='radio'
                  name='carType'
                  value='small'
                  checked={carType === 'small'}
                  onChange={() => setCarType('small')}
                />

                <Image
                  className={styles.option_media}
                  src='/images/Form/moto.png'
                  alt=''
                  width={163}
                  height={64}
                />

                <span className={styles.option_label}>Малолитражная</span>
              </label>

              <label className={styles.option}>
                <input
                  type='radio'
                  name='carType'
                  value='car'
                  checked={carType === 'car'}
                  onChange={() => setCarType('car')}
                />

                <Image
                  className={styles.option_media}
                  src='/images/Form/moto.png'
                  alt=''
                  width={163}
                  height={64}
                />

                <span className={styles.option_label}>Легковая</span>
              </label>

              <label className={styles.option}>
                <input
                  type='radio'
                  name='carType'
                  value='suv'
                  checked={carType === 'suv'}
                  onChange={() => setCarType('suv')}
                />

                <Image
                  className={styles.option_media}
                  src='/images/Form/moto.png'
                  alt=''
                  width={163}
                  height={64}
                />

                <span className={styles.option_label}>Внедорожник</span>
              </label>

              <label className={styles.option}>
                <input
                  type='radio'
                  name='carType'
                  value='minibus'
                  checked={carType === 'minibus'}
                  onChange={() => setCarType('minibus')}
                />

                <Image
                  className={styles.option_media}
                  src='/images/Form/moto.png'
                  alt=''
                  width={163}
                  height={64}
                />

                <span className={styles.option_label}>Микроавтобус</span>
              </label>
            </div>
          </div>

          {/* Заблокированные колёса */}
          <div className={styles.step}>
            <p className={styles.step_title}>Заблокированные колеса</p>
            <div className={styles.wheels_grid}>
              <label className={styles.option}>
                <input
                  type='radio'
                  name='blockedWheels'
                  value='0'
                  checked={blockedWheels === 0}
                  onChange={() => setBlockedWheels(0)}
                />
                <span className={styles.option_label}>Нет</span>
              </label>

              {[1, 2, 3, 4].map((n) => (
                <label key={n} className={styles.option}>
                  <input
                    type='radio'
                    name='blockedWheels'
                    value={n}
                    checked={blockedWheels === n}
                    onChange={() => setBlockedWheels(n as 1 | 2 | 3 | 4)}
                  />
                  <span className={styles.option_label}>{n}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Руль заблокирован */}
          <div className={styles.step}>
            <p className={styles.step_title}>Руль заблокирован</p>
            <div className={styles.rudder_grid}>
              <label className={styles.option}>
                <input
                  type='radio'
                  name='steeringLocked'
                  value='false'
                  checked={steeringLocked === false}
                  onChange={() => setSteeringLocked(false)}
                />
                <span className={styles.option_label}>Нет</span>
              </label>

              <label className={styles.option}>
                <input
                  type='radio'
                  name='steeringLocked'
                  value='true'
                  checked={steeringLocked === true}
                  onChange={() => setSteeringLocked(true)}
                />
                <span className={styles.option_label}>Да</span>
              </label>
            </div>
          </div>

          {/* Расстояние */}
          <div className={styles.step}>
            <p className={styles.step_title}>Расстояние</p>
            <div className={styles.selectWrap}>
              <select
                id='distanceType'
                value={distanceType}
                onChange={(e) =>
                  setDistanceType(e.target.value as DistanceType)
                }
              >
                <option value='passing'>Попутный</option>
                <option value='city'>По городу</option>
                <option value='region'>По области</option>
                <option value='intercity'>Межгород</option>
              </select>
            </div>
          </div>

          {/* Контактные данные */}
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

          {/* Сообщения об ошибке/успехе */}
          {submitStatus === 'error' && errorMessage && (
            <div className={styles.message_error}>{errorMessage}</div>
          )}
          {submitStatus === 'success' && (
            <div className={styles.message_success}>
              Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
            </div>
          )}

          {/* Низ: стоимость и кнопка */}
          <div className={styles.form_bottomRow}>
            <p>
              Стоимость составит ~{' '}
              <strong>{price.toLocaleString('ru-RU')} </strong> ₽
            </p>

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
          </div>
        </form>
      </div>
    </section>
  );
}
