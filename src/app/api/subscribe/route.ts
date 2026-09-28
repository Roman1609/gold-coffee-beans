import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Будь ласка, вкажіть коректний e-mail' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });
    let emailSent = false;

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
              .content { padding: 32px 24px; }
              .main-text { font-size: 16px; color: #FAF6F0; line-height: 1.6; margin-bottom: 24px; }
              .disclaimer-box { background: rgba(223, 183, 117, 0.08); border-left: 4px solid #DFB775; padding: 18px 20px; border-radius: 6px; font-size: 13px; color: #E2D7CC; line-height: 1.6; margin-bottom: 24px; }
              .sign-off { margin-top: 24px; font-size: 14px; color: #DFB775; font-weight: 600; }
              .sign-off a { color: #FAF6F0; text-decoration: underline; }
              .footer { background-color: #0B0806; padding: 18px 24px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #877667; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 class="logo">GOLD COFFEE BEANS</h1>
                <div class="sublogo">КЛУБ ПРИВІЛЕЇВ • NEWSLETTER</div>
              </div>

              <div class="content">
                <p class="main-text">
                  Вітаємо ви підписалися на розсилку новин нашої компанії, оновлення каталогів асортименту. Залишайтесь із нами щоб отримувати актуальну інформацію.
                </p>

                <div class="disclaimer-box">
                  Цей лист є тестовим зразком, ніякої розсилки не буде відбуватися, але якщо Вам цікава така функція Ви можете обговорити її реалізацію із нашим менеджером за вказаною нижче адресою.
                  <div class="sign-off">
                    З повагою UTS — <a href="mailto:usefultech.agency@gmail.com">usefultech.agency@gmail.com</a>
                  </div>
                </div>

                <div style="font-size: 12px; color: #877667; text-align: center;">
                  Час оформлення тестової підписки: ${timestamp}
                </div>
              </div>

              <div class="footer">
                © ${new Date().getFullYear()} GOLD COFFEE BEANS & UTS. Демонстраційний зразок для портфоліо.
              </div>
            </div>
          </body>
          </html>
        `;

        const plainText = `Вітаємо ви підписалися на розсилку новин нашої компанії, оновлення каталогів асортименту. Залишайтесь із нами щоб отримувати актуальну інформацію.\n\nЦей лист є тестовим зразком, ніякої розсилки не буде відбуватися, але якщо Вам цікава така функція Ви можете обговорити її реалізацію із нашим менеджером за вказаною нижче адресою.\n\nЗ повагою UTS - usefultech.agency@gmail.com\n\nЧас: ${timestamp}`;

        await transporter.sendMail({
          from: mailFrom,
          to: email.trim(),
          bcc: email.trim() !== 'usefultech.agency@gmail.com' ? 'usefultech.agency@gmail.com' : undefined,
          replyTo: 'usefultech.agency@gmail.com',
          subject: '☕ Підтвердження підписки: GOLD COFFEE BEANS & UTS',
          text: plainText,
          html: htmlContent,
          headers: {
            'X-Priority': '3',
            'X-Mailer': 'GOLD COFFEE BEANS Notifier',
          },
        });

        emailSent = true;
      } catch (err) {
        console.error('Помилка відправки підписки через Nodemailer:', err);
      }
    }

    if (!isSmtpConfigured) {
      console.log('📌 [ДЕМО РЕЖИМ ПІДПИСКИ] Отримано email:', email, timestamp);
    }

    return NextResponse.json({
      success: true,
      message: 'Лист успішно надіслано!',
      details: {
        emailSent,
        demoMode: !isSmtpConfigured,
      },
    });
  } catch (error: any) {
    console.error('Subscribe API Error:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера при оформленні підписки' },
      { status: 500 }
    );
  }
}
