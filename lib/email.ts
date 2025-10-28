import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: onboarding@resend.dev only sends to your Resend account email!
// For testing with other emails, add them to your Audience in Resend Dashboard
// For production, verify your domain and use: 'Bandoxanh <hello@yourdomain.com>'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Bandoxanh <onboarding@resend.dev>';

export interface WelcomeEmailData {
  email: string;
  name: string;
}

export async function sendWelcomeEmail({ email, name }: WelcomeEmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Chào mừng bạn đến với Bandoxanh! 🌱',
      html: getWelcomeEmailHTML(name, email),
      // Add text version to avoid spam filters
      text: `Xin chào ${name},\n\nCảm ơn bạn đã tham gia cộng đồng Bandoxanh!\n\nTruy cập: https://www.bandoxanh.org\n\nBandoxanh - Cùng nhau vì một môi trường xanh`,
      // Add headers to improve deliverability
      headers: {
        'X-Entity-Ref-ID': `${Date.now()}`,
      },
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

function getWelcomeEmailHTML(name: string, email: string): string {
  const unsubscribeUrl = `https://www.bandoxanh.org/unsubscribe?email=${encodeURIComponent(email)}`;
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chào mừng đến với Bandoxanh</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🌱 Chào mừng đến với Bandoxanh!
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Xin chào <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                Cảm ơn bạn đã tham gia cộng đồng Bandoxanh - nơi chúng ta cùng nhau bảo vệ môi trường và xây dựng một tương lai xanh hơn! 🌍
              </p>
              
              <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                Với Bandoxanh, bạn có thể:
              </p>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #666666; font-size: 16px; line-height: 1.8;">
                <li><strong>📍 Tìm điểm thu gom rác</strong> gần nhất trên bản đồ</li>
                <li><strong>📅 Tham gia sự kiện</strong> môi trường trong cộng đồng</li>
                <li><strong>📰 Đọc tin tức</strong> về môi trường và tái chế</li>
                <li><strong>💬 Chia sẻ</strong> câu chuyện và kết nối với cộng đồng</li>
                <li><strong>🔍 Nhận diện loại rác</strong> bằng AI để phân loại đúng cách</li>
              </ul>
              
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #22c55e; border-radius: 6px; text-align: center;">
                    <a href="https://www.bandoxanh.org" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                      Khám phá ngay 🚀
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #999999; font-size: 14px; line-height: 1.6; border-top: 1px solid #eeeeee; padding-top: 20px;">
                Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi qua <a href="mailto:hello@bandoxanh.org" style="color: #22c55e; text-decoration: none;">hello@bandoxanh.org</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                <strong>Bandoxanh</strong> - Cùng nhau vì một môi trường xanh
              </p>
              <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                📧 Email: hello@bandoxanh.org | 🌐 Website: www.bandoxanh.org
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                <a href="${unsubscribeUrl}" style="color: #999999; text-decoration: underline;">Hủy đăng ký</a> | Email này được gửi tới ${email}
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
