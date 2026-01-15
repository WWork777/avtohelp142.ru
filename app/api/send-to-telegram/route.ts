import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, carType, blockedWheels, steeringLocked, distanceType, price } = body;

    // Проверяем наличие обязательных полей
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Получаем токен бота и chat_id из переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не настроены');
      return NextResponse.json(
        { error: 'Сервер не настроен для отправки сообщений' },
        { status: 500 }
      );
    }

    // Маппинг значений для читаемого формата
    const carTypeMap: Record<string, string> = {
      moto: 'Мотоцикл',
      small: 'Малолитражная',
      car: 'Легковая',
      suv: 'Внедорожник',
      minibus: 'Микроавтобус',
    };

    const distanceTypeMap: Record<string, string> = {
      passing: 'Попутный',
      city: 'По городу',
      region: 'По области',
      intercity: 'Межгород',
    };

    // Формируем сообщение для Telegram
    const message = `
🚗 *Новая заявка на эвакуатор*

👤 *Контактные данные:*
Имя: ${name}
Телефон: ${phone}

🚙 *Параметры заказа:*
Тип авто: ${carTypeMap[carType] || carType}
Заблокированные колеса: ${blockedWheels}
Руль заблокирован: ${steeringLocked ? 'Да' : 'Нет'}
Расстояние: ${distanceTypeMap[distanceType] || distanceType}

💰 *Стоимость:* ${price.toLocaleString('ru-RU')} ₽
    `.trim();

    // Отправляем сообщение в Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ошибка отправки в Telegram:', errorData);
      return NextResponse.json(
        { error: 'Не удалось отправить заявку' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Заявка успешно отправлена' });
  } catch (error) {
    console.error('Ошибка при обработке заявки:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке заявки' },
      { status: 500 }
    );
  }
}

