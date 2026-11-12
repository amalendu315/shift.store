# ShiftStore

A React + Vite storefront with an Express API and a persistent SQLite database. There are two distinct areas:

- `/` — public store, collection, product pages, bag, checkout, contact, and policies.
- `/admin` — authenticated store workspace: products, inventory, orders, inbox, settings, and password management.

## Run locally

Requires **Node 22.13+** (uses Node's built-in `node:sqlite`).

```sh
npm install
npm run dev
```

Open http://localhost:3000. `npm run dev` starts both the frontend and the backend.

The first launch creates `data/shiftstore.sqlite` and one administrator. There are **no seeded products, orders, reviews, or customer messages**. Initial credentials are in `data/bootstrap-admin.txt`, a local file with owner-only permissions. Sign in at `/admin` and change the password in Settings. Credentials are never included in the frontend bundle or Git.

Copy `.env.example` to `.env.local` if you want to configure the port, storage directory, admin email, or initial password before first launch. Environment admin settings only apply to an empty database. An existing administrator is never silently reset on restart.

## Working with the store

1. Sign in and add your contact details, delivery charges, and policies under Settings.
2. Create products with descriptions, categories, prices, stock, and images. Upload PNG/JPEG/WebP images up to 5 MB, or use HTTPS image URLs.
3. Save products as drafts or publish them to the collection. Featured products appear first.
4. Customers add published products to their bag and place COD orders. Prices are calculated on the server in integer paise. Stock is reserved atomically, and duplicate requests with the same checkout key do not create duplicate orders.
5. Manage confirmed orders through Shipped → Delivered. Delivered COD orders are recorded as paid. Cancelling an unpaid order restores inventory once.
6. Customer contact messages are saved to Inbox. The app does not send email or SMS notifications.

## Storage and authentication

- SQLite runs in WAL mode. The database, uploaded images, and initial credential file live inside `DATA_DIR` (default `./data`). Keep this directory on a persistent disk.
- Passwords use salted scrypt. Sessions use random tokens stored hashed in the database and HttpOnly/SameSite cookies. Sessions expire after 24 hours; production cookies require HTTPS.
- Every admin data and mutation endpoint requires authentication. Browser mutations enforce same-origin requests.
- Login, checkout, contact, and password changes have basic per-process rate limits. Run one Node instance with this SQLite setup.
- Orders retain product snapshots even if the product is later edited or deleted.
- To back up, stop the app and copy the entire data directory. Restore it before restarting. Do not commit it.

## Payments

Cashfree sandbox and COD are integrated. Add `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, and `CASHFREE_ENV=sandbox` to the ignored `.env.local`. Credentials remain on the server. Cashfree is selected on first configuration; thereafter Admin → Settings controls whether it is offered.

Checkout creates the order server-side, reserves inventory, and opens Cashfree’s hosted checkout for UPI/cards/net banking. `/payment-return` verifies the result through Cashfree’s order API; a redirect alone never marks an order paid. Receipts are available at `/orders` in the browser used at checkout. Their private access tokens stay in that browser.

For deployed testing, set `APP_ORIGIN` to the store origin and `CASHFREE_NOTIFY_URL=https://your-domain/api/payments/webhook/cashfree`. Configure/whitelist the checkout domain in Cashfree as required. The webhook verifies the raw-body HMAC signature, order/reference/amount/currency, and deduplicates payment events. Failed payment attempts can be retried. Checkout retries reuse the same payment session.

Cashfree sessions expire after 30 minutes. An order-status check reconciles expired sessions and restores inventory once. Pending Cashfree orders cannot be manually cancelled while their remote payment session may still accept payment. Automatic background reconciliation and refund processing are not implemented; check pending orders through the customer status page. Before selling live, complete Cashfree onboarding/domain setup, configure HTTPS webhooks, replace sandbox keys with production credentials, and test the full live lifecycle.

`backend/payments.ts` keeps the integration replaceable: adapters implement `createPayment`, `verifyWebhook`, and optionally `getPayment`. Providers can return a hosted HTTPS redirect URL or a session ID with their checkout mode. Register another adapter in `paymentProviders`, add its client SDK launcher when required, and select it in Admin Settings. See `backend/cashfree.ts` for the working reference.

## Demo preview

`/` and `/shop` read only published products from SQLite. `/admin` manages the real catalog. `/demo` is a separate illustrative storefront: its eight sample products live in `src/demo.ts`, never in SQLite. Demo carts/wishlists are separate and order submission is disabled. Search, category/price filters, sorting, product pages, cart, and checkout preview can be explored there. Replace illustrative photography with your own product images when publishing your catalog.

## Checks and production

```sh
npm test
npm run build
npm start
```

Tests run against a temporary database and do not touch your store. They cover authentication, product publication, server-side totals, duplicate requests, inventory handling, order transitions, settings, inbox, and provider webhook checks. Browser QA was performed with a separate test store, including create/publish → bag → COD checkout → admin order receipt.

For production, set `APP_ORIGIN=https://your-domain`, run behind HTTPS, and preserve `DATA_DIR`. Set `HOST=0.0.0.0` only if your hosting environment requires it. Use a persistent Node host; this SQLite server is not a static-only or ephemeral serverless deployment. If using one trusted reverse proxy, set `TRUST_PROXY=1` so rate limiting uses the forwarded client IP. Keep the Node process inaccessible to untrusted direct traffic in that configuration.

The former Next.js/demo implementation is retained under `legacy/` for reference and is not routed, imported, built, or served. The active implementation is `src/App.tsx`, `src/admin.tsx`, `server.ts`, and `backend/`.
