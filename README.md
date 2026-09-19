# Shiva Build Mart — Customer App

A separate, mobile-first Progressive Web App (PWA) for customers — same
brand look as the website, but a native-app-style experience with bottom
tab navigation (Home, Categories, Search, Cart, Profile).

It uses the exact same backend as the main website (same products, same
cart, same orders — everything stays in sync automatically).

## Screens
- Home — hero banner, category shortcuts, featured products
- Categories → Shop (filter chips) → Product Detail (variants, accordions,
  reviews, sticky Add to Cart/Buy Now)
- Search
- Cart
- Checkout — 3-step (Address → Payment → Confirm) with order success screen
- Login / Register (OTP) / Forgot / Reset Password
- Profile menu → My Orders (list + detail with cancel, delivery partner
  contact, reviews, invoice download), Address Book, Payment Methods (info),
  Wishlist, Help & Support (with contact form), About Us, Settings (profile,
  GST/business details, change password, logout)

## What's NOT included (matches what the backend actually supports)
- Saved payment cards — the backend doesn't store these; "Payment Methods"
  is an info screen, and the actual method is chosen at checkout each time.
- Writing a review from the product page — same as the main website, this
  only happens from a delivered order in My Orders (keeps reviews genuine).

## 1. Local setup
```bash
npm install
cp .env.example .env
```
Edit `.env` so `VITE_API_URL` points at your live backend:
```
VITE_API_URL=https://shiva-furniture-house-backend.onrender.com/api
```
Run locally:
```bash
npm run dev
```

## 2. Deploy it (needs a real HTTPS URL before it can become an APK)
Deploy as its own separate Vercel project (same pattern as the main
frontend and the delivery app):
1. Push this folder to its own GitHub repo (or a subfolder in an existing one).
2. Vercel → "Add New Project" → import this repo.
3. Set the environment variable `VITE_API_URL` in Vercel's project settings.
4. Deploy — you'll get a URL like `shiva-customer.vercel.app`.

**Backend CORS change needed:** your backend currently only allows ONE
frontend origin (`CLIENT_URL` env var). Once you have URLs for the main
website, the delivery app, AND this customer app, the backend needs to
allow all of them. Let me know the URLs once deployed and I'll update
`server.js`'s CORS config to accept multiple origins in one line.

## 3. Turn it into an installable APK
1. Go to **https://pwabuilder.com**
2. Enter your deployed URL, click "Start" — it'll detect the manifest and
   service worker already set up in this project.
3. "Package for Stores" → **Android** → download the `.apk`.
4. Install manually on a phone (same as the delivery app) — allow "install
   from unknown sources" once when prompted.

## Replace the icons
`public/icons/icon-192.png` and `icon-512.png` are placeholder icons (a
simple "S" monogram in your brand colors). Swap in your real logo at the
same filenames/sizes before generating the APK.

## Design
Same brand palette as your website (espresso/clay/sand/ivory, Fraunces +
Inter fonts) — this should feel like a natural extension of the site, not
a different product. Bottom tab bar and full-screen flows for checkout/
product detail, built to match the reference mockup you shared.
