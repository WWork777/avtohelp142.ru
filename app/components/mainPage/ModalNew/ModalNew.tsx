'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './ModalNew.module.scss';
import Image from 'next/image';
import Link from 'next/link';
// Типизируем глобальную функцию ym для TypeScript
declare global {
  interface Window {
    ym?: (counterId: number, command: string, goalId: string, options?: any) => void;
  }
}

// Вспомогательная функция для отправки целей в Яндекс.Метрику
const sendYandexGoal = (goalId: string) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(106319272, 'reachGoal', goalId);
  }
};

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  formatPhone: (value: string) => string;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, formatPhone }) => {
  const [formData, setFormData] = useState({
    name: '',
    carType: 'Легковой автомобиль',
    phone: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'phone' ? formatPhone(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Отправка цели: форма заявки
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(106319272, 'reachGoal', 'service_form');
    }
    
    console.log('Данные формы:', formData);
    // Логику отправки в ТГ добавим, когда скинешь API
    onClose();
  };

  // Обработчик для внешних ссылок с трекингом
  const handleExternalLink = (e: React.MouseEvent, goalId: string, href: string) => {
    e.preventDefault();
    sendYandexGoal(goalId);
    
    // Небольшая задержка для гарантии отправки события перед переходом
    setTimeout(() => {
      window.open(href, '_blank', 'noopener,noreferrer');
    }, 150);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <div className={styles.header}>
          <div className={styles.iconCircle}>📞</div>
          <h2>Заказать звонок</h2>
          <p>Оставьте номер и мы перезвоним за 30 секунд</p>
        </div>

        <div className={styles.contactMethods}>
          {/* Звонок по телефону */}
          <a 
            href="tel:+79234807070" 
            className={styles.methodCard}
            onClick={(e) => handleExternalLink(e, 'call_clicked', 'tel:+79234807070')}
          >
            <Image src="/icons/phone.svg" alt="телефон" width="20" height="20" />
            ЗВОНОК
          </a>
          
          {/* MAX */}
          <a 
            href="https://max.ru/u/f9LHodD0cOJKIJtCLzt9R39PdOR-MG1fi9sdMh9cEZzuXB-ca-EqbrqgtN4"
            className={`${styles.methodCard} ${styles.max}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleExternalLink(e, 'max', 'https://max.ru/u/f9LHodD0cOJKIJtCLzt9R39PdOR-MG1fi9sdMh9cEZzuXB-ca-EqbrqgtN4')}
          >
            <Image src="/icons/max-blue.svg" alt="макс" width="20" height="20" />
            MAX
          </a>
          
          {/* Telegram */}
          <a 
            href="https://t.me/avtohelp142"
            className={`${styles.methodCard} ${styles.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => handleExternalLink(e, 'telegram', 'https://t.me/avtohelp142')}
          >
            <Image src="/icons/tg-blue.svg" alt="телеграм" width="20" height="20" />
            TELEGRAM
          </a>
        </div>

        <div className={styles.divider}>
          <span>ИЛИ ФОРМА</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Ваше имя</label>
            <input 
              type="text" 
              name="name"
              placeholder="Введите имя" 
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Тип автомобиля</label>
            <select name="carType" value={formData.carType} onChange={handleChange}>
              <option>Легковой автомобиль</option>
              <option>Внедорожник / Кроссовер</option>
              <option>Микроавтобус</option>
              <option>Спецтехника</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Телефон *</label>
            <input 
              type="tel" 
              name="phone"
              placeholder="+7 (___) ___-__-__" 
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            ОТПРАВИТЬ ЗАЯВКУ
          </button>
        </form>

        <p className={styles.policy}>
          Нажимая кнопку, вы соглашаетесь с <Link href='/privacy-policy.pdf' target='_blank' className={styles.policy_link}>
                      политикой конфиденциальности
                    </Link>{' '}
        </p>
      </div>
    </div>
  );
};

export default OrderModal;