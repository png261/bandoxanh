# 🚀 Quick Start: Email Integration

## ✅ Setup Complete!

Your Bandoxanh app now has email capabilities using Resend and Workflow.dev integration.

## 📧 What's Been Implemented

### 1. **Automatic Welcome Emails**
- ✅ New users automatically receive a welcome email when they register
- ✅ Beautiful HTML template with your branding
- ✅ Integrated into `/api/users/me` route

### 2. **Manual Email API**
```bash
# Send welcome email manually
POST /api/send-welcome-email
{
  "email": "user@example.com",
  "name": "User Name"
}
```

### 3. **Workflow.dev Webhooks**
```bash
# Welcome email workflow
POST /api/workflows/email
{
  "workflow": "welcome",
  "payload": { "email": "...", "name": "..." }
}

# Weekly digest workflow
POST /api/workflows/email
{
  "workflow": "weekly-digest",
  "payload": {
    "email": "...",
    "name": "...",
    "stats": { "newPosts": 15, "newEvents": 3, "newNews": 5 }
  }
}
```

## 🧪 Test It Now!

### Option 1: Test Page (Easiest)
1. Run your dev server: `npm run dev`
2. Visit: **http://localhost:3000/test-email**
3. Enter an email and name
4. Click "Send Welcome Email"

### Option 2: cURL
```bash
curl -X POST http://localhost:3000/api/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","name":"Your Name"}'
```

## 🔑 Environment Variables

Already added to `.env.local`:
```bash
RESEND_API_KEY=re_AK3W3Yf7_mZcHfLezxApotWwAvx4sTiBS
```

## ⚠️ Important: Update Email Address

**For production**, you need to:

1. **Verify your domain** in [Resend](https://resend.com)
2. **Update the `from` address** in these files:
   - `/lib/email.ts` (line 13)
   - `/lib/workflows.ts` (line 21)
   
   Change from:
   ```typescript
   from: 'Bandoxanh <onboarding@resend.dev>'
   ```
   
   To:
   ```typescript
   from: 'Bandoxanh <hello@yourdomain.com>'
   ```

## 📁 Files Created

```
lib/
  ├── email.ts              # Welcome email service
  └── workflows.ts          # Workflow.dev email workflows

app/api/
  ├── send-welcome-email/
  │   └── route.ts          # Manual email endpoint
  └── workflows/
      └── email/
          └── route.ts      # Workflow.dev webhook

app/
  └── test-email/
      └── page.tsx          # Testing page

EMAIL_WORKFLOWS.md          # Full documentation
QUICK_START_EMAIL.md        # This file
```

## 🎨 Email Templates Included

### Welcome Email
- Gradient header with brand colors
- List of platform features
- Call-to-action button
- Mobile responsive
- Vietnamese language

### Weekly Digest
- Summary of activity
- Statistics display
- Link to platform

## 🔄 Workflow.dev Setup (Optional)

For scheduled or triggered emails:

1. Go to [useworkflow.dev](https://useworkflow.dev)
2. Create new workflow
3. Add HTTP Request action:
   - URL: `https://yourdomain.com/api/workflows/email`
   - Method: POST
   - Body: See examples in `EMAIL_WORKFLOWS.md`

### Example Use Cases:
- Weekly digest (every Monday at 9 AM)
- Monthly newsletter
- Event reminders (1 day before)
- Inactive user re-engagement (after 30 days)

## 📊 Monitor Emails

View all sent emails in your [Resend Dashboard](https://resend.com/emails):
- Delivery status
- Open rates
- Click rates
- Bounce/spam reports

## 🐛 Troubleshooting

### Email not sending?
1. Check API key is correct in `.env.local`
2. Restart dev server after adding env variables
3. Check Resend dashboard for errors
4. Verify email address format

### Email goes to spam?
1. Verify your domain in Resend
2. Set up SPF/DKIM/DMARC records
3. Use your verified domain in `from` address

### Workflow.dev not triggering?
1. Check webhook URL is correct
2. Verify payload format matches examples
3. Check your Workflow.dev logs

## 🚀 Next Steps

1. ✅ Test the email functionality
2. ⬜ Verify your domain in Resend
3. ⬜ Update `from` email addresses
4. ⬜ Set up Workflow.dev account (optional)
5. ⬜ Configure scheduled workflows (optional)
6. ⬜ Customize email templates for your brand
7. ⬜ Add more email types (notifications, etc.)

## 💡 Tips

- Use `onboarding@resend.dev` for testing (no verification needed)
- Monitor email analytics in Resend dashboard
- Test emails thoroughly before production
- Consider rate limiting for production webhooks
- Add unsubscribe links for marketing emails

## 📚 Full Documentation

See `EMAIL_WORKFLOWS.md` for complete documentation.

---

**Ready to test?** Visit http://localhost:3000/test-email 🚀
