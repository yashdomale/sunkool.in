# Blog CMS setup

The blog at `/blog` and the admin dashboard at `/admin` are backed by Supabase
(Postgres + Auth + Storage). Without the public Supabase environment variables,
the public blog serves the 13 bundled original articles recovered from the
live website, with local copies of their images. The admin dashboard
and publishing require a connected project. Once configured, public pages use
the database as their source of truth.

## 1. Create/choose a Supabase project

Use an existing project or create a new one at supabase.com. Note its
**Project URL** and **anon public key** from Project Settings → API.

## 2. Run the migrations

In the Supabase SQL Editor, run the files in `supabase/migrations/` **in
order** (0001 → 0007). Each is idempotent-ish but not designed to be re-run
after partial success — run them once, in sequence, on a fresh project. On an
existing project that already has 0001–0005, run only the new ones (0006 and
0007) — see "Blog data" below.

- `0001_blog_schema.sql` — tables (`categories`, `authors`, `admins`, `posts`)
- `0002_blog_functions_triggers.sql` — `updated_at`/`published_at` triggers, the `increment_post_views` RPC
- `0003_blog_rls.sql` — Row Level Security policies (public read of published posts, admin-only writes)
- `0004_blog_storage.sql` — creates the public `blog-images` Storage bucket + its policies
- `0005_blog_seed.sql` — migrates the two posts that used to live in `content/blog/*.mdx` into the database, at the same slugs
- `0006_blog_leads.sql` — the `blog_leads` table (what the form under each blog post collects), its constraints and indexes
- `0007_blog_leads_security.sql` — Row Level Security and grants for `blog_leads`, and the public `submit_blog_lead()` function the form calls
- `0010_chatbot_leads.sql` — the SUNKOOL Assistant chatbot's leads: `blog_leads.lead_source`, and the public `submit_chatbot_lead()` function (see "SUNKOOL Assistant (chatbot)" below). There is no 0009.
- `0011_announcements.sql` — the `announcements` table (Row Level Security: public read of published rows, admin-only writes) behind Admin > Updates and the announcements on the public Updates page (`/blog`). Optional: until it has run, Admin > Updates shows a setup notice and the public page simply shows no announcements.

If you're using the Supabase CLI instead of the dashboard, `supabase db push`
applies them in the same order.

## 3. Set environment variables

Copy `.env.example` to `.env.local` and fill in the two values from step 1:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

`NEXT_PUBLIC_SUPABASE_URL` is also read at **build time** (in `next.config.ts`)
to allow `next/image` to optimize images uploaded to the `blog-images`
bucket — set it before running `npm run build`, not just at runtime.

On Vercel, add both under Project Settings → Environment Variables for all
environments (Production/Preview/Development), then redeploy.

## 4. Create your first admin user

There's no public sign-up — admins are provisioned manually:

1. Supabase Dashboard → Authentication → Users → **Add user** (email + password, or send an invite).
2. Copy that user's UUID.
3. In the SQL Editor:
   ```sql
   insert into admins (id) values ('paste-the-uuid-here');
   ```

That account can now sign in at `/admin/login`. Repeat step 4 for any
additional admin.

## 5. Verify

- Visit `/blog` — the two migrated posts should appear.
- Sign in at `/admin/login`, create a post, publish it, confirm it appears at `/blog` and its own `/blog/[slug]` page with correct metadata (view page source for the `BlogPosting` JSON-LD).
- Confirm `/admin` redirects to `/admin/login` when signed out.
- Confirm a draft post's `/blog/[slug]` page 404s when signed out.

## Blog data

Every published post ends with a short enquiry form: name, contact number,
city and product (a dropdown of every product in `src/lib/products.ts`).
Submissions are saved in `blog_leads` and listed at **Admin → Blog Data**
(`/admin/blog-data`, right below Authors): name, contact no., city, product, the
blog it came from and the date, newest first. The page has no filters or search.

- **Run migrations 0006 and 0007 before (or right after) deploying.** Until they
  are applied the form shows a friendly "couldn't send" message instead of
  storing anything, and the Blog Data page shows these same setup steps.
- **No new environment variables.** The form uses the same
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`; there is no
  service-role key anywhere in the app. Visitors can only call
  `submit_blog_lead()` — they have no access to the table itself — and only
  users in the `admins` table can read the data.
- The product list follows the catalogue: add a product to
  `src/lib/products.ts` and it appears in the form automatically.
- Abuse protection built in: a hidden honeypot field, duplicate-submission
  protection (double clicks, retries, the same enquiry sent again within 10
  minutes) and a limit of 5 enquiries per phone number per hour. For heavier
  traffic, add Vercel's WAF rate limiting or a CAPTCHA in front of the form.

## SUNKOOL Assistant (chatbot)

A round SK button sits above the WhatsApp button on every public page and opens a
chat window above both (full screen on phones). There is **no AI model and no API
key** behind it: it is a short scripted flow. Zoho SalesIQ is no longer loaded (its
two `<Script>` tags were removed from `src/app/layout.tsx`).

**Where the code is.** All of it lives in `src/chatbot/`, except the two files Next.js
requires elsewhere (the API route `src/app/api/chatbot-leads/route.ts`, and the widget's
one-line load in `src/components/layout/chrome-gate.tsx`):

```
src/chatbot/
  components/  sunkool-chatbot.tsx           the window, launcher and message list
  hooks/       use-chat.ts                   the conversation state, typing pace, language
               use-launcher-drag.ts          dragging the SK button
  lib/         flow.ts  conversation.ts      what is said, and the request steps
               keywords.ts  language.ts      what is listened for, which language it is in
               messages/ (en hi hinglish mr gu bn ta te kn)   every reply, per language
               topics.ts  linkify.ts  placement.ts            product buttons, links, window position
  leads/       actions.ts  lead.ts           the server action and the chat's name/number checks
               chatbot.ts                    files the lead in Supabase (+ the API route's logic)
  styles/      floating-chat.css             where the WhatsApp button and the chatbot sit
```

Tests sit next to what they test (`*.test.ts`, run by `npm test`).

**Languages.** The assistant answers in the language the visitor writes in and switches
when they do: English, Hindi, Hinglish (Hindi in Latin letters), Marathi, Gujarati,
Bengali, Tamil, Telugu and Kannada. It is worked out from the message itself (the script,
then common words: `lib/language.ts`), with no AI and no network call; a message with no
clear signal (a name, a number, "ok") keeps the language the chat is already in. Every
reply is a predefined translation in `lib/messages/<language>.ts`; a translation cannot
be missing a message (the compiler checks), and a test fails if the website's product
text changes so the translations are not left saying something different. Product names,
links, numbers and contact details are never translated. **Gujarati, Bengali, Tamil,
Telugu and Kannada were written by the developer and should be read by a native speaker
before launch.** To add a language, add `messages/<code>.ts`, list it in
`messages/index.ts` and `lib/language.ts`, and add its words to `lib/keywords.ts`.

**The flow**

0. It reads like someone messaging: the assistant's messages arrive one by one,
   each after a short "typing" indicator (three dots), with a time stamp. The pacing
   is in `src/chatbot/hooks/use-chat.ts` (`typingDelayMs` in `flow.ts` sets how
   long the dots show; people who prefer reduced motion get a shorter pause).
1. A friendly greeting, then the visitor taps a product button (Heat Control
   Glazing, Ultra Edge, Paint Protection Film, Interior PPF, Warranty / Support) or
   types a word such as "ppf" or "tint".
2. The chat shows the product's name and a short description, with a link to its
   page. The text is generated from the same modules the pages use
   (`src/lib/products.ts`, `warranty-content.ts`, `contact.ts`) by
   `src/chatbot/lib/flow.ts`, so it cannot quote anything the site does not show.
3. It asks whether the team may get in touch ("Yes, please" / "Not now", or just
   type it), then asks for the name and then the mobile number, one message at a
   time, typed into the chat box. The words are in `src/chatbot/lib/conversation.ts`.
   The mobile number is checked with the same rules as the blog form
   (`src/lib/leads/phone.ts`: Indian 10-digit numbers, or an international
   number with a country code). A question asked part-way through is answered and
   the chat then picks up where it left off.
4. The lead is saved and the chat confirms it. It appears at Admin → Blog Data →
   **Show: Chatbot** with the name, number, product and the date and time it came in.

**What it needs**

- **Migration `0010_chatbot_leads.sql`** (Supabase SQL editor). It adds
  `blog_leads.lead_source` (`blog` / `chatbot`), lets city and the blog columns be
  empty for chatbot rows, and adds the public `submit_chatbot_lead()` function.
  **Run it before deploying the chatbot**: the chat's call-back form files leads with
  that function. Admin → Blog Data reads the new column too; until the migration has
  run, that page lists every enquiry as before and shows no Show dropdown. The
  migration does not touch any existing column (the live table already has an
  unrelated `source` column, hence `lead_source`).
- Nothing else: no environment variable, no service-role key. Visitors can only call
  `submit_chatbot_lead()`, the same way the blog form calls `submit_blog_lead()`.
  The old `GEMINI_API_KEY` is no longer read anywhere and can be deleted from
  Vercel and `.env.local`.

**How it behaves**

- *Typed messages* are matched by keywords (`routeMessage` in `flow.ts`, the words in
  `keywords.ts`, in every language): a product word opens that product, a price
  question is answered with "our team prepares an exact quote" (the site shows no
  prices, so the chat gives none), a contact question gets the WhatsApp number, and
  anything else points back at the buttons and WhatsApp. To change what a reply says,
  edit it in `lib/messages/<language>.ts`; to add a product button, add it in
  `src/chatbot/lib/topics.ts`, map it in `flow.ts` and give it a description in each
  language file.
- *No duplicate leads*: the button locks while sending, the form disappears once it
  worked, asking about the same product again in that chat does not ask again, and
  the database refuses a repeat (the same chat and product, or the same number and
  product within 10 minutes; 5 enquiries per number per hour). The visitor sees the
  thank-you either way. A visitor who asks about two products in one chat leaves two
  leads, one per product.
- *Phones*: the window is a full-screen sheet, the keyboard does not open until a
  field is tapped, fields use 16px text (so iOS does not zoom in), and buttons are at
  least 44px tall.
- *Position*: `src/chatbot/styles/floating-chat.css` holds the one set of variables for the
  WhatsApp button and the chatbot; lower `--fab-bottom` to move the pair nearer the
  corner. The launcher, WhatsApp button and window all follow.
- *Moving the button*: a visitor can drag the SK button anywhere on screen (mouse
  or finger), and the window then opens beside it. The spot is remembered in that
  browser, kept on screen when the window is resized, and a double click sends the
  button back to its default place above WhatsApp (Shift + arrow keys nudge it).
  Dragging never opens the chat, and WhatsApp stays put. The logic is in
  `src/chatbot/hooks/use-launcher-drag.ts` and `src/chatbot/lib/placement.ts`.
- `/api/chatbot-leads` (needs `CHATBOT_LEAD_SECRET`) is left over from the Zoho
  design and is not used by the widget. Remove it if you do not want it.
