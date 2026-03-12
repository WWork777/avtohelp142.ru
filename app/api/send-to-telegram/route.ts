// app/api/send-to-telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';

// 🔥 Время Кемерово = Москва + 4 часа
function getKemerovoTime(): string {
  const now = new Date();
  const moscowTime = new Date(now.toLocaleString('en-US', { 
    timeZone: 'Europe/Moscow' 
  }));
  moscowTime.setHours(moscowTime.getHours() + 4);
  
  const day = String(moscowTime.getDate()).padStart(2, '0');
  const month = String(moscowTime.getMonth() + 1).padStart(2, '0');
  const year = moscowTime.getFullYear();
  const hours = String(moscowTime.getHours()).padStart(2, '0');
  const minutes = String(moscowTime.getMinutes()).padStart(2, '0');
  
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, phone, address, mode, weight, kilometers, price, service, agreed 
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны для заполнения' },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const chatId2 = process.env.TELEGRAM_CHAT_ID_2;

    if (!botToken || !chatId) {
      console.error('TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не настроены');
      return NextResponse.json(
        { error: 'Сервер не настроен для отправки сообщений' },
        { status: 500 }
      );
    }

    const modeMap: Record<string, string> = {
      city: 'По городу',
      intercity: 'Межгород',
    };

    const weightMap: Record<string, string> = {
      upTo2: 'До 2 тонн',
      over2: 'Свыше 2 тонн',
      '3t': '3 тонны',
      from3_5: 'От 3,5 тонн',
      from4: 'От 4 тонн',
      over5: 'Больше 5 тонн',
    };

    // Формируем сообщение
    let message = `🚗 *Новая заявка на эвакуатор*

👤 *Контактные данные:*
Имя: ${name}
Телефон: ${phone}`;

    if (service && service.trim()) {
      message += `\n📋 Услуга: *${service.trim()}*`;
    }

    if (address && address.trim() && address !== service) {
      message += `\n📍 Адрес: ${address.trim()}`;
    }

    if (mode || weight) {
      message += `\n\n🚙 *Параметры заказа:*`;
      if (mode && modeMap[mode]) message += `\nРежим: ${modeMap[mode]}`;
      if (weight && weightMap[weight]) message += `\nВес машины: ${weightMap[weight]}`;
      if (mode === 'intercity' && kilometers) {
        message += `\nРасстояние: ${parseFloat(kilometers).toLocaleString('ru-RU')} км`;
      }
    }

    if (price && !isNaN(Number(price))) {
      message += `\n\n💰 *Стоимость:* ${Number(price).toLocaleString('ru-RU')} ₽`;
    }

    message += `\n\n✅ Согласие с политикой: ${agreed ? 'Да' : 'Нет'}`;
    
    // 🔥 Время Кемерово (Москва + 4 часа)
    message += `\n🕐 Время: ${getKemerovoTime()}`;

    message = message.trim();

    // Отправка в Telegram
    const sendToTelegram = async (targetChatId: string) => {
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Ошибка Telegram API:`, errorData);
        throw new Error(`Не удалось отправить в чат ${targetChatId}`);
      }
      return response.json();
    };

    try {
      await sendToTelegram(chatId);
    } catch (error) {
      console.error('❌ Ошибка отправки в основной чат:', error);
      return NextResponse.json(
        { error: 'Не удалось отправить заявку' },
        { status: 500 }
      );
    }

    if (chatId2) {
      try {
        await sendToTelegram(chatId2);
      } catch (error) {
        console.warn('⚠️ Не удалось отправить в дополнительный чат:', error);
      }
    }

    console.log('✅ Заявка отправлена:', { name, phone, service });
    return NextResponse.json({ success: true, message: 'Заявка успешно отправлена' });
    
  } catch (error) {
    console.error('💥 Ошибка обработки заявки:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке заявки' },
      { status: 500 }
    );
  }
}