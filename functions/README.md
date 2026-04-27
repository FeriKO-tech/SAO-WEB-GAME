# SAO Web - Cloud Functions

Serverless backend for the SAO Web portal. Currently ships a single trigger:

| Trigger | Source | Purpose |
|---------|--------|---------|
| `onSupportTicketCreated` | Firestore `supportTickets/{id}` (onCreate) | Fans out a new ticket to Discord + sends a localised auto-reply email via Resend. |

Region: **`europe-central2`** (Warsaw). Runtime: **Node 20**.

---

## Prerequisites

1. **Firebase Blaze plan.** Cloud Functions v2 require pay-as-you-go billing.
   Free tier still covers typical usage (2M invocations / month free).

2. **Discord webhook.** In your Discord server:
   `Server Settings -> Integrations -> Webhooks -> New Webhook`.
   Copy the URL, it looks like:
   `https://discord.com/api/webhooks/<id>/<token>`.

3. **Resend account** (<https://resend.com>) with:
   - An **API key** (`Settings -> API Keys -> Create API Key`).
   - A **verified sending domain** (for production).
     For smoke-testing you can use `onboarding@resend.dev` as the `from`
     address, but real users should see something like
     `support@yourdomain.com`.

---

## Secrets

Secrets are stored in Google Secret Manager, not in the repo. Set them
once per project (you will be prompted to paste each value):

```bash
firebase functions:secrets:set DISCORD_WEBHOOK_URL
firebase functions:secrets:set RESEND_API_KEY
firebase functions:secrets:set RESEND_FROM_EMAIL
```

`RESEND_FROM_EMAIL` can be either a bare address (`support@saoweb.example`)
or a display-name form (`SAO Support <support@saoweb.example>`) - Resend
accepts both.

To verify a secret is set (does **not** print the value):

```bash
firebase functions:secrets:access DISCORD_WEBHOOK_URL
```

To rotate:

```bash
firebase functions:secrets:set DISCORD_WEBHOOK_URL
firebase deploy --only functions   # picks up the new version
```

---

## Deploy

```bash
firebase deploy --only functions
```

The `predeploy` hook in `firebase.json` runs `npm run build` here first,
so you do not need to compile manually.

---

## Local development

```bash
npm install          # once
npm run build        # compiles TS -> lib/
npm run serve        # starts the Firebase emulator suite (functions only)
```

Remember to feed the emulator a ticket document via the Firestore
emulator UI or via `firebase emulators:exec`. The trigger will log to
your terminal.

---

## Logs & debugging

Live tail production logs:

```bash
firebase functions:log --only onSupportTicketCreated
```

Each invocation writes one log line per phase:

- `[support] Discord notification failed` - webhook returned non-2xx.
- `[support] auto-reply email failed` - Resend rejected the payload
  (usually domain not verified or daily quota hit).
- `[support] <TICKET_NUMBER> processed` - final summary with
  `status = 'notified' | 'partial' | 'failed'`.

The ticket document itself is updated with the final `status`,
`discordOk`, `emailOk`, and `notifiedAt` fields - you can inspect
processed tickets directly in the Firestore console.

---

## File layout

```
functions/
├── package.json        # runtime + build deps
├── tsconfig.json       # strict CommonJS output to lib/
├── src/
│   ├── index.ts        # trigger + Discord + email orchestration
│   └── emails.ts       # 8-locale auto-reply templates
└── lib/                # (build output, gitignored)
```

Both `node_modules/` and `lib/` are ignored by Git - they are regenerated
on `npm install` / `npm run build`.

---

## Cost expectations

Assuming a quiet launch (say, 50 tickets/day):

| Item | Free quota | Expected usage | Overage |
|------|-----------|----------------|---------|
| Function invocations | 2M/mo | ~1.5k/mo | $0 |
| Firestore writes | 20k/day | ~150/day | $0 |
| Resend emails | 100/day, 3k/mo | ~50/day | $0 on free tier |
| Discord webhooks | unlimited | - | $0 |

At scale (1k+ tickets/day) Resend's paid tier starts at $20/mo.
