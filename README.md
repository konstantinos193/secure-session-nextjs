<div align="center">

# 🔐 Secure Session Next.js

**Minimal, correct session & cookie handling for Next.js — without SaaS fluff.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![JWT](https://img.shields.io/badge/JWT-JSON%20Web%20Tokens-000000?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)

</div>

---

A reference implementation showing the right way to handle authentication sessions in Next.js. Because most tutorials get it wrong, and getting it wrong means security vulnerabilities.

### 🛠️ Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-2A2A2A?style=flat-square&logo=bcrypt&logoColor=white)

</div>

---

## 📋 What This Is (and Isn't)

**What it is:**

- ✅ A reference implementation showing correct session handling patterns
- ✅ Minimal code that demonstrates security best practices
- ✅ A learning resource for understanding secure authentication
- ✅ Working code you can study, adapt, and learn from

**What it is not:**

- ❌ A full starter kit or boilerplate
- ❌ A production-ready authentication system (it's intentionally incomplete)
- ❌ A tutorial or course (it's code, not explanations)
- ❌ A framework or library (it's an example, not a dependency)
- ❌ A magic solution (security requires understanding, not copy-paste)

This is intentionally minimal. Because complexity is the enemy of security, and the more features you add, the more places things can go wrong. This shows the pattern once, correctly.

## 👥 Who This Is For

This is for developers who:

- 🎯 Want to understand how secure session handling actually works
- 😤 Are tired of tutorials that show localStorage for sessions (which is wrong)
- 📚 Need a reference for implementing authentication correctly
- 🔨 Are building their own auth system and want to see the right patterns
- 🛡️ Want to learn security best practices, not just make things work

This is not for developers who:

- 🔌 Want a drop-in authentication solution (use NextAuth.js or Clerk instead)
- 🚀 Need a full production system immediately (this is a reference, not a product)
- 📋 Want to copy-paste without understanding (that's how you create vulnerabilities)
- 💼 Are looking for a complete SaaS starter (this is just auth, nothing else)

## ⚠️ What Problem It Solves

Most Next.js auth tutorials and examples get the fundamentals wrong. They show you how to make authentication work, but not how to make it secure. And if authentication isn't secure, you don't have authentication—you have a security vulnerability.

Common problems in tutorials and production code:

- 🚨 **Storing sessions in localStorage** (XSS vulnerable). Because if JavaScript can read your session token, so can any XSS attack, and XSS attacks are everywhere.
- 🚨 **Missing HttpOnly flags** (XSS vulnerable). Because cookies without HttpOnly can be accessed by JavaScript, which defeats the purpose of using cookies for security.
- 🚨 **Wrong SameSite settings** (CSRF vulnerable). Because SameSite=None without Secure is broken, and SameSite=Strict breaks legitimate use cases.
- 🚨 **No session expiration** (security nightmare). Because sessions that never expire are a security vulnerability waiting to happen.
- 🚨 **Overcomplicated abstractions** (hard to understand). Because complexity is the enemy of security, and the more layers you add, the more places things can go wrong.

This repo shows the minimal correct pattern. You can see how it works, understand why each decision was made, and adapt it to your needs. Because seeing the correct pattern is how you learn to implement it yourself.

If you need production-ready features or want to see what else I'm building, check out [my Gumroad profile →](https://konstantinos193.gumroad.com/)

---

## 🏗️ High-Level Architecture

This section explains the architecture without diving into code. Because understanding the structure is how you know what to change.

**📁 App Router Structure:** Uses Next.js 14+ App Router. Routes are in the `app/` directory. API routes are in `app/api/`. Pages are in `app/[route]/page.tsx`. This is standard Next.js structure, not custom.

**🔐 Session Management:** Sessions are stored as signed JWTs in HttpOnly cookies. JWTs are stateless (until they're not), which means no database lookups for session validation. The tradeoff is that we can't revoke sessions without tracking them. For most applications, this is acceptable.

**🔄 Authentication Flow:** Users log in via `/api/auth/login`, which validates credentials and creates a session cookie. The cookie is HttpOnly, Secure (in production), and SameSite=Lax. This prevents XSS, ensures HTTPS-only transmission, and protects against CSRF attacks.

**🛡️ Route Protection:** Middleware runs on every request (except static files) and checks for valid sessions. If no session exists, users are redirected to login. If a session exists but is invalid or expired, the cookie is deleted and the user is redirected to login.

**👥 Role-Based Access Control:** Simple role checking (user/admin). Admin routes check the role in middleware and redirect non-admins. This is basic RBAC—enough for most applications, but not enough for complex permission systems.

**💾 User Store:** In-memory array for demonstration. In production, replace with a database. Because in-memory stores don't persist, and users tend to expect their accounts to still exist after you restart the server.

## ✨ What's Included

This implementation includes the minimal set of features needed for secure session handling:

- 🔑 **Login / logout functionality.** Because users need a way to authenticate and end their sessions. Login validates credentials and creates secure session cookies. Logout deletes the session cookie.

- 🍪 **Session cookies with HttpOnly, Secure, and SameSite flags.** Because these flags are not optional—they're the foundation of cookie security. HttpOnly prevents XSS, Secure ensures HTTPS-only, SameSite prevents CSRF.

- 🛡️ **Middleware route protection.** Because checking authentication on every request is how you ensure security. If we only checked sometimes, attackers would find the times we don't. Middleware runs before pages render, ensuring unauthenticated users can't access protected content.

- ⏰ **Session expiration.** Because sessions that never expire are a security nightmare. If a session is compromised, it remains valid forever. With expiration, compromised sessions eventually become useless. Sessions expire after 7 days.

- 👥 **Simple role-based access control (user/admin).** Because not all users should have access to everything. Admin routes check the role in middleware and redirect non-admins. This is basic RBAC—enough for most applications.

- 🔒 **Password hashing with bcrypt.** Because storing plaintext passwords is how you become a cautionary tale. Bcrypt is slow by design, which makes brute force attacks expensive.

- 🔇 **Generic error messages.** Because telling attackers which emails exist in your system is like giving them a roadmap to your users. We use the same error message for "user not found" and "wrong password" to prevent user enumeration attacks.

- 🎫 **JWT session tokens.** Because JWTs are stateless and don't require database lookups. The tradeoff is that we can't revoke sessions without tracking them. For most applications, this is acceptable.

## ❌ What's Intentionally Not Included

This is intentionally incomplete. It's a reference, not a production-ready system. Because if it tried to do everything, it would be too complex to understand.

The following are explicitly not included:

- 💳 **Stripe integration.** Because billing is a separate concern, and this is about authentication. Adding billing would add complexity without teaching anything about sessions.

- 📊 **Dashboards.** Because dashboards are application-specific, and this is a reference implementation. Adding a dashboard would distract from the core authentication patterns.

- 🏢 **Teams / multi-tenancy.** Because multi-tenancy adds complexity, and this is about the basics. If you need multi-tenancy, add it after understanding the basics.

- 🔄 **Token rotation.** Because token rotation adds complexity, and this is about the basics. If you need session rotation, add it after understanding the basics.

- 🔐 **Advanced RBAC.** Because advanced RBAC adds complexity, and this is about the basics. Simple role checks are enough for most applications. If you need permissions, roles, and resources, add it after understanding the basics.

- 🧪 **Tests.** Because tests are important, but this is a reference implementation, not a production system. If you're using this in production, add tests. Because untested code is broken code.

- 🗄️ **Database.** Because this uses an in-memory store for demonstration. In production, replace it with a database. Because in-memory stores don't persist, and users tend to expect their accounts to still exist after you restart the server.

- 🚦 **Rate limiting.** Because rate limiting is important, but this is about the basics. If you're using this in production, add rate limiting. Because brute force attacks are real, and unlimited login attempts are a security vulnerability.

- 🛡️ **CSRF tokens.** Because we rely on SameSite cookies for CSRF protection. For additional defense, you can add CSRF tokens. This is especially important for state-changing operations.

- 📧 **Email verification.** Because email verification is important, but this is about the basics. If you need email verification, add it after understanding the basics.

- 🔑 **Password reset.** Because password reset is important, but this is about the basics. If you need password reset, add it after understanding the basics.

If you need these features, you can add them. But understand the basics first. Because adding features without understanding the foundation is how you create security vulnerabilities.

## 🚀 Setup (Quick Start)

Get this running before you start building features. Should take about 5 minutes if everything goes right.

### 📋 Prerequisites

- 📦 Node.js 18+ installed (check with `node --version`)
- 📦 npm or yarn (because you need a package manager)

### ⚙️ Installation

1. **📥 Install dependencies:**
   ```bash
   npm install
   ```
   This installs everything. It might take a minute, but that's normal.

2. **🔐 Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   SESSION_SECRET="your-secret-key-here"
   ```
   Generate a secure secret with: `openssl rand -base64 32`
   
   ⚠️ Don't use "dev-secret-change-in-production" in production. That's how you get hacked.

3. **▶️ Start the development server:**
   ```bash
   npm run dev
   ```

4. **🌐 Open [http://localhost:3000](http://localhost:3000)**

You should see the home page. If you don't, check the terminal for errors. Most issues are environment variables or missing dependencies.

### 🔑 Demo Credentials

For testing purposes, the demo includes two users:

- 👤 **User account:** `user@example.com` / `password`
- 👨‍💼 **Admin account:** `admin@example.com` / `admin`

These are hardcoded for demonstration. In production, replace the in-memory user store with a database. Because hardcoding users is how you become a cautionary tale.

## 🔧 Common Issues / Gotchas

Common problems and how to fix them. Because things go wrong, and knowing how to fix them saves time.

**🍪 Sessions not persisting:** Check that cookies are being set. Open browser dev tools, go to Application > Cookies, and verify the session cookie exists. If it doesn't, check that the Secure flag isn't set in development (it should only be set in production). Also verify that SESSION_SECRET is set in your environment variables.

**⚙️ Middleware not running:** Check that the middleware file is in the root directory and exports a default function. Next.js middleware must be in the root directory, not in a subdirectory. The file must be named `middleware.ts` (or `middleware.js`).

**🔑 Login not working:** Check that the SESSION_SECRET environment variable is set. Without it, JWT signing won't work, and sessions won't be created. Also check that the password you're using matches the demo credentials (or your database if you've replaced the in-memory store).

**👥 Admin routes accessible to regular users:** Check that the middleware is checking roles correctly. The middleware should check `session.role !== 'admin'` before allowing access to admin routes. Also verify that the role is being set correctly when creating sessions.

**📝 TypeScript errors:** Run `npm install` to ensure all dependencies are installed. TypeScript errors are usually missing type definitions. If errors persist, check that you're using Node.js 18+ and that all dependencies are compatible.

**🍪 Cookies not being sent:** Check that you're using HTTPS in production (the Secure flag requires HTTPS). In development, the Secure flag should be false. Also check that SameSite is set correctly—Strict can break legitimate use cases, None requires Secure.

**⏰ Sessions expiring immediately:** Check that the expiration time is being set correctly. The expiration should be a timestamp in the future. Also verify that the system clock is correct (incorrect system time can cause expiration issues).

## 🎨 Customization Guide

This section explains how to customize the implementation. Because this is a reference, not a product, you'll need to adapt it to your needs.

**🗄️ Adding a database:** Replace the in-memory user store in `lib/auth.ts` with database queries. Use Prisma, TypeORM, or your preferred ORM. Don't forget to hash passwords before storing them. Because storing plaintext passwords is how you become a cautionary tale.

**⏰ Changing session expiration:** Modify `SESSION_MAX_AGE` in `lib/session.ts`. Shorter is more secure, longer is more convenient. Find the balance that works for your application. Remember that compromised sessions remain valid until expiration.

**👥 Adding more roles:** Extend the role type in `lib/session.ts` and `lib/auth.ts`. Update the middleware to check for the new roles. Don't forget to update the database schema if you're using a database.

**🍪 Changing cookie settings:** Modify the cookie options in `app/api/auth/login/route.ts`. Be careful—changing security settings can create vulnerabilities. Understand what each option does before changing it.

**🚦 Adding rate limiting:** Add rate limiting middleware or use a service like Cloudflare. Rate limiting prevents brute force attacks. Without it, attackers can make unlimited login attempts.

**🛡️ Adding CSRF tokens:** Implement CSRF token generation and validation. SameSite cookies provide basic CSRF protection, but CSRF tokens add additional defense. This is especially important for state-changing operations.

**🗑️ Removing features:** If you don't need something, remove it. Less code means fewer places for bugs to hide. But understand what you're removing and why it exists before removing it.

**📧 Adding email verification:** Add email verification after registration. Send verification emails using a service like Resend or SendGrid. Store verification status in your database and check it during login.

**🔑 Adding password reset:** Implement password reset flow. Generate secure reset tokens, send reset emails, and validate tokens before allowing password changes. Don't forget to expire reset tokens.

## 🚢 Deployment Notes

This section covers deployment considerations. Because development and production are different, and the differences matter.

**🔐 Environment variables:** Set `SESSION_SECRET` in your production environment. Generate it with `openssl rand -base64 32`. Don't use the default or commit it to version control. Because default secrets are how you get hacked.

**🔒 HTTPS:** Always use HTTPS in production. The Secure cookie flag requires HTTPS. Without HTTPS, cookies won't be sent, and authentication won't work. Most hosting platforms (Vercel, Netlify, etc.) provide HTTPS by default.

**🗄️ Database:** Replace the in-memory user store with a database. Use a managed database service (Supabase, PlanetScale, etc.) or self-host. Don't forget to set up connection pooling and backups.

**🔑 Session secret:** Use a strong, random secret for `SESSION_SECRET`. Don't reuse secrets across environments. If a secret is compromised, rotate it immediately and invalidate all existing sessions.

**⚠️ Error handling:** Don't expose detailed error messages to clients. Log errors server-side, but return generic messages to clients. Because detailed error messages help attackers.

**📊 Monitoring:** Set up monitoring for authentication events. Track failed login attempts, session creation, and unusual patterns. Because detecting attacks early is how you prevent breaches.

**🚦 Rate limiting:** Add rate limiting in production. Use middleware or a service like Cloudflare. Rate limiting prevents brute force attacks. Without it, attackers can make unlimited login attempts.

**💾 Backup and recovery:** Set up database backups. Test your backup and recovery process. Because data loss happens, and being prepared is better than being sorry.

## 📜 License & Usage

**📄 License:** MIT. Use it however you want. Because this is a reference implementation, not a product.

**✅ Allowed uses:**
- ✅ Use in your own projects (personal or commercial)
- ✅ Modify and adapt to your needs
- ✅ Study and learn from the code
- ✅ Share with your team

**❌ Not allowed uses:**
- ❌ Don't claim you wrote it (give credit where credit is due)
- ❌ Don't sell it as your own product (it's a reference, not a product)

**📦 Redistribution:** You can redistribute this code, but include the license. Because the license matters, and including it is the right thing to do.

## 💭 Philosophy

This section explains the philosophy behind this implementation. Because understanding the why is as important as understanding the how.

**🎯 Opinionated by design:** This implementation makes specific choices (JWT over database sessions, SameSite=Lax over Strict, etc.). These choices have tradeoffs. Understand the tradeoffs before changing them. Because changing security settings without understanding the implications is how you create vulnerabilities.

**📚 Boring over clever:** This implementation uses standard patterns, not clever hacks. Standard patterns are easier to understand, maintain, and secure. Because clever code is hard to understand, and hard-to-understand code is hard to secure.

**🎛️ Control over convenience:** This implementation gives you control over the authentication flow. You can see how it works, understand why each decision was made, and adapt it to your needs. Because understanding your authentication system is how you know it's secure.

**🎨 Minimal over complete:** This implementation is intentionally minimal. It shows the pattern once, correctly. You can add features as needed. Because complexity is the enemy of security, and the more features you add, the more places things can go wrong.

**🛡️ Security over convenience:** This implementation prioritizes security over convenience. Sessions expire, cookies are HttpOnly, and errors are generic. These choices make the system more secure, even if they're slightly less convenient. Because security is not optional, and convenience is not worth compromising security.

**📖 Learning over copy-paste:** This implementation is meant to be studied, not copied blindly. Understand how it works before using it. Because copy-pasting code without understanding is how you create vulnerabilities.
