# Rivka Invoice Generator

A Next.js application for generating Hebrew invoices for Rivka Colman's business.

## Features

- Simple form interface to input client name and amount
- Generates professional PDF invoices in Hebrew
- Auto-incrementing invoice numbers starting from 80003
- Fully responsive design
- Ready for Vercel deployment

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Vercel KV:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Storage → KV
   - Create a new KV database
   - Copy the environment variables to `.env.local`

3. Create `.env.local` file (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
```

4. Add your Vercel KV credentials to `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. Deploy to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js
   - Add your KV environment variables in the project settings
   - Deploy!

3. The KV database will be automatically connected when deploying from Vercel dashboard

## Usage

1. Enter the client name
2. Enter the service amount
3. Click "צור קבלה" (Create Invoice)
4. The PDF invoice will be automatically downloaded

## Business Information

The invoices include the following fixed information:
- Owner: רבקה תמר קולמן (Rivka Tamar Colman)
- Osek Pator: 209643832
- Address: הוחזה 16 מרכז שפירא
- Phone: +972585052814

Note: Customer name appears prominently in the invoice header.
