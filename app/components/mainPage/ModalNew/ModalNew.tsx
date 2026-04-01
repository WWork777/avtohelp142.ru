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

// 📱 Функция форматирования телефона: +7 (999) 123-45-67
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

// Получаем только цифры из отформатированного номера для отправки
const getPhoneNumbers = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 11);
};

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = {
  name: string;
  phone: string;
  carType: string;
  agreed: boolean;
};

type SubmitStatus = 'idle' | 'success' | 'error';

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    carType: 'Легковой автомобиль',
    agreed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      setFormData(prev => ({ ...prev, phone: formatPhone(value) }));
    } else if (name === 'agreed') {
      // ✅ Type guard: checked есть только у input
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, agreed: checked }));
    } else {
      // Для select и обычных input
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Подготавливаем данные: телефон только цифрами
      const submitData = {
        name: formData.name.trim(),
        phone: getPhoneNumbers(formData.phone),
        carType: formData.carType,
        source: 'modal_callback',
      };

      console.log('📤 Отправка заявки:', submitData);

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

      // ✅ Успех: отправляем цель и показываем статус
      setSubmitStatus('success');
      sendYandexGoal('form_submit_success');
      
      // Сброс формы и закрытие через 2 секунды
      setTimeout(() => {
        setFormData({ name: '', phone: '', carType: 'Легковой автомобиль', agreed: false });
        setSubmitStatus('idle');
        onClose();
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Ошибка отправки:', error.message);
      setSubmitStatus('error');
      sendYandexGoal('form_submit_error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик для внешних ссылок с трекингом
  const handleExternalLink = (e: React.MouseEvent, goalId: string, href: string) => {
    e.preventDefault();
    sendYandexGoal(goalId);
    
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
              disabled={isSubmitting || submitStatus === 'success'}
            />
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
              disabled={isSubmitting || submitStatus === 'success'}
            />
          </div>

          {/* Статусы отправки */}
          {submitStatus === 'success' && (
            <p className={styles.successMsg}>✅ Заявка отправлена!</p>
          )}
          {submitStatus === 'error' && (
            <p className={styles.errorMsg}>❌ Ошибка. Попробуйте позвонить нам.</p>
          )}

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting || submitStatus === 'success'}
          >
            {isSubmitting ? 'Отправка...' : 
             submitStatus === 'success' ? 'Отправлено ✓' : 'ОТПРАВИТЬ ЗАЯВКУ'}
          </button>
        </form>

        <p className={styles.policy}>
          Нажимая кнопку, вы соглашаетесь с{' '}
          <Link href='/privacy-policy.pdf' target='_blank' className={styles.policy_link}>
            политикой конфиденциальности
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OrderModal;