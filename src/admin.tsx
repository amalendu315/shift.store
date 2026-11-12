import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings as SettingsIcon,
  MessageSquare,
  ArrowUpRight,
  Plus,
  LogOut,
  Search,
  ArrowRight,
  X,
  Check,
  CreditCard,
  Menu,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  api,
  money,
  navigate,
  write,
  type Product,
  type Order,
  type Settings,
} from "./lib";
import { Brand, Link, Modal, Empty, ErrorBox } from "./ui";
interface AdminData {
  products: Product[];
  orders: Order[];
  settings: Settings;
  providers: { id: string; label: string }[];
  messages: {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
  }[];
}
const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { id: "products", label: "Products", icon: Package, path: "/admin/products" },
  { id: "orders", label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
  {
    id: "messages",
    label: "Inbox",
    icon: MessageSquare,
    path: "/admin/messages",
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
    path: "/admin/settings",
  },
];
export default function Admin({ path }: { path: string }) {
  const [auth, setAuth] = useState<boolean | null>(null),
    [data, setData] = useState<AdminData | null>(null),
    [error, setError] = useState(""),
    [toast, setToast] = useState(""),
    [edit, setEdit] = useState<Product | "new" | null>(null),
    [selected, setSelected] = useState<Order | null>(null),
    [deleting, setDeleting] = useState<Product | null>(null),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [menu, setMenu] = useState(false),
    [busy, setBusy] = useState(false);
  const active = sections.find((s) => s.path === path) || sections[0];
  const load = async () => {
    try {
      setData(await api<AdminData>("/admin/data"));
      setAuth(true);
      setError("");
    } catch (e: any) {
      if (e.status === 401) setAuth(false);
      else setError(e.message);
    }
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    setSearch("");
    setFilter("all");
    setMenu(false);
  }, [path]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const saved = async (message: string) => {
    await load();
    setToast(message);
  };
  if (auth === false)
    return (
      <Login
        onLogin={() => {
          load();
          navigate("/admin");
        }}
      />
    );
  if (!data)
    return (
      <div className="loading">
        <Brand admin />
        <p>{error || "Opening your workspace…"}</p>
        {error && (
          <button className="btn" onClick={load}>
            Try again
          </button>
        )}
      </div>
    );
  const revenue = data.orders
      .filter((o) => o.payment_status === "PAID")
      .reduce((n, o) => n + o.total, 0),
    pending = data.orders.filter((o) =>
      ["NEW", "CONFIRMED"].includes(o.status),
    ),
    published = data.products.filter((p) => p.published),
    low = data.products.filter((p) => p.stock <= 5);
  const products = data.products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" ||
        (filter === "live"
          ? p.published
          : filter === "draft"
            ? !p.published
            : p.stock <= 5)),
  );
  const orders = data.orders.filter(
    (o) =>
      `${o.number} ${o.customer} ${o.phone}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "all" || o.status === filter),
  );
  return (
    <div className="admin-shell">
      <aside className={"sidebar " + (menu ? "visible" : "")}>
        <Brand admin />
        <div className="workspace-label">
          <span className="workspace-avatar">S</span>
          <div>
            <strong>Store workspace</strong>
            <small>Administrator</small>
          </div>
          <span className="status-dot" />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {sections.map((s) => (
            <Link
              key={s.id}
              to={s.path}
              className={active.id === s.id ? "active" : ""}
            >
              <s.icon size={18} />
              {s.label}
              {s.id === "orders" && pending.length > 0 && (
                <b>{pending.length}</b>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="store-status">
            <span className="status-dot" />
            <div>
              <strong>Your store is ready</strong>
              <p>
                {published.length
                  ? `${published.length} products published`
                  : "Add your first product to begin"}
              </p>
            </div>
          </div>
          <Link to="/" className="view-store">
            Visit storefront <ArrowUpRight size={16} />
          </Link>
          <button
            className="logout"
            onClick={async () => {
              try {
                await api("/admin/logout", write("POST"));
                setAuth(false);
                setData(null);
              } catch (e: any) {
                setError(e.message);
              }
            }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          <div>
            <button
              className="icon-btn mobile-menu"
              aria-label="Toggle admin menu"
              onClick={() => setMenu(!menu)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>{active.label}</strong>
          </div>
          <div>
            <span className="admin-header-note">
              Let’s make a little shift.
            </span>
            <span className="avatar">AD</span>
          </div>
        </header>
        <main className="admin-content">
          <ErrorBox error={error} />
          <div className="admin-title">
            <div>
              <div className="eyebrow">YOUR STORE, AT A GLANCE</div>
              <h1>
                {active.id === "overview"
                  ? "A fresh perspective."
                  : active.label + "."}
              </h1>
              <p>
                {active.id === "overview"
                  ? "A little clarity for your everyday operations."
                  : active.id === "products"
                    ? "Good objects start here. Build and manage your collection."
                    : active.id === "orders"
                      ? "Every order, from first click to doorstep."
                      : active.id === "messages"
                        ? "A direct line to the people behind your orders."
                        : "The details that make this store yours."}
              </p>
            </div>
            {["overview", "products"].includes(active.id) && (
              <button className="btn" onClick={() => setEdit("new")}>
                <Plus size={17} /> Add product
              </button>
            )}
          </div>
          {active.id === "overview" && (
            <>
              <div className="stats-grid">
                <Stat
                  label="Collected revenue"
                  value={money(revenue)}
                  caption="Paid orders only"
                  icon={<span>₹</span>}
                />
                <Stat
                  label="Total orders"
                  value={String(data.orders.length)}
                  caption={`${pending.length} awaiting fulfillment`}
                  icon={<ShoppingBag size={18} />}
                />
                <Stat
                  label="Live products"
                  value={String(published.length)}
                  caption={`${data.products.length - published.length} saved as drafts`}
                  icon={<Package size={18} />}
                />
                <Stat
                  label="Low stock"
                  value={String(low.length)}
                  caption="5 or fewer units remaining"
                  icon={<LayoutDashboard size={18} />}
                />
              </div>
              {!data.products.length && (
                <div className="welcome-card">
                  <div className="welcome-number">01</div>
                  <div>
                    <span className="eyebrow">
                      YOUR NEXT CHAPTER STARTS HERE
                    </span>
                    <h2>Make room for your first good thing.</h2>
                    <p>
                      Your store is a blank canvas. Add a product, set its
                      price, and make it yours.
                    </p>
                    <button
                      className="text-button"
                      onClick={() => setEdit("new")}
                    >
                      Create your first product <ArrowRight size={17} />
                    </button>
                  </div>
                  <div className="welcome-art">
                    <Package size={74} strokeWidth={0.7} />
                    <span>
                      YOUR COLLECTION
                      <br />
                      STARTS WITH ONE.
                    </span>
                  </div>
                </div>
              )}
              <div className="dashboard-grid">
                <section className="panel">
                  <div className="panel-header">
                    <h2>Recent orders</h2>
                    <Link to="/admin/orders" className="text-button">
                      View all <ArrowUpRight size={15} />
                    </Link>
                  </div>
                  {data.orders.length ? (
                    <OrderTable
                      orders={data.orders.slice(0, 5)}
                      open={setSelected}
                    />
                  ) : (
                    <Empty
                      title="The first of many."
                      description="Orders will appear here as soon as someone finds their next favorite."
                    />
                  )}
                </section>
                <section className="panel setup-panel">
                  <div className="panel-header">
                    <h2>Your launch checklist</h2>
                    <span className="muted">
                      {
                        [
                          data.products.length > 0,
                          published.length > 0,
                          !!data.settings.email,
                          data.settings.codEnabled ||
                            !!data.settings.paymentProvider,
                        ].filter(Boolean).length
                      }
                      /4
                    </span>
                  </div>
                  {[
                    {
                      title: "Add your first product",
                      sub: "Give your collection a starting point",
                      done: data.products.length > 0,
                      path: "/admin/products",
                    },
                    {
                      title: "Publish your collection",
                      sub: "Make your products visible in the store",
                      done: published.length > 0,
                      path: "/admin/products",
                    },
                    {
                      title: "Add your contact details",
                      sub: "Let customers know how to reach you",
                      done: !!data.settings.email,
                      path: "/admin/settings",
                    },
                    {
                      title: "Set up a payment method",
                      sub: "COD is ready. Add a gateway anytime.",
                      done:
                        data.settings.codEnabled ||
                        !!data.settings.paymentProvider,
                      path: "/admin/settings",
                    },
                  ].map((c, i) => (
                    <Link key={c.title} to={c.path} className="checklist-item">
                      <span
                        className={
                          c.done ? "check-circle done" : "check-circle"
                        }
                      >
                        {c.done ? <Check size={14} /> : i + 1}
                      </span>
                      <div>
                        <strong>{c.title}</strong>
                        <small>{c.sub}</small>
                      </div>
                      <ChevronRight size={15} />
                    </Link>
                  ))}
                </section>
              </div>
            </>
          )}
          {active.id === "products" && (
            <section className="panel">
              <div className="table-toolbar">
                <div className="filter-tabs">
                  {[
                    ["all", "All products"],
                    ["live", "Published"],
                    ["draft", "Drafts"],
                    ["low", "Low stock"],
                  ].map(([key, label]) => (
                    <button
                      className={filter === key ? "active" : ""}
                      key={key}
                      onClick={() => setFilter(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <SearchField
                  value={search}
                  set={setSearch}
                  placeholder="Search products…"
                />
              </div>
              {products.length ? (
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Status</th>
                        <th>Inventory</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <button
                              className="table-product"
                              onClick={() => setEdit(p)}
                            >
                              <span className="product-thumb">
                                {p.image ? (
                                  <img src={p.image} alt="" />
                                ) : (
                                  <Package size={19} />
                                )}
                              </span>
                              <span>
                                <strong>{p.name}</strong>
                                <small>/{p.slug}</small>
                              </span>
                            </button>
                          </td>
                          <td>
                            <span
                              className={
                                "badge " + (p.published ? "green" : "")
                              }
                            >
                              {p.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td>
                            <span className={p.stock <= 5 ? "low-stock" : ""}>
                              {p.stock} in stock
                            </span>
                          </td>
                          <td>{money(p.price)}</td>
                          <td>{p.category || "—"}</td>
                          <td>
                            <div className="row-actions">
                              <button
                                className="icon-btn"
                                aria-label={`Edit ${p.name}`}
                                onClick={() => setEdit(p)}
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                className="icon-btn"
                                aria-label={`Delete ${p.name}`}
                                onClick={() => setDeleting(p)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty
                  title={
                    data.products.length
                      ? "No matching products."
                      : "A collection waiting to happen."
                  }
                  description={
                    data.products.length
                      ? "Try another search or filter."
                      : "Add your first product. You can save it as a draft until you’re ready to share it."
                  }
                  action={
                    !data.products.length && (
                      <button className="btn" onClick={() => setEdit("new")}>
                        <Plus size={16} /> Add your first product
                      </button>
                    )
                  }
                />
              )}
            </section>
          )}
          {active.id === "orders" && (
            <section className="panel">
              <div className="table-toolbar">
                <select
                  aria-label="Filter order status"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All orders</option>
                  {[
                    "NEW",
                    "CONFIRMED",
                    "SHIPPED",
                    "DELIVERED",
                    "CANCELLED",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <SearchField
                  value={search}
                  set={setSearch}
                  placeholder="Search orders…"
                />
              </div>
              {orders.length ? (
                <OrderTable orders={orders} open={setSelected} />
              ) : (
                <Empty
                  title="No orders to show."
                  description="New orders will land here, ready for you to take care of."
                />
              )}
            </section>
          )}
          {active.id === "messages" && (
            <section className="panel">
              <div className="panel-header">
                <h2>Customer messages</h2>
                <span className="badge">{data.messages.length} messages</span>
              </div>
              {data.messages.length ? (
                data.messages.map((m) => (
                  <article key={m.id} className="message">
                    <div>
                      <strong>{m.name}</strong>
                      <time>
                        {new Date(m.created_at).toLocaleDateString("en-IN")}
                      </time>
                    </div>
                    <a href={"mailto:" + m.email}>{m.email}</a>
                    <p>{m.message}</p>
                  </article>
                ))
              ) : (
                <Empty
                  title="A quiet inbox."
                  description="Messages from your storefront’s contact form will appear here."
                />
              )}
            </section>
          )}
          {active.id === "settings" && (
            <StoreSettings data={data} saved={saved} />
          )}
          <footer className="admin-footer">
            <span>SHIFTSTORE / STORE WORKSPACE</span>
            <span>A little more considered. Every day.</span>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={14} />
          </button>
        </div>
      )}
      {edit && (
        <ProductEditor
          product={edit === "new" ? null : edit}
          onClose={() => setEdit(null)}
          onSave={async () => {
            setEdit(null);
            await saved("Product saved. Your collection is up to date.");
          }}
        />
      )}
      {selected && (
        <OrderEditor
          order={selected}
          onClose={() => setSelected(null)}
          onSave={async () => {
            setSelected(null);
            await saved("Order updated.");
          }}
        />
      )}
      {deleting && (
        <Modal title="Delete this product?" onClose={() => setDeleting(null)}>
          <div className="modal-body">
            <p>
              <strong>{deleting.name}</strong> will be removed from your
              catalog. Existing orders keep their product details.
            </p>
            <p className="muted">
              To temporarily hide it, save it as a draft instead.
            </p>
            <div className="modal-actions">
              <button
                className="btn secondary"
                onClick={() => setDeleting(null)}
              >
                Keep product
              </button>
              <button
                className="btn danger"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await api(
                      "/admin/products/" + deleting.id,
                      write("DELETE"),
                    );
                    setDeleting(null);
                    await saved("Product deleted.");
                  } catch (e: any) {
                    setError(e.message);
                    setDeleting(null);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Deleting…" : "Delete product"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
function Stat({ label, value, caption, icon }: any) {
  return (
    <div className="stat-card">
      <div>
        <span>{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <strong>{value}</strong>
      <small>{caption}</small>
    </div>
  );
}
function SearchField({ value, set, placeholder }: any) {
  return (
    <div className="search-input">
      <Search size={16} />
      <input
        aria-label={placeholder}
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
function Login({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api(
        "/admin/login",
        write("POST", Object.fromEntries(new FormData(e.currentTarget))),
      );
      onLogin();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="login-page">
      <div className="login-story">
        <Brand />
        <div>
          <span className="eyebrow">BEHIND THE GOOD THINGS</span>
          <h1>
            A considered store.
            <br />
            <em>A clear perspective.</em>
          </h1>
          <p>
            Your collection, your customers, your next chapter.
            <br />
            All in one thoughtful workspace.
          </p>
        </div>
        <span className="eyebrow">SHIFTSTORE / ADMINISTRATOR ACCESS</span>
      </div>
      <div className="login-side">
        <Link to="/" className="text-button login-back">
          Back to storefront <ArrowUpRight size={15} />
        </Link>
        <form className="form login-form" onSubmit={submit}>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Your workspace awaits.</h2>
          <p className="muted">Sign in to look after the little details.</p>
          <ErrorBox error={error} />
          <label>
            Email address
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              placeholder="you@yourstore.com"
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </label>
          <button className="btn full" disabled={busy}>
            {busy ? "Signing in…" : "Enter workspace"}
            <ArrowRight size={17} />
          </button>
          <p className="form-hint">A private space for your store’s team.</p>
        </form>
        <span className="login-footer">
          GOOD THINGS START BEHIND THE SCENES.
        </span>
      </div>
    </div>
  );
}
function ProductEditor({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [name, setName] = useState(product?.name || ""),
    [slug, setSlug] = useState(product?.slug || ""),
    [image, setImage] = useState(product?.image || ""),
    [uploading, setUploading] = useState(false);
  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > 5 * 1024 * 1024) {
      setError("Images must be smaller than 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await api(
        "/admin/uploads",
        write("POST", { data: base64 }),
      );
      setImage(result.url);
    } catch (error: any) {
      setError(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const body = {
      ...Object.fromEntries(form),
      name,
      slug,
      image,
      price: Math.round(Number(form.get("price")) * 100),
      compare_price: Math.round(Number(form.get("compare_price")) * 100),
      stock: Number(form.get("stock")),
      published: form.get("published") === "on",
      featured: form.get("featured") === "on",
    };
    try {
      await api(
        "/admin/products" + (product ? "/" + product.id : ""),
        write(product ? "PATCH" : "POST", body),
      );
      onSave();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={product ? "Edit your object" : "Add a good thing"}
      onClose={() => !busy && onClose()}
      wide
    >
      <form onSubmit={submit} className="modal-body form">
        <ErrorBox error={error} />
        <div className="editor-columns">
          <div>
            <label>
              Product name
              <input
                required
                maxLength={140}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!product)
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, ""),
                    );
                }}
                placeholder="e.g. The everyday ceramic vase"
              />
            </label>
            <label>
              URL slug
              <input
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
              />
              <small className="muted">
                /products/{slug || "your-product"}
              </small>
            </label>
            <label>
              Description
              <textarea
                name="description"
                rows={5}
                maxLength={5000}
                defaultValue={product?.description}
                placeholder="Tell the story. Materials, dimensions, and what makes it special."
              />
            </label>
            <label>
              Category
              <input
                name="category"
                defaultValue={product?.category}
                maxLength={80}
                placeholder="e.g. Home objects"
              />
            </label>
          </div>
          <div>
            <div className="image-preview">
              {image &&
              (image.startsWith("https://") ||
                image.startsWith("/uploads/")) ? (
                <img src={image} alt="Product preview" />
              ) : (
                <>
                  <Package size={40} strokeWidth={1} />
                  <span>A picture of something good.</span>
                </>
              )}
            </div>
            <label>
              Upload product image
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={upload}
                disabled={uploading}
              />
              <small className="muted">
                {uploading ? "Uploading…" : "PNG, JPEG or WebP. Up to 5 MB."}
              </small>
            </label>
            <label>
              Or image URL
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://…"
              />
              <small className="muted">
                Use an uploaded image or a public HTTPS image URL.
              </small>
            </label>
            <div className="form-grid">
              <label>
                Price (₹)
                <input
                  name="price"
                  type="number"
                  required
                  min="0.01"
                  max="1000000"
                  step="0.01"
                  defaultValue={product ? product.price / 100 : ""}
                />
              </label>
              <label>
                Compare-at price (₹)
                <input
                  name="compare_price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={
                    product?.compare_price ? product.compare_price / 100 : ""
                  }
                  placeholder="Optional"
                />
              </label>
            </div>
            <label>
              Available stock
              <input
                name="stock"
                type="number"
                required
                min="0"
                max="1000000"
                step="1"
                defaultValue={product?.stock ?? 0}
              />
            </label>
          </div>
        </div>
        <div className="editor-flags">
          <label className="checkbox">
            <input
              name="published"
              type="checkbox"
              defaultChecked={product?.published}
            />
            <span>
              <strong>Publish to storefront</strong>
              <small>Leave unchecked to keep this as a draft.</small>
            </span>
          </label>
          <label className="checkbox">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={product?.featured}
            />
            <span>
              <strong>Feature this product</strong>
              <small>Show it first in the collection.</small>
            </span>
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" disabled={busy || uploading}>
            {busy ? "Saving…" : uploading ? "Uploading…" : "Save product"}{" "}
            <Check size={16} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
function OrderTable({
  orders,
  open,
}: {
  orders: Order[];
  open: (o: Order) => void;
}) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <strong>{o.number}</strong>
                <small>
                  {new Date(o.created_at).toLocaleDateString("en-IN")}
                </small>
              </td>
              <td>{o.customer}</td>
              <td>
                <span
                  className={
                    "badge " +
                    (o.status === "CANCELLED"
                      ? "red"
                      : o.status === "DELIVERED"
                        ? "green"
                        : "amber")
                  }
                >
                  {o.status.toLowerCase()}
                </span>
              </td>
              <td>
                <span>{o.payment_method}</span>
                <small>{o.payment_status.toLowerCase()}</small>
              </td>
              <td>{money(o.total)}</td>
              <td>
                <button
                  className="icon-btn"
                  aria-label={`View ${o.number}`}
                  onClick={() => open(o)}
                >
                  <ArrowUpRight size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function OrderEditor({
  order: o,
  onClose,
  onSave,
}: {
  order: Order;
  onClose: () => void;
  onSave: () => void;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const transitions: Record<string, string[]> = {
    NEW: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api(
        "/admin/orders/" + o.id,
        write("PATCH", Object.fromEntries(new FormData(e.currentTarget))),
      );
      onSave();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title={o.number} onClose={() => !busy && onClose()}>
      <form onSubmit={submit} className="modal-body form">
        <ErrorBox error={error} />
        <div className="order-customer">
          <div>
            <div className="eyebrow">DELIVER TO</div>
            <h3>{o.customer}</h3>
            <p>
              {o.address}
              <br />
              {o.city}, {o.state} — {o.pincode}
            </p>
            <p>
              {o.phone}
              <br />
              {o.email}
            </p>
          </div>
          <span className="badge">{o.payment_status}</span>
        </div>
        {o.items.map((i, index) => (
          <div key={index} className="order-item">
            <span>
              {i.name}
              <small>
                {i.quantity} × {money(i.price)}
              </small>
            </span>
            <strong>{money(i.quantity * i.price)}</strong>
          </div>
        ))}
        <div className="order-receipt">
          <span>Total · {o.payment_method}</span>
          <strong>{money(o.total)}</strong>
        </div>
        <label>
          Fulfillment status
          <select name="status" defaultValue={o.status}>
            {[o.status, ...(transitions[o.status] || [])].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tracking reference
          <input
            name="tracking"
            maxLength={200}
            defaultValue={o.tracking}
            placeholder="Carrier and tracking number"
          />
        </label>
        <p className="form-hint">
          Cancelling an unpaid order restores inventory. Delivered COD orders
          are marked paid.
        </p>
        <button className="btn full" disabled={busy}>
          {busy ? "Saving…" : "Update order"} <Check size={16} />
        </button>
      </form>
    </Modal>
  );
}
function StoreSettings({
  data,
  saved,
}: {
  data: AdminData;
  saved: (message: string) => Promise<void>;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [passwordError, setPasswordError] = useState(""),
    [changing, setChanging] = useState(false);
  const s = data.settings;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      await api(
        "/admin/settings",
        write("PATCH", {
          ...Object.fromEntries(form),
          codEnabled: form.get("codEnabled") === "on",
          shippingFee: Math.round(Number(form.get("shippingFee")) * 100),
          freeShippingThreshold: Math.round(
            Number(form.get("freeShippingThreshold")) * 100,
          ),
        }),
      );
      await saved("Store settings saved.");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function password(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setPasswordError("");
    setChanging(true);
    try {
      await api(
        "/admin/password",
        write("POST", Object.fromEntries(new FormData(form))),
      );
      form.reset();
      await saved("Password changed. Other sessions have been signed out.");
    } catch (e: any) {
      setPasswordError(e.message);
    } finally {
      setChanging(false);
    }
  }
  return (
    <div className="settings-wrap">
      <form className="form" onSubmit={submit}>
        <ErrorBox error={error} />
        <section className="panel settings-panel">
          <h2>Your store identity</h2>
          <p>The small details that introduce you to the world.</p>
          <div className="form-grid">
            <label>
              Store name
              <input
                name="name"
                required
                maxLength={80}
                defaultValue={s.name}
              />
            </label>
            <label>
              Tagline
              <input name="tagline" maxLength={160} defaultValue={s.tagline} />
            </label>
          </div>
          <label>
            Introduction
            <textarea
              name="description"
              rows={3}
              maxLength={1000}
              defaultValue={s.description}
            />
          </label>
          <div className="form-grid">
            <label>
              Support email
              <input name="email" type="email" defaultValue={s.email} />
            </label>
            <label>
              Support phone
              <input name="phone" type="tel" defaultValue={s.phone} />
            </label>
          </div>
        </section>
        <section className="panel settings-panel">
          <h2>Delivery & returns</h2>
          <p>Keep expectations clear from the first click.</p>
          <div className="form-grid">
            <label>
              Shipping charge (₹)
              <input
                name="shippingFee"
                type="number"
                required
                min="0"
                step="0.01"
                defaultValue={s.shippingFee / 100}
              />
            </label>
            <label>
              Free shipping above (₹)
              <input
                name="freeShippingThreshold"
                type="number"
                required
                min="0"
                step="0.01"
                defaultValue={s.freeShippingThreshold / 100}
              />
              <small className="muted">
                Set to 0 to disable the threshold.
              </small>
            </label>
          </div>
          <label>
            Shipping policy
            <textarea
              name="shippingPolicy"
              rows={3}
              maxLength={5000}
              defaultValue={s.shippingPolicy}
            />
          </label>
          <label>
            Return policy
            <textarea
              name="returnPolicy"
              rows={3}
              maxLength={5000}
              defaultValue={s.returnPolicy}
            />
          </label>
        </section>
        <section className="panel settings-panel">
          <div className="settings-heading">
            <CreditCard size={22} />
            <h2>Payment methods</h2>
          </div>
          <p>
            Offer COD now. Connect an online payment provider when you’re ready.
          </p>
          <label className="checkbox payment-option">
            <input
              name="codEnabled"
              type="checkbox"
              defaultChecked={s.codEnabled}
            />
            <span>
              <strong>Cash on delivery</strong>
              <small>Customers pay when their order is delivered.</small>
            </span>
            <span className="badge green">Available</span>
          </label>
          <label>
            Online payment provider
            <select name="paymentProvider" defaultValue={s.paymentProvider}>
              <option value="">Not connected</option>
              {data.providers.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <div className="notice">
            {data.providers.length
              ? "Choose an installed provider to enable online payments."
              : "No online gateway connected yet. Customers will only see the payment methods you enable."}
          </div>
        </section>
        <div className="settings-save">
          <button className="btn" disabled={busy}>
            {busy ? "Saving…" : "Save store settings"} <Check size={16} />
          </button>
        </div>
      </form>
      <form onSubmit={password} className="panel settings-panel form">
        <h2>Account security</h2>
        <p>Choose a unique password with at least 12 characters.</p>
        <ErrorBox error={passwordError} />
        <div className="form-grid">
          <label>
            Current password
            <input
              name="current"
              type="password"
              required
              autoComplete="current-password"
            />
          </label>
          <label>
            New password
            <input
              name="password"
              type="password"
              required
              minLength={12}
              maxLength={256}
              autoComplete="new-password"
            />
          </label>
        </div>
        <button className="btn secondary" disabled={changing}>
          {changing ? "Updating…" : "Change password"}
        </button>
      </form>
    </div>
  );
}
