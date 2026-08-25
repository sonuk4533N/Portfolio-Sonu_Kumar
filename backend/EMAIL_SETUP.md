# Email Configuration Setup

## Overview

The contact form now sends emails when submissions are received. Follow these steps to configure it.

## For Gmail Users

### Step 1: Enable 2-Factor Authentication (if not already enabled)

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left menu
3. Enable **2-Step Verification** if not already enabled

### Step 2: Create an App Password

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Windows Computer** (or your device)
3. Google will generate a 16-character password
4. **Copy this password** - you'll need it for the .env file

### Step 3: Update .env file

Open `backend/.env` and update these fields:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # Your 16-character app password (remove spaces when pasting)
EMAIL_FROM=your_email@gmail.com
RECIPIENT_EMAIL=your_email@gmail.com  # Where you want to receive contact form submissions
```

### Step 4: Install Dependencies

Run this in the `backend` folder:

```bash
npm install
```

### Step 5: Test the Setup

1. Start the backend server: `npm start`
2. Fill out the contact form on your website
3. Check both:
   - Your email inbox (RECIPIENT_EMAIL) for the submission
   - The sender's inbox for the confirmation email

## For Other Email Services

Update the .env file with your provider:

### Gmail

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Outlook/Hotmail

```env
EMAIL_SERVICE=outlook
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

### Custom SMTP

```env
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password
EMAIL_SECURE=false  # Set to true for port 465
```

Then update `emailService.js` to use custom SMTP settings.

## Troubleshooting

- **"Authentication failed"** → Check your email and password are correct
- **"Gmail security warning"** → Enable 2FA and use App Passwords instead of regular password
- **"No emails received"** → Check spam/junk folder, verify RECIPIENT_EMAIL is correct
- **"Message saved but email failed"** → Check backend console for error details

## Database Storage

Even if email sending fails, all contact messages are saved to the SQLite database in `backend/database.sqlite`. You can view them through the admin panel.

---

**Important:** Never commit the `.env` file with real credentials to version control!
