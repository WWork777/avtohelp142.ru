'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Services.module.scss';

export interface ServiceCardProps {
  src: string;
  title: string;
  subtitle: string;
}

const services: ServiceCardProps[] = [
  {
    src: '/images/Services/1.jpg',
    title: 'легковые автомобили',
    subtitle: 'Быстрая и бережная эвакуация легковых автомобилей',
  },
  {
    src: '/images/Services/2.jpg',
    title: 'ДТП и сложные случаи',
    subtitle: 'Эвакуация автомобилей после ДТП и сложных ситуаций',
  },
  {
    src: '/images/Services/3.jpg',
    title: 'Коммерческий транспорт',
    subtitle: 'Перевозка микроавтобусов, фургонов и коммерческого транспорта',
  },
  {
    src: '/images/Services/4.jpg',
    title: 'Мотоциклы и спецтехника',
    subtitle: 'Эвакуация мотоциклов, квадроциклов и другой техники',
  },
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', phone: '', agreed: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const pathname = usePathname();

  // Блокировка скролла при открытом модальном окне
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const handleServiceClick = (e: React.MouseEvent, serviceTitle: string) => {
    e.preventDefault();
    setSelectedService(serviceTitle);
    setIsModalOpen(true);
    setSubmitStatus('idle');
    setFormData({ name: '', phone: '', agreed: false });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.agreed) {
    alert('Необходимо согласие с политикой конфиденциальности');
    return;
  }
  
  if (!formData.phone.trim() || !formData.name.trim()) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  setIsSubmitting(true);
  setSubmitStatus('idle');

  try {
    // 🔥 Исправленный URL
    const response = await fetch('/api/send-to-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        service: selectedService,
        agreed: formData.agreed,
        // Пустые значения для совместимости с существующим роутом
        address: '',
        mode: '',
        weight: '',
        kilometers: '',
        price: '',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка отправки');
    }

    setSubmitStatus('success');
    
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitStatus('idle');
    }, 2000);
    
  } catch (error) {
    console.error('Ошибка отправки:', error);
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
  }
};

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', agreed: false });
    setSubmitStatus('idle');
  };

  // Обработка закрытия по Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = '#form';
    if (pathname !== '/') {
      window.location.href = `/${targetId}`;
      return;
    }
    const targetElement = document.getElementById('form');
    if (targetElement) {
      const headerHeight = 100;
      const targetPosition = targetElement.offsetTop - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id='services' className='container'>
      <div className={styles.services_header}>
        <h2>Услуги эвакуатора</h2>
        <Link
          href='/#form'
          className={styles.CTA_button}
          onClick={handleLinkClick}
        >
          <span className={styles.button_icon} aria-hidden='true'>
            <Image
              src={'/icons/arrow-white.svg'}
              className={styles.button_arrow}
              height={40}
              width={40}
              alt='arrow'
            />
          </span>
          <span className={styles.button_text}>Ознакомиться с ценами</span>
        </Link>
      </div>

      <div className={styles.services_Gallery}>
        {services.map((item, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.card_body} ${activeIndex === index ? styles.active : ''}`}
            style={{ backgroundImage: `url(${item.src})` }}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={(e) => handleServiceClick(e, item.title)}
            aria-label={`Заказать: ${item.title}`}
          >
            <span className={styles.button_icon} aria-hidden='true'>
              <Image
                src={'/icons/arrow-white.svg'}
                className={styles.button_arrow}
                height={40}
                width={40}
                alt='arrow'
              />
            </span>
            <div className={styles.card_footer}>
              <h3 className={styles.card_title}>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div 
          className={styles.modal_overlay} 
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className={styles.modal_content} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className={styles.modal_close} 
              onClick={closeModal}
              aria-label="Закрыть форму"
            >
              ×
            </button>
            
            <h3 id="modal-title" className={styles.modal_title}>
              Заказать: {selectedService}
            </h3>
            
            {submitStatus === 'success' ? (
              <div className={styles.success_message}>
                ✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.modal_form}>
                <div className={styles.form_group}>
                  <label htmlFor="name">Ваше имя *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Иван Иванов"
                    required
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                </div>
                
                <div className={styles.form_group}>
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+7 (999) 999-99-99"
                    pattern="^[\d\s\+\-\(\)]{10,}$"
                    required
                    disabled={isSubmitting}
                    autoComplete="tel"
                  />
                </div>
                
                <div className={styles.form_group_checkbox}>
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
                      <Link href="/privacy-policy.pdf" target="_blank" className={styles.policy_link}>
                        политикой конфиденциальности
                      </Link>{' '}
                      *
                    </span>
                  </label>
                </div>
                
                {submitStatus === 'error' && (
                  <p className={styles.error_message}>
                    ❌ Ошибка отправки. Позвоните нам: <a href="tel:+79234807070">+7 (923) 480-70-70</a>
                  </p>
                )}
                
                <button 
                  type="submit" 
                  className={styles.submit_button}
                  disabled={isSubmitting || !formData.agreed}
                >
                  {isSubmitting ? 'Отправка...' : 'Заказать эвакуатор'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}