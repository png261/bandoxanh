import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: onboarding@resend.dev only sends to your Resend account email!
// For production, verify your domain and update this
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Bandoxanh <onboarding@resend.dev>';

export interface EmailWorkflowOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send email using Resend
 * This can be triggered from Workflow.dev for scheduled or triggered emails
 */
export async function sendEmail(options: EmailWorkflowOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from || FROM_EMAIL,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Workflow: Send welcome email to new user
 * Can be triggered via Workflow.dev webhook
 */
export async function welcomeEmailWorkflow(payload: {
  email: string;
  name: string;
}) {
  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🌱 Chào mừng đến với Bandoxanh!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333; font-size: 16px;">Xin chào <strong>${payload.name}</strong>,</p>
              <p style="margin: 0 0 20px; color: #666; font-size: 16px;">Cảm ơn bạn đã tham gia Bandoxanh! 🌍</p>
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #666; font-size: 16px; line-height: 1.8;">
                <li>📍 Tìm điểm thu gom rác gần nhất</li>
                <li>📅 Tham gia sự kiện môi trường</li>
                <li>📰 Đọc tin tức về tái chế</li>
                <li>💬 Kết nối với cộng đồng</li>
                <li>🔍 Nhận diện loại rác bằng AI</li>
              </ul>
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #22c55e; border-radius: 6px; text-align: center;">
                    <a href="https://www.bandoxanh.org" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-weight: 600;">Khám phá ngay 🚀</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #666; font-size: 14px;"><strong>Bandoxanh</strong> - Cùng nhau vì môi trường xanh</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: payload.email,
    subject: 'Chào mừng bạn đến với Bandoxanh! 🌱',
    html,
  });
}

/**
 * Workflow: Send weekly digest email
 * Can be scheduled via Workflow.dev
 */
export async function weeklyDigestWorkflow(payload: {
  email: string;
  name: string;
  stats: {
    newPosts: number;
    newEvents: number;
    newNews: number;
  };
}) {
  const html = `
<!DOCTYPE html>
<html lang="vi">
<body style="font-family: sans-serif; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
    <h2 style="color: #22c55e;">📊 Bản tin tuần này - Bandoxanh</h2>
    <p>Xin chào ${payload.name},</p>
    <p>Đây là những gì đã xảy ra trong tuần qua:</p>
    <ul style="line-height: 1.8;">
      <li>📝 <strong>${payload.stats.newPosts}</strong> bài viết mới từ cộng đồng</li>
      <li>📅 <strong>${payload.stats.newEvents}</strong> sự kiện môi trường mới</li>
      <li>📰 <strong>${payload.stats.newNews}</strong> tin tức về tái chế</li>
    </ul>
    <a href="https://www.bandoxanh.org" style="display: inline-block; padding: 12px 30px; background: #22c55e; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">Xem chi tiết</a>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: payload.email,
    subject: `📊 Bản tin tuần này từ Bandoxanh`,
    html,
  });
}
