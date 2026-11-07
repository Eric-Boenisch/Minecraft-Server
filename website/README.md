This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication configuration

The login and dashboard use `JWT_SECRET` to sign and verify authentication tokens. Set it in `website/.env.local` (the `website` directory is the Next.js project root):

```text
JWT_SECRET=your-long-random-secret
```

Generate a strong value with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and restart the Next.js server after changing the file. For deployments, configure `JWT_SECRET` as a server-side environment variable. Do not commit the secret.

## PayPal-Guthaben

The dashboard opens the fixed 5.00 EUR checkout inside its recharge dialog. The signed-in Minecraft username is attached to the PayPal order on the server; the browser cannot choose another account or amount. The balance is credited only after PayPal's `PAYMENT.CAPTURE.COMPLETED` webhook is signature-verified. Processed capture IDs are stored in the hidden `PayPalPayments` worksheet in the existing workbook to prevent duplicate credits.

Set these variables in `website/.env.local` for local testing, or in the deployment's server environment. Do not commit the file or expose the server-side values:

```text
# TODO: PayPal Dashboard > Apps & Credentials > Sandbox (or Live) > Client ID
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_CLIENT_ID=your-sandbox-client-id

# TODO: PayPal Dashboard > Apps & Credentials > Sandbox (or Live) > Secret
PAYPAL_CLIENT_SECRET=your-sandbox-secret

# TODO: PayPal Dashboard > Webhooks > webhook ID for this app and environment
PAYPAL_WEBHOOK_ID=your-sandbox-webhook-id

# TODO: Sandbox for tests; switch to Live when using Live credentials
PAYPAL_API_BASE_URL=https://api-m.sandbox.paypal.com
```

In the PayPal Developer Dashboard, create a webhook for the same Sandbox/Live app and subscribe to `PAYMENT.CAPTURE.COMPLETED`. Set its URL to `https://YOUR_PUBLIC_HOST/api/paypal` (for local testing, `https://YOUR_NGROK_HOST/api/paypal`) and copy that webhook's ID into `PAYPAL_WEBHOOK_ID`. The checkout page also needs the public `NEXT_PUBLIC_PAYPAL_CLIENT_ID`; the API uses `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` from the same environment. Restart the local server after changing `.env.local`.

The order and capture APIs are `/api/paypal/order` and `/api/paypal/capture`. The webhook URL is `/api/paypal`. PayPal cannot reach `localhost`; use an HTTPS tunnel such as ngrok for local webhook testing.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
