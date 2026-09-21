# Recrutini

HR services platform: CV optimization, LinkedIn optimization, mock interviews and the full pack.
Public site with booking for visitors, private dashboard for the admin.

Built with Next.js 16 (App Router), Prisma and Neon Postgres, in English and French (`/` and `/fr`). Deploys to Vercel.

## What it does

**Visitor (no account needed)**

- Landing page with the four packs.
- `/book` — choose a pack, pick a date and time for the interview (real availability, taken slots
  greyed out, minimum notice enforced), choose EN or FR, leave contact details, CV link, LinkedIn,
  job posting and notes.
- Gets a reference code, for example `RC-ABC-234`.
- `/status/RC-ABC-234` — live state of their file: payment status, session date, meeting link once
  confirmed, and the feedback report once published.

**Admin (that's you)**

- `/admin/login` — email and password from environment variables.
- `/admin/orders` — every order and booking, filters for awaiting payment / upcoming sessions /
  in progress / delivered, one-click **Mark paid** (which also confirms the session).
- `/admin/orders/<id>` — full detail, change status and payment, internal notes, move or cancel a
  session, add the meeting link, and write the feedback report (five competency scores, what landed
  well, what to fix, a rewritten answer, links to the recording and PDF). Publishing the report makes
  it visible on the client's status page.
- `/admin/schedule` — weekly availability per day, how far ahead slots are visible, minimum notice,
  blocked days, and the payment instructions shown to clients.

Payment is offline: bank transfer, D17 or cash. Nothing is charged online; you mark orders as paid.

## Deploying to Vercel

1. **Create the database.** In the Vercel dashboard, go to **Storage → Create Database → Neon
   (Postgres)** and attach it to this project. Vercel injects `DATABASE_URL` and the other Neon
   variables automatically. Add `DIRECT_URL` yourself, set to the **unpooled** connection string Neon
   shows (same URL without `-pooler`).

2. **Set the remaining environment variables** in Project → Settings → Environment Variables:

   | Variable         | Value                                                        |
   | ---------------- | ------------------------------------------------------------ |
   | `DATABASE_URL`   | Neon pooled connection string (usually set by the integration) |
   | `DIRECT_URL`     | Neon unpooled connection string                              |
   | `ADMIN_EMAIL`    | your login email                                             |
   | `ADMIN_PASSWORD` | a long password you choose                                   |
   | `AUTH_SECRET`    | random string, `openssl rand -base64 32`                     |

3. **Deploy.** Import the repository into Vercel and deploy. The build runs `prisma generate`
   automatically.

4. **Create the tables.** Once, from your machine with the same `DATABASE_URL` and `DIRECT_URL` in a
   local `.env`:

   ```bash
   npm install
   npx prisma db push
   ```

5. Open `/admin/login`, sign in, and set your availability under **Availability & payment**.

## Running locally

```bash
cp .env.example .env      # fill in the values
npm install
npx prisma db push
npm run dev               # http://localhost:3000
```

## Notes

- All times are handled in `Africa/Tunis`.
- Reference codes use an unambiguous alphabet (no I, O, 0, 1) so they are easy to read over the phone.
- Prices live in `src/lib/brand.ts`. Change them there and they update on the site and in new orders.
- There is no email sending yet. When you want confirmation emails, Resend plugs into the
  `submitBooking` and `markPaid` actions in about twenty lines.

## Running locally

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL, DIRECT_URL, ADMIN_*, AUTH_SECRET
npx prisma migrate deploy   # or `npx prisma db push` on a fresh database
npm run dev
```

Every secret lives in environment variables; see `.env.example` for the full list (database, admin
login, session secret, Gmail or Resend for transactional email, `CRON_SECRET`, optional
`NEXT_PUBLIC_WHATSAPP` and `NEXT_PUBLIC_GSC_VERIFICATION`). Nothing sensitive is committed.
