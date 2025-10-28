# 📧 Email Troubleshooting Guide - Resend

## 🚨 Issue: Email Shows Success but Not Received

### **Root Cause:**
You're using `onboarding@resend.dev` which is Resend's **test email address**. This address has restrictions:

- ✅ **Will deliver to:** The email address associated with your Resend account
- ❌ **Will NOT deliver to:** Any other email addresses (unless they're in your Audience)

---

## ✅ Quick Solutions

### **Solution 1: Test with Your Resend Account Email**

The easiest way to verify it's working:

1. Send test email to the email you used to create your Resend account
2. Check your inbox (might take 30 seconds to 2 minutes)
3. Check spam folder if not in inbox

**This will work immediately!**

---

### **Solution 2: Add Email to Audience (For Testing)**

To test with other email addresses:

1. **Go to Resend Dashboard:** [resend.com/audiences](https://resend.com/audiences)
2. **Click "Create Audience"** if you don't have one
3. **Add contacts:**
   - Click your audience
   - Click "Add Contact"
   - Enter the email address
   - Click "Save"
4. **The contact will receive a confirmation email** to opt-in
5. **After they confirm**, they'll receive your test emails

**Note:** This is good for testing but not ideal for production.

---

### **Solution 3: Verify Your Domain (Production)**

This is the **proper solution for production**:

#### Step 1: Add Your Domain to Resend

1. Go to [resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `bandoxanh.com`) or subdomain (e.g., `mail.bandoxanh.com`)

#### Step 2: Add DNS Records

Resend will show you DNS records to add. You need to add these to your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare):

**Example records:**
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...

Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all
```

#### Step 3: Wait for Verification

- Usually takes **5-15 minutes**
- Check the status in Resend dashboard
- Green checkmark = verified!

#### Step 4: Update Your Code

Add to `.env.local`:
```bash
RESEND_FROM_EMAIL=Bandoxanh <hello@yourdomain.com>
```

Or directly update the code to use your verified domain.

---

## 🔍 How to Check Email Delivery Status

### **1. Check Resend Dashboard**

Go to [resend.com/emails](https://resend.com/emails)

You'll see each email with status:
- 🟢 **Delivered** - Email was delivered successfully
- 🟡 **Queued** - Email is being sent
- 🔴 **Failed** - Email failed to send
- ⚪ **Pending** - Waiting to be sent

**Click on an email** to see detailed logs:
- Recipient
- Subject
- Delivery status
- Timestamps
- Error messages (if any)

### **2. Check Email Logs**

In the email detail page, you can see:
- **Events:** Sent, Delivered, Opened, Clicked, Bounced
- **Timeline:** When each event occurred
- **Errors:** If delivery failed, why it failed

---

## 🧪 Testing Email Delivery

### **Test 1: Send to Your Resend Account Email**

```bash
curl -X POST http://localhost:3000/api/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-resend-account@email.com",
    "name": "Test User"
  }'
```

**Expected:** Email arrives within 1-2 minutes

### **Test 2: Check Resend Logs**

1. Go to [resend.com/emails](https://resend.com/emails)
2. Find your test email
3. Check status:
   - If "Delivered" but not in inbox → Check spam
   - If "Failed" → Check error message
   - If "Pending" → Wait a few minutes

### **Test 3: Send to Audience Contact**

After adding email to audience:

```bash
curl -X POST http://localhost:3000/api/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "audience-contact@email.com",
    "name": "Test User"
  }'
```

---

## 📊 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Email not received | Using `onboarding@resend.dev` with non-account email | Send to Resend account email or add to Audience |
| Shows success but no email | Restriction on test email address | Verify your domain |
| Email in spam | Sender reputation low | Use verified domain with SPF/DKIM |
| "API key invalid" error | Wrong API key | Check `RESEND_API_KEY` in `.env.local` |
| Email delayed | Resend processing queue | Wait 2-5 minutes, check dashboard |

---

## 🎯 Recommendations

### **For Development/Testing:**
- ✅ Send to your Resend account email
- ✅ Add test emails to Audience
- ✅ Use `onboarding@resend.dev` (with limitations)

### **For Production:**
- ✅ **Verify your domain** (essential!)
- ✅ Set up SPF, DKIM, DMARC records
- ✅ Use your domain in `from` address
- ✅ Monitor delivery rates in dashboard
- ✅ Add unsubscribe link for marketing emails

---

## 🔧 Update Email Configuration

I've updated your code to support environment variable for the `from` address:

Add to `.env.local`:
```bash
# Optional: Use your verified domain
RESEND_FROM_EMAIL=Bandoxanh <hello@yourdomain.com>
```

If not set, it defaults to `onboarding@resend.dev`

---

## 📞 Still Not Working?

1. **Check Resend Status:** [resend.com/status](https://resend.com/status)
2. **Check API Logs:** In Resend dashboard → Emails
3. **Check Spam Folder:** Emails might be filtered
4. **Wait 5 Minutes:** Sometimes delivery is delayed
5. **Contact Resend Support:** If nothing works

---

## ✅ Quick Checklist

Before asking "why no email":

- [ ] Is the recipient your Resend account email?
- [ ] Is the recipient in your Audience (and confirmed)?
- [ ] Is your domain verified in Resend?
- [ ] Did you check the Resend dashboard logs?
- [ ] Did you check spam folder?
- [ ] Did you wait at least 2-5 minutes?
- [ ] Is `RESEND_API_KEY` correct in `.env.local`?

---

## 🚀 Next Steps for You

**Right Now:**
1. Send a test email to the email address you used for your Resend account
2. Check if it arrives (should work immediately)
3. This confirms everything is working!

**For Production:**
1. Verify your domain in Resend
2. Update `RESEND_FROM_EMAIL` environment variable
3. Test again with any email address
4. Deploy to Vercel with updated config

---

**TL;DR:** `onboarding@resend.dev` only delivers to your Resend account email. Either test with that email, add recipients to your Audience, or verify your domain for unrestricted sending.
