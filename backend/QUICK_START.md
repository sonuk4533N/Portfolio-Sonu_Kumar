# 🎯 QUICK START - Configure Email in 5 Minutes

## The Problem (FIXED ✅)

Contact form showed "Message sent" but you received **NO EMAILS**.

## The Solution

Added **email sending functionality** using Gmail's App Password.

---

## ⚡ 5-Minute Setup

### Step 1: Get Gmail App Password (2 min)

1. Go to: **https://myaccount.google.com/apppasswords**
2. Select **Mail** → **Windows Computer**
3. Google generates a 16-character password
4. **Copy it** (you'll paste it next)

### Step 2: Update Configuration (1 min)

Open file: `backend/.env`

Replace these lines:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM=your_email@gmail.com
RECIPIENT_EMAIL=your_email@gmail.com
```

With your actual values:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=sonukumar4533n@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM=sonukumar4533n@gmail.com
RECIPIENT_EMAIL=sonukumar4533n@gmail.com
```

**Example:**

- If your Gmail is: `sonukumar4533n@gmail.com`
- And your app password is: `unim ekfb jmfd wbcd`
- Update as shown above (paste the app password as-is)

### Step 3: Install Dependencies (1 min)

```bash
cd backend
npm install
```

### Step 4: Start Server (1 min)

```bash
npm start
```

You should see: `✓ Server running on http://localhost:5000`

---

## ✅ Test It

1. Open your website contact form
2. Fill it out and submit
3. **You should receive 2 emails:**
   - Admin email (with the submission)
   - Confirmation email (to the sender)

**Not receiving?** Check:

- ✓ Spam/Junk folder
- ✓ RECIPIENT_EMAIL is correct in .env
- ✓ Backend console shows no errors

---

## 📝 What Changed

| File                        | Change             |
| --------------------------- | ------------------ |
| `backend/package.json`      | Added nodemailer   |
| `backend/.env`              | Added email config |
| `backend/routes/contact.js` | Now sends emails   |
| `backend/emailService.js`   | NEW email service  |

---

## 🚀 Features Now Working

✅ Admin gets email with contact submission  
✅ Sender gets confirmation email  
✅ HTML-formatted professional emails  
✅ Error handling with database fallback  
✅ Form validation  
✅ XSS protection

---

## ⚠️ Important

- **NEVER share your app password** publicly or commit to git
- App password is different from your actual Gmail password
- If you forget it, you can regenerate it at https://myaccount.google.com/apppasswords

---

## Need Help?

- **Gmail auth error?** → Check you're using App Password (not regular password)
- **Emails not arriving?** → Verify email addresses in .env
- **Server won't start?** → Run `npm install` in backend folder first
- **Detailed guide?** → See `backend/EMAIL_SETUP.md`

---

**You're all set!** 🎉 Your contact form will now send emails.
