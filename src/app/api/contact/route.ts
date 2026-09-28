import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, coffeeName, message } = body;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Будь ласка, заповніть обов'язкові поля (ім'я, телефон, email)" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });
    let emailSent = false;
    let telegramSent = false;

    // ==========================================
    // 1. ВІДПРАВКА ЧЕРЕЗ TELEGRAM БОТА
    // ==========================================
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    const isTgConfigured =
      tgToken &&
      tgChatId &&
      !tgToken.includes('your_telegram') &&
      !tgChatId.includes('demo_chat_id');

    if (isTgConfigured) {
      try {
        const tgText = `
☕ <b>НОВИЙ ЛІД: GOLD COFFEE BEANS</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Клієнт:</b> ${name}
📞 <b>Телефон:</b> <code>${phone}</code>
✉️ <b>Email:</b> ${email}
🏷 <b>Сорт:</b> <b>${coffeeName || 'Не вказано'}</b>
💬 <b>Коментар:</b> ${message || 'Без коментаря'}
⏰ <b>Час:</b> ${timestamp}
        `.trim();

        const tgRes = await fetch(
          `https://api.telegram.org/bot${tgToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: tgChatId,
              text: tgText,
              parse_mode: 'HTML',
            }),
          }
        );

        if (tgRes.ok) {
          telegramSent = true;
        } else {
          const tgErr = await tgRes.text();
          console.error('Telegram API error:', tgErr);
        }
      } catch (err) {
        console.error('Помилка надсилання в Telegram:', err);
      }
    }

    // ==========================================
    // 2. ВІДПРАВКА ЧЕРЕЗ NODEMAILER (SMTP)
    // ==========================================
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const senderName = process.env.MAIL_FROM?.replace(/"/g, '').trim() || 'GOLD COFFEE BEANS';
    const mailFrom = `"${senderName}" <${smtpUser}>`;

    const isSmtpConfigured =
      smtpUser &&
      smtpPass &&
      !smtpPass.includes('your_email_password');

    if (isSmtpConfigured) {
      try {
        // Якщо це Gmail, використовуємо вбудований пресет 'gmail' для 100% сумісності з App Passwords
        const transporter = nodemailer.createTransport(
          smtpHost.toLowerCase().includes('gmail')
            ? {
                service: 'gmail',
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
              }
            : {
                host: smtpHost,
                port: Number(process.env.SMTP_PORT) || 465,
                secure: process.env.SMTP_SECURE !== 'false',
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
              }
        );

        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0B0806; color: #FAF6F0; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background-color: #140E0A; border: 1px solid rgba(223, 183, 117, 0.35); border-radius: 16px; overflow: hidden; }
              .header { background: linear-gradient(135deg, #1E150F 0%, #120C08 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(223, 183, 117, 0.2); }
              .logo { color: #DFB775; font-size: 22px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
              .sublogo { color: #C4B5A5; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-top: 6px; }
              .content { padding: 30px 24px; }
              .greeting { font-size: 18px; color: #FAF6F0; margin-top: 0; margin-bottom: 12px; }
              .intro { color: #C4B5A5; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
              .card { background-color: #0E0906; border: 1px solid rgba(223, 183, 117, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
              .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 14px; }
              .row:last-child { border-bottom: none; }
              .label { color: #C4B5A5; }
              .value { color: #DFB775; font-weight: 600; text-align: right; }
              .promo-box { background: rgba(223, 183, 117, 0.1); border: 1px dashed rgba(223, 183, 117, 0.4); border-radius: 10px; padding: 14px; text-align: center; margin-bottom: 24px; }
              .promo-code { font-size: 18px; font-weight: bold; color: #DFB775; letter-spacing: 2px; }
              .disclaimer { background: rgba(245, 158, 11, 0.08); border-left: 3px solid #DFB775; padding: 12px 16px; border-radius: 4px; font-size: 12px; color: #E2D7CC; line-height: 1.5; margin-bottom: 24px; }
              .footer { background-color: #0B0806; padding: 20px 24px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #877667; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 class="logo">GOLD COFFEE BEANS</h1>
                <div class="sublogo">ARTISAN ROASTERY • SPECIALTY ONLY</div>
              </div>
              
              <div class="content">
                <h2 class="greeting">Вітаємо, ${name}! ☕</h2>
                <p class="intro">
                  Дякуємо за інтерес до нашого крафтового обсмаження! Ви щойно заповнили форму на сайті <strong>GOLD COFFEE BEANS</strong>. 
                  Цей лист надіслано автоматично на вказану вами пошту для демонстрації роботи поштової інтеграції.
                </p>

                <div class="card">
                  <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #DFB775; letter-spacing: 1px; margin-bottom: 12px;">
                    Деталі вашого тестового замовлення:
                  </div>
                  <div class="row">
                    <span class="label">Обраний сорт:</span>
                    <span class="value">${coffeeName || 'Не вказано'}</span>
                  </div>
                  <div class="row">
                    <span class="label">Контактний телефон:</span>
                    <span class="value">${phone}</span>
                  </div>
                  <div class="row">
                    <span class="label">Вказаний Email:</span>
                    <span class="value">${email}</span>
                  </div>
                  <div class="row">
                    <span class="label">Коментар до замовлення:</span>
                    <span class="value" style="color: #FAF6F0;">${message ? message : 'Не вказано'}</span>
                  </div>
                  <div class="row">
                    <span class="label">Час реєстрації:</span>
                    <span class="value" style="color: #FAF6F0;">${timestamp}</span>
                  </div>
                </div>

                <div class="promo-box">
                  <div style="font-size: 12px; color: #C4B5A5; margin-bottom: 4px;">Ваш тестовий промокод на знижку:</div>
                  <div class="promo-code">GOLD10</div>
                </div>

                <div class="disclaimer">
                  <strong>Зверніть увагу:</strong> Даний сайт є демонстраційним зразком, він нічого не продає та не пропонує користувачам. Цей лист сформовано автоматично для демонстрації функціоналу відправки листів.
                </div>
              </div>

              <div class="footer">
                © ${new Date().getFullYear()} GOLD COFFEE BEANS Roastery Atelier. Демонстраційний сайт для портфоліо.
              </div>
            </div>
          </body>
          </html>
        `;

        await transporter.sendMail({
          from: mailFrom,
          to: email.trim(), // Особистий лист клієнту без чужих адрес у полі To
          bcc: email.trim() !== 'usefultech.agency@gmail.com' ? 'usefultech.agency@gmail.com' : undefined, // Дублікат для агенції
          replyTo: smtpUser,
          subject: `☕ Ваша заявка у GOLD COFFEE BEANS: ${coffeeName || 'Дегустаційний набір'}`,
          text: `Вітаємо, ${name}!\n\nВи заповнили форму на сайті GOLD COFFEE BEANS.\n\nОбраний сорт: ${coffeeName}\nТелефон: ${phone}\nEmail: ${email}\nКоментар: ${message || 'немає'}\nЧас: ${timestamp}\n\nДаний сайт є демонстраційним зразком, він нічого не продає та не пропонує користувачам.`,
          html: htmlContent,
          headers: {
            'X-Priority': '3',
            'X-Mailer': 'GOLD COFFEE BEANS Notifier',
          },
        });

        emailSent = true;
      } catch (err) {
        console.error('Помилка відправки через Nodemailer:', err);
      }
    }

    // Якщо це локальний тест чи демо і ключі ще не введені:
    if (!isSmtpConfigured && !isTgConfigured) {
      console.log('📌 [ДЕМО РЕЖИМ] Отримано новий лід:', {
        name,
        phone,
        email,
        coffeeName,
        message,
        timestamp,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Заявку успішно прийнято!',
      details: {
        emailSent,
        telegramSent,
        demoMode: !isSmtpConfigured && !isTgConfigured,
      },
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера при обробці заявки' },
      { status: 500 }
    );
  }
}
