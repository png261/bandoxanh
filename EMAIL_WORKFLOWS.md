# 📧 Email Workflows with Resend & Workflow.dev

This project uses **Resend** for sending emails and **Workflow.dev** for orchestrating email workflows.

## 🔑 Setup

### 1. Environment Variables

Add to `.env.local`:

```bash
RESEND_API_KEY=re_AK3W3Yf7_mZcHfLezxApotWwAvx4sTiBS
```

### 2. Resend Configuration

1. Go to [resend.com](https://resend.com)
2. Verify your domain (or use `onboarding@resend.dev` for testing)
3. Update the `from` address in `/lib/email.ts` and `/lib/workflows.ts`

**Important:** For production, replace `onboarding@resend.dev` with your verified domain:
```typescript
from: 'Bandoxanh <hello@yourdomain.com>'
```

## 📨 Available Email Workflows

### 1. Welcome Email (Automatic)

Automatically sent when a new user registers.

**Trigger:** User creation in `/api/users/me`

**Template:** `/lib/email.ts` → `getWelcomeEmailHTML()`

**Features:**
- Beautiful HTML design with gradient header
- List of platform features
- Call-to-action button
- Responsive design

### 2. Manual Welcome Email

Send welcome email via API:

```bash
POST /api/send-welcome-email
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name"
}
```

## 🔄 Workflow.dev Integration

### Setup Workflow.dev

1. Go to [useworkflow.dev](https://useworkflow.dev)
2. Create a new workflow
3. Use webhook trigger pointing to your endpoint

### Available Workflow Endpoints

#### Welcome Email Workflow

```bash
POST https://yourdomain.com/api/workflows/email
Content-Type: application/json

{
  "workflow": "welcome",
  "payload": {
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### Weekly Digest Workflow

```bash
POST https://yourdomain.com/api/workflows/email
Content-Type: application/json

{
  "workflow": "weekly-digest",
  "payload": {
    "email": "user@example.com",
    "name": "User Name",
    "stats": {
      "newPosts": 15,
      "newEvents": 3,
      "newNews": 5
    }
  }
}
```

### Workflow.dev Schedule Example

For weekly digest emails, create a scheduled workflow in Workflow.dev:

1. **Trigger:** Schedule (every Monday at 9 AM)
2. **Action:** HTTP Request
   - Method: POST
   - URL: `https://yourdomain.com/api/workflows/email`
   - Body:
   ```json
   {
     "workflow": "weekly-digest",
     "payload": {
       "email": "{{ user.email }}",
       "name": "{{ user.name }}",
       "stats": {
         "newPosts": 15,
         "newEvents": 3,
         "newNews": 5
       }
     }
   }
   ```

## 📁 File Structure

```
lib/
  ├── email.ts           # Welcome email service
  └── workflows.ts       # Workflow.dev email workflows

app/api/
  ├── send-welcome-email/
  │   └── route.ts       # Manual welcome email endpoint
  └── workflows/
      └── email/
          └── route.ts   # Workflow.dev webhook endpoint
```

## 🎨 Email Templates

All email templates use:
- Responsive HTML design
- Vietnamese language
- Brand colors (Green: #22c55e, #16a34a)
- Mobile-friendly layout

### Customizing Templates

Edit the HTML in:
- `/lib/email.ts` - Welcome email template
- `/lib/workflows.ts` - Workflow email templates

## 🧪 Testing

### Test Welcome Email Locally

```typescript
// In your code
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail({
  email: 'test@example.com',
  name: 'Test User'
});
```

### Test via API

```bash
curl -X POST http://localhost:3000/api/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Test Workflow.dev Webhook

```bash
curl -X POST http://localhost:3000/api/workflows/email \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": "welcome",
    "payload": {
      "email": "test@example.com",
      "name": "Test User"
    }
  }'
```

## 🚀 Production Checklist

- [ ] Verify your domain in Resend
- [ ] Update `from` email address to your domain
- [ ] Set up Workflow.dev account
- [ ] Configure scheduled workflows
- [ ] Test all email templates
- [ ] Set up email analytics (Resend dashboard)
- [ ] Configure DMARC/SPF/DKIM for better deliverability

## 📊 Email Analytics

Monitor email performance in:
- Resend Dashboard: [resend.com/emails](https://resend.com/emails)
- Track opens, clicks, bounces, and spam reports

## 🔐 Security

- API key stored in environment variables
- Webhook endpoints should validate requests (add authentication)
- Rate limiting recommended for production

## 💡 Future Enhancements

- [ ] Add more email templates (password reset, notifications, etc.)
- [ ] Implement email preferences for users
- [ ] Add unsubscribe functionality
- [ ] Create email template builder
- [ ] Add A/B testing for emails
- [ ] Implement email queuing for better performance
