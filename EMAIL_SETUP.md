# Email Setup Guide

## Gmail SMTP Configuration

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication

### 2. Generate App Password
- Go to Google Account > Security > 2-Step Verification
- Scroll down to "App passwords"
- Select "Mail" and your device
- Copy the generated 16-character password

### 3. Update .env file
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
FRONTEND_URL=http://localhost:3001
```

### 4. Test Email Functionality
1. Start the backend server: `npm run dev`
2. Use Postman or frontend to test forgot password
3. Check your email for the reset link

## API Endpoints

### Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "newpassword123"
}
```

## Frontend Routes
- `/reset-password/:token` - Reset password form
- Forgot password form integrated in login page