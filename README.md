# MMCOE Smart Attendance Portal

A secure, geo-fenced, rotating QR-based web attendance system built with:

- Next.js 14 (App Router)
- Supabase (Auth + PostgreSQL)
- Tailwind CSS
- Vercel Deployment

---

## 🔐 Core Security Features

- Rotating QR (30-second window HMAC token)
- Geo-fencing (Haversine validation)
- Server-side validation only
- Unique attendance constraint
- IP-based rate limiting
- Full audit logs
- Role-based access control

---

## 👥 Roles

### Student
- Login (must use @mmcoe.edu.in email)
- Scan QR
- View attendance history

### Faculty
- Manage courses
- Start/Stop attendance session
- View attendance summary

### Admin
- View audit logs

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
2. Configure Environment Variables
Copy .env.example to .env.local:

cp .env.example .env.local
Fill in:

Supabase URL

Supabase anon key

Service role key

HMAC secret

3. Run Development Server
npm run dev
Visit:

http://localhost:3000
🗄 Required Database Tables
You must create:

profiles

courses

class_sessions

attendance_records

audit_logs

With proper constraints:

UNIQUE(session_id, student_id)
Enable Row-Level Security (RLS).

☁ Deployment
Deploy to Vercel:

vercel
Add environment variables in Vercel dashboard.

⚠ Important Notes
Service role key must NEVER be exposed to frontend.

Always enforce domain validation for students.

For production scale rate limiting, use Redis.

Use HTTPS in production (required for geolocation).

📌 Production Ready
This project includes:

Strict TypeScript

Secure middleware

Server-side role validation

Audit logging

Responsive design (mobile + desktop)

Scalable architecture

Built for MMCOE.