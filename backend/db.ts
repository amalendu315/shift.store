import { DatabaseSync } from "node:sqlite";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
export const dataDir = path.resolve(process.env.DATA_DIR || "data");
mkdirSync(dataDir, { recursive: true, mode: 0o700 });
export const db = new DatabaseSync(path.join(dataDir, "shiftstore.sqlite"));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS admins (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, admin_id TEXT NOT NULL REFERENCES admins(id), expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, price INTEGER NOT NULL CHECK(price>0), compare_price INTEGER NOT NULL DEFAULT 0, stock INTEGER NOT NULL CHECK(stock>=0), image TEXT NOT NULL DEFAULT '', published INTEGER NOT NULL DEFAULT 0, featured INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, number TEXT UNIQUE NOT NULL, customer TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, city TEXT NOT NULL, state TEXT NOT NULL, pincode TEXT NOT NULL, items TEXT NOT NULL, total INTEGER NOT NULL, payment_method TEXT NOT NULL, payment_status TEXT NOT NULL, status TEXT NOT NULL, tracking TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, idempotency_key TEXT UNIQUE NOT NULL, payment_reference TEXT);
CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY CHECK(id=1), value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS payment_events (id TEXT PRIMARY KEY, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL);
`);
if (
  !(db.prepare("PRAGMA table_info(orders)").all() as any[]).some(
    (column) => column.name === "payment_url",
  )
)
  db.exec("ALTER TABLE orders ADD COLUMN payment_url TEXT");
for (const [column, type] of Object.entries({
  payment_session: "TEXT",
  payment_mode: "TEXT",
})) {
  if (
    !(db.prepare("PRAGMA table_info(orders)").all() as any[]).some(
      (row) => row.name === column,
    )
  )
    db.exec(`ALTER TABLE orders ADD COLUMN ${column} ${type}`);
}
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(password, salt, 64).toString("hex");
}
if (!db.prepare("SELECT id FROM admins LIMIT 1").get()) {
  const email = process.env.ADMIN_EMAIL || "admin@shiftstore.local";
  const password =
    process.env.ADMIN_DEFAULT_PASSWORD &&
    process.env.ADMIN_DEFAULT_PASSWORD.length >= 12
      ? process.env.ADMIN_DEFAULT_PASSWORD
      : randomBytes(18).toString("base64url");
  db.prepare("INSERT INTO admins VALUES (?,?,?)").run(
    "owner",
    email.toLowerCase(),
    hashPassword(password),
  );
  writeFileSync(
    path.join(dataDir, "bootstrap-admin.txt"),
    `ShiftStore administrator\nEmail: ${email}\nPassword: ${password}\n\nChange this password in Admin > Settings after signing in. This file is local only.\n`,
    { mode: 0o600 },
  );
}
if (!db.prepare("SELECT id FROM settings").get())
  db.prepare("INSERT INTO settings VALUES (1,?)").run(
    JSON.stringify({
      name: "ShiftStore",
      tagline: "A little less ordinary.",
      description:
        "Thoughtful objects. Everyday spaces. A considered collection for the way you live.",
      email: "",
      phone: "",
      shippingFee: 0,
      freeShippingThreshold: 250000,
      codEnabled: true,
      paymentProvider: "",
      shippingPolicy:
        "Delivery estimates and shipping details will be published with our first collection.",
      returnPolicy:
        "Please contact us before returning an item. Our full return policy will be available before our first collection launches.",
    }),
  );
export function getSettings(): any {
  return JSON.parse(
    (db.prepare("SELECT value FROM settings WHERE id=1").get() as any).value,
  );
}
