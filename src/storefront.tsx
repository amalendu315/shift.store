import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Gift,
  Headphones,
  Heart,
  LayoutGrid,
  Mail,
  MapPin,
  Minus,
  Package,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  X,
} from "lucide-react";
import {
  api,
  money,
  navigate,
  write,
  type Product,
  type StoreData,
} from "./lib";
import { Brand, Link, Modal, Empty, ErrorBox } from "./ui";
import { demoProducts, categoryImages } from "./demo";
import { Checkout, launchPayment, receipts, type ReceiptKey } from "./checkout";
import "./marketplace.css";
const categories = Object.keys(categoryImages);
const campaigns = [
  {
    tag: "THE HOME REFRESH EDIT",
    title: "Little upgrades.\nA whole new feeling.",
    description:
      "Discover décor, everyday essentials and thoughtful finds for every corner of your life.",
    image: "interior",
    category: "Home Décor",
    button: "Explore home & living",
    color: "peach",
  },
  {
    tag: "MAKE EVERY CORNER YOURS",
    title: "Good things.\nGreat little spaces.",
    description:
      "Bring a little life to your desk, shelf and favorite sunny spot.",
    image: "plants",
    category: "Garden & Outdoors",
    button: "Explore garden finds",
    color: "mint",
  },
  {
    tag: "SOMETHING FOR EVERY OCCASION",
    title: "New season.\nNew reasons to smile.",
    description:
      "Gifting inspiration and feel-good discoveries, all in one place.",
    image: "vases",
    category: "Gifts & Seasonal",
    button: "Explore seasonal finds",
    color: "pink",
  },
];
function stored<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
export default function Storefront({ route }: { route: string }) {
  const path = route.split("?")[0],
    demo = path === "/demo" || path.startsWith("/demo/"),
    prefix = demo ? "/demo" : "",
    page = path.replace(/^\/demo/, "") || "/";
  const [data, setData] = useState<StoreData | null>(null),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState("All"),
    [sort, setSort] = useState("featured"),
    [budget, setBudget] = useState(0),
    [available, setAvailable] = useState(false),
    [slide, setSlide] = useState(0),
    [cartOpen, setCartOpen] = useState(false),
    [checkout, setCheckout] = useState(false),
    [wishlistOpen, setWishlistOpen] = useState(false),
    [locationOpen, setLocationOpen] = useState(false),
    [pin, setPin] = useState(() => stored("shift-pin", "")),
    [notice, setNotice] = useState(""),
    [success, setSuccess] = useState<any>(null),
    [filters, setFilters] = useState(false);
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>(() =>
    stored(demo ? "shift-demo-cart" : "shift-cart-v3", []),
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    stored(demo ? "shift-demo-wishlist" : "shift-wishlist", []),
  );
  useEffect(() => {
    setCart(stored(demo ? "shift-demo-cart" : "shift-cart-v3", []));
    setWishlist(stored(demo ? "shift-demo-wishlist" : "shift-wishlist", []));
  }, [demo]);
  const reload = () =>
    api<StoreData>("/store")
      .then(setData)
      .catch((e) => setError(e.message));
  useEffect(() => {
    reload();
  }, []);
  useEffect(() => {
    localStorage.setItem(
      demo ? "shift-demo-cart" : "shift-cart-v3",
      JSON.stringify(cart),
    );
  }, [cart, demo]);
  useEffect(() => {
    localStorage.setItem(
      demo ? "shift-demo-wishlist" : "shift-wishlist",
      JSON.stringify(wishlist),
    );
  }, [wishlist, demo]);
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  const products = demo ? demoProducts : data?.products || [];
  const allCategories = [
    ...new Set([
      ...categories,
      ...products.map((p) => p.category).filter(Boolean),
    ]),
  ];
  const shop = (selected = "All", max = 0) => {
    setCategory(selected);
    setBudget(max);
    setSearch("");
    navigate(prefix + "/shop");
  };
  const add = (p: Product, buy = false) => {
    setCart((current) => {
      const existing = current.find((i) => i.id === p.id);
      return existing
        ? current.map((i) =>
            i.id === p.id
              ? { ...i, quantity: Math.min(50, p.stock, i.quantity + 1) }
              : i,
          )
        : [...current, { id: p.id, quantity: 1 }];
    });
    if (buy) setCheckout(true);
    else {
      setCartOpen(true);
      setNotice("Added to your cart");
    }
  };
  const toggleWish = (id: string) =>
    setWishlist((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  const lines = cart
    .map((i) => ({
      product: products.find((p) => p.id === i.id),
      quantity: i.quantity,
    }))
    .filter((i) => !!i.product) as { product: Product; quantity: number }[];
  const count = lines.reduce((n, i) => n + i.quantity, 0),
    subtotal = lines.reduce((n, i) => n + i.product.price * i.quantity, 0),
    settings = data?.settings;
  const shipping = settings
    ? settings.freeShippingThreshold > 0 &&
      subtotal >= settings.freeShippingThreshold
      ? 0
      : settings.shippingFee
    : 0;
  const filtered = products
    .filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!budget || p.price <= budget) &&
        (!available || p.stock > 0) &&
        `${p.name} ${p.category} ${p.description}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "discount"
            ? discount(b) - discount(a)
            : Number(b.featured) - Number(a.featured),
    );
  const product = page.startsWith("/products/")
    ? products.find((p) => p.slug === page.slice(10))
    : null;
  const campaign = campaigns[slide];
  if (!data)
    return (
      <div className="loading">
        <Brand />
        <p>{error || "Getting your store ready…"}</p>
        {error && (
          <button className="btn" onClick={reload}>
            Try again
          </button>
        )}
      </div>
    );
  const card = (p: Product) => (
    <ProductCard
      key={p.id}
      product={p}
      prefix={prefix}
      wished={wishlist.includes(p.id)}
      toggle={() => toggleWish(p.id)}
      add={() => add(p)}
    />
  );
  const searchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCategory("All");
    setBudget(0);
    navigate(prefix + "/shop");
  };
  return (
    <div className="market">
      {demo && (
        <div className="m-demo-bar">
          <span>
            <EyeIcon /> DEMO STOREFRONT{" "}
            <span>· Sample products. Purchases disabled.</span>
          </span>
          <Link to="/">
            Back to real store <ArrowUpRight size={13} />
          </Link>
        </div>
      )}
      <div className="m-topbar">
        <span>Discover something new. Every season.</span>
        <div>
          <Link to={prefix + "/orders"}>Track your order</Link>
          <span>•</span>
          <Link to={prefix + "/contact"}>Help & support</Link>
        </div>
      </div>
      <header className="m-header">
        <Link className="m-logo" to={prefix || "/"}>
          shift<span>store</span>
          <i>↗</i>
          <small>GOOD FINDS. GREAT LIVING.</small>
        </Link>
        <button className="m-location" onClick={() => setLocationOpen(true)}>
          <MapPin size={20} />
          <span>
            <small>Delivering across India</small>
            <strong>
              {pin ? "PIN " + pin : "Set delivery PIN"}{" "}
              <ChevronDown size={11} />
            </strong>
          </span>
        </button>
        <form className="m-search" onSubmit={searchSubmit}>
          <Search size={20} />
          <input
            aria-label="Search products"
            placeholder="Search for décor, gifts, everyday essentials & more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X size={15} />
            </button>
          )}
          <button type="submit" aria-label="Search">
            <ArrowRight size={20} />
          </button>
        </form>
        <div className="m-header-links">
          <Link to={prefix + "/orders"} aria-label="My orders">
            <Package size={22} />
            <span>My orders</span>
          </Link>
          <button aria-label="Wishlist" onClick={() => setWishlistOpen(true)}>
            <Heart size={22} />
            <span>Wishlist</span>
            {wishlist.length > 0 && <b>{wishlist.length}</b>}
          </button>
          <button
            className="m-cart-button"
            aria-label={`Cart with ${count} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart size={23} />
            <span>Cart</span>
            <b>{count}</b>
          </button>
        </div>
      </header>
      <nav className="m-nav">
        <button
          className={page === "/shop" && category === "All" ? "active" : ""}
          onClick={() => shop()}
        >
          <LayoutGrid size={16} /> All categories
        </button>
        {allCategories.slice(0, 6).map((c) => (
          <button
            className={category === c && page === "/shop" ? "active" : ""}
            key={c}
            onClick={() => shop(c)}
          >
            {c} <ChevronDown size={11} />
          </button>
        ))}
        <button
          className="m-nav-deal"
          onClick={() => {
            shop();
            setSort("discount");
          }}
        >
          Explore offers <span>NEW</span>
        </button>
      </nav>
      <main className="m-main">
        {page === "/" ? (
          <>
            <section className="m-hero-row">
              <div className={"m-hero " + campaign.color}>
                <div className="m-hero-copy">
                  <span className="m-kicker">{campaign.tag}</span>
                  <h1>{campaign.title}</h1>
                  <p>{campaign.description}</p>
                  <button
                    className="m-primary"
                    onClick={() => shop(campaign.category)}
                  >
                    {campaign.button} <ArrowRight size={16} />
                  </button>
                  <div className="m-slider-dots">
                    {campaigns.map((c, i) => (
                      <button
                        key={c.tag}
                        aria-label={`Show banner ${i + 1}`}
                        aria-pressed={slide === i}
                        onClick={() => setSlide(i)}
                        className={slide === i ? "active" : ""}
                      />
                    ))}
                  </div>
                </div>
                <img
                  className="m-hero-image"
                  src={"/images/" + campaign.image + ".jpg"}
                  alt="Home and lifestyle inspiration"
                />
                <div className="m-hero-sticker">
                  A fresh find.
                  <br />
                  <strong>A happy home.</strong>
                  <span>THE SHIFTSTORE EDIT</span>
                </div>
                <button
                  className="m-next-slide"
                  aria-label="Next banner"
                  onClick={() => setSlide((slide + 1) % campaigns.length)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <aside className="m-side-promos">
                <button
                  className="m-promo-gift"
                  onClick={() => shop("Gifts & Seasonal")}
                >
                  <Gift size={25} />
                  <span>
                    Little gifts.
                    <br />
                    <strong>Big smiles.</strong>
                  </span>
                  <small>
                    Find a little something <ArrowRight size={14} />
                  </small>
                  <div className="gift-visual">✦</div>
                </button>
                <button
                  className="m-promo-budget"
                  onClick={() => shop("All", 99900)}
                >
                  <span>GOOD FINDS, SMALL PRICES</span>
                  <strong>
                    Discover under
                    <br />
                    <b>₹999</b>
                  </strong>
                  <small>
                    Explore the collection <ArrowRight size={14} />
                  </small>
                </button>
              </aside>
            </section>
            <section className="m-service-row">
              <span>
                <Truck />
                <span>
                  <strong>Delivered to your door</strong>
                  <small>Shipping calculated at checkout</small>
                </span>
              </span>
              <span>
                <ShieldCheck />
                <span>
                  <strong>Shop with confidence</strong>
                  <small>Clear prices & store policies</small>
                </span>
              </span>
              <span>
                <CreditCard />
                <span>
                  <strong>Your choice of payment</strong>
                  <small>
                    {data.paymentMethods.some((m) => m.id === "cashfree")
                      ? "Cashfree online payments & COD"
                      : "Cash on delivery available"}
                  </small>
                </span>
              </span>
              <span>
                <Headphones />
                <span>
                  <strong>Here when you need us</strong>
                  <small>Contact our store team</small>
                </span>
              </span>
            </section>
            <section className="m-section">
              <div className="m-section-heading">
                <div>
                  <h2>What are you shopping for?</h2>
                  <p>A little inspiration for every part of your day.</p>
                </div>
                <button onClick={() => shop()}>
                  View all categories <ArrowRight size={16} />
                </button>
              </div>
              <div className="m-category-grid">
                {allCategories.slice(0, 6).map((c, i) => (
                  <button key={c} onClick={() => shop(c)}>
                    <div className={"m-category-photo tone-" + i}>
                      <img
                        src={
                          products.find((p) => p.category === c && p.image)
                            ?.image ||
                          "/images/" +
                            (categoryImages[c] || "interior") +
                            ".jpg"
                        }
                        alt=""
                        loading="lazy"
                      />
                    </div>
                    <strong>{c}</strong>
                    <span>
                      Explore collection <ChevronRight size={12} />
                    </span>
                  </button>
                ))}
              </div>
            </section>
            <section className="m-section">
              <div className="m-section-heading">
                <div>
                  <span className="m-small-tag">THE GOOD-FINDS EDIT</span>
                  <h2>
                    {products.length
                      ? "Featured finds for your everyday"
                      : "Your next favorite is on its way"}
                  </h2>
                </div>
                <button onClick={() => shop()}>
                  View all <ArrowRight size={16} />
                </button>
              </div>
              {products.length ? (
                <div className="m-product-grid">
                  {[...products]
                    .sort((a, b) => Number(b.featured) - Number(a.featured))
                    .slice(0, 5)
                    .map(card)}
                </div>
              ) : (
                <div className="m-coming-soon">
                  <Package size={35} />
                  <div>
                    <h3>We’re getting our first collection ready.</h3>
                    <p>
                      Explore our categories and inspiration. New products will
                      appear here as soon as they’re available.
                    </p>
                  </div>
                  <Link to="/demo" className="m-outline">
                    Preview the shopping experience <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </section>
            <section className="m-discovery-banners">
              <button onClick={() => shop("Home & Living")}>
                <img src="/images/living.jpg" alt="Cozy home inspiration" />
                <div>
                  <span>MAKE YOURSELF AT HOME</span>
                  <h3>
                    A fresh look.
                    <br />A familiar feeling.
                  </h3>
                  <b>
                    Explore home & living <ArrowRight size={16} />
                  </b>
                </div>
              </button>
              <button onClick={() => shop("Garden & Outdoors")}>
                <img
                  src="/images/plants.jpg"
                  alt="Succulent in a mint planter"
                />
                <div>
                  <span>BRING THE OUTSIDE IN</span>
                  <h3>
                    A little green
                    <br />
                    goes a long way.
                  </h3>
                  <b>
                    Explore garden finds <ArrowRight size={16} />
                  </b>
                </div>
              </button>
            </section>
            {products.length > 0 && (
              <section className="m-section">
                <div className="m-section-heading">
                  <div>
                    <span className="m-small-tag">
                      LITTLE UPGRADES. HAPPY PRICES.
                    </span>
                    <h2>Discover finds under ₹999</h2>
                  </div>
                  <button onClick={() => shop("All", 99900)}>
                    View all <ArrowRight size={16} />
                  </button>
                </div>
                <div className="m-product-grid">
                  {products
                    .filter((p) => p.price <= 99900)
                    .slice(0, 5)
                    .map(card)}
                </div>
                {!products.some((p) => p.price <= 99900) && (
                  <p className="m-no-results">
                    New budget-friendly finds are on the way.
                  </p>
                )}
              </section>
            )}
            <section className="m-season-banner">
              <Gift size={40} />
              <div>
                <span>THERE’S ALWAYS SOMETHING TO DISCOVER</span>
                <h2>One store. Every season of your life.</h2>
                <p>
                  From home refreshes to thoughtful gifting — explore what’s new
                  at ShiftStore.
                </p>
              </div>
              <button className="m-primary" onClick={() => shop()}>
                Explore all products <ArrowRight size={16} />
              </button>
            </section>
          </>
        ) : page === "/shop" ? (
          <>
            <div className="m-shop-intro">
              <div className="m-breadcrumb">
                <Link to={prefix || "/"}>Home</Link>
                <ChevronRight size={12} />
                <span>{category === "All" ? "All products" : category}</span>
              </div>
              <h1>
                {search
                  ? "Results for “" + search + "”"
                  : category === "All"
                    ? "Find your next favorite"
                    : category}
              </h1>
              <p>
                {filtered.length} products{" "}
                {demo
                  ? "in this demonstration collection"
                  : "in the collection"}
              </p>
            </div>
            <div className="m-shop-layout">
              <aside className={"m-filters " + (filters ? "open" : "")}>
                <div>
                  <h3>Filters</h3>
                  <button
                    onClick={() => {
                      setCategory("All");
                      setBudget(0);
                      setAvailable(false);
                      setSearch("");
                    }}
                  >
                    Clear all
                  </button>
                </div>
                <h4>CATEGORIES</h4>
                {["All", ...allCategories].map((c) => (
                  <label key={c}>
                    <input
                      type="radio"
                      checked={category === c}
                      onChange={() => setCategory(c)}
                    />
                    {c}
                  </label>
                ))}
                <h4>PRICE RANGE</h4>
                <select
                  aria-label="Maximum price"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                >
                  <option value={0}>All prices</option>
                  <option value={49900}>Under ₹499</option>
                  <option value={99900}>Under ₹999</option>
                  <option value={199900}>Under ₹1,999</option>
                  <option value={499900}>Under ₹4,999</option>
                </select>
                <h4>AVAILABILITY</h4>
                <label>
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                  />{" "}
                  In stock only
                </label>
              </aside>
              <div className="m-results">
                <div className="m-sort-row">
                  <button
                    className="m-filter-toggle"
                    onClick={() => setFilters(!filters)}
                  >
                    <SlidersHorizontal size={16} /> Filters
                  </button>
                  <span>{filtered.length} results</span>
                  <label>
                    Sort by{" "}
                    <select
                      aria-label="Sort products"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="featured">Featured</option>
                      <option value="low">Price: low to high</option>
                      <option value="high">Price: high to low</option>
                      <option value="discount">Biggest discount</option>
                    </select>
                  </label>
                </div>
                {filtered.length ? (
                  <div className="m-product-grid results-grid">
                    {filtered.map(card)}
                  </div>
                ) : (
                  <Empty
                    title="No products here yet"
                    description={
                      products.length
                        ? "Try another category or clear your filters."
                        : "We’re preparing this collection. Check back for new arrivals."
                    }
                    action={
                      <button className="m-outline" onClick={() => shop()}>
                        Browse all categories
                      </button>
                    }
                  />
                )}
              </div>
            </div>
          </>
        ) : product ? (
          <ProductDetail
            product={product}
            add={(buy) => add(product, buy)}
            wished={wishlist.includes(product.id)}
            toggle={() => toggleWish(product.id)}
            data={data}
            pin={pin}
            setPin={() => setLocationOpen(true)}
            prefix={prefix}
          />
        ) : page === "/orders" || page === "/payment-return" ? (
          <Orders
            returnId={new URLSearchParams(route.split("?")[1] || "").get(
              "order_id",
            )}
            demo={demo}
            onPaid={() => setCart([])}
          />
        ) : page === "/contact" ? (
          <Contact email={data.settings.email} demo={demo} />
        ) : page === "/about" ? (
          <div className="m-info-page">
            <span className="m-small-tag">WELCOME TO SHIFTSTORE</span>
            <h1>Good finds for real life.</h1>
            <p>
              We’re building a place to discover something useful, something
              beautiful, and sometimes, something completely unexpected. Home
              décor is where we begin. Each season brings room for something
              new.
            </p>
            <img src="/images/interior.jpg" alt="A thoughtfully styled home" />
            <h2>One place. Plenty of possibilities.</h2>
            <p>
              Explore a growing collection, compare clear prices, and choose the
              things that work for you. Need help? Reach our store team through
              the contact page.
            </p>
            <button className="m-primary" onClick={() => shop()}>
              Discover the collection <ArrowRight size={16} />
            </button>
          </div>
        ) : page === "/policies" ? (
          <div className="m-info-page">
            <h1>Shopping with ShiftStore</h1>
            <h2>Shipping & delivery</h2>
            <p>{data.settings.shippingPolicy}</p>
            <h2>Returns & replacements</h2>
            <p>{data.settings.returnPolicy}</p>
            <h2>Payments & privacy</h2>
            <p>
              Order details are stored to fulfill your order and support your
              purchase. When you choose online payment, Cashfree handles your
              payment details. Contact us about your information or order using
              the help page.
            </p>
          </div>
        ) : (
          <Empty
            title="Page not found"
            description="Let’s find you something good instead."
            action={
              <Link className="m-primary" to={prefix || "/"}>
                Back to store
              </Link>
            }
          />
        )}
      </main>
      <section className="m-help-strip">
        <Headphones size={27} />
        <div>
          <strong>A little help goes a long way.</strong>
          <span>Questions about a product or order? We’re here.</span>
        </div>
        <Link to={prefix + "/contact"}>
          Get in touch <ArrowRight size={17} />
        </Link>
      </section>
      <footer className="m-footer">
        <div className="m-footer-top">
          <div className="m-footer-brand">
            <Link to={prefix || "/"} className="m-logo">
              shift<span>store</span>
              <i>↗</i>
            </Link>
            <p>
              Good finds for your home.
              <br />
              Fresh discoveries for every season.
            </p>
            <span>Made for everyday living.</span>
          </div>
          <div>
            <h4>EXPLORE</h4>
            <button onClick={() => shop()}>All products</button>
            <button onClick={() => shop("Home Décor")}>Home décor</button>
            <button onClick={() => shop("Gifts & Seasonal")}>
              Seasonal finds
            </button>
            <Link to={prefix + "/about"}>About ShiftStore</Link>
          </div>
          <div>
            <h4>CUSTOMER CARE</h4>
            <Link to={prefix + "/orders"}>My orders</Link>
            <Link to={prefix + "/contact"}>Contact us</Link>
            <Link to={prefix + "/policies"}>Shipping & returns</Link>
            <button aria-label="Wishlist" onClick={() => setWishlistOpen(true)}>
              My wishlist
            </button>
          </div>
          <div>
            <h4>SHOP WITH CONFIDENCE</h4>
            <p>
              <ShieldCheck size={15} /> Secure online checkout
            </p>
            <p>
              <Truck size={15} /> Cash on delivery available
            </p>
            <div className="m-payment-logos">
              <b>UPI</b>
              <b>VISA</b>
              <b>RuPay</b>
              <b>Cashfree</b>
            </div>
          </div>
        </div>
        <div className="m-footer-bottom">
          <span>
            © {new Date().getFullYear()} {data.settings.name}. All rights
            reserved.
          </span>
          <span>India · English · INR ₹</span>
        </div>
      </footer>
      {cartOpen && (
        <Modal
          title={`Shopping cart (${count})`}
          onClose={() => setCartOpen(false)}
        >
          <div className="modal-body">
            {!lines.length ? (
              <Empty
                title="Your cart is waiting for a good find"
                description="Explore our collection and add something you love."
                action={
                  <button
                    className="m-primary"
                    onClick={() => {
                      setCartOpen(false);
                      shop();
                    }}
                  >
                    Start shopping <ArrowRight size={16} />
                  </button>
                }
              />
            ) : (
              <>
                {demo && (
                  <p className="notice">
                    Demo cart — sample items cannot be purchased.
                  </p>
                )}
                {lines.map(({ product: p, quantity }) => (
                  <div className="bag-line" key={p.id}>
                    <div className="bag-image">
                      {p.image ? (
                        <img src={p.image} alt={p.name} />
                      ) : (
                        <Package />
                      )}
                    </div>
                    <div className="bag-info">
                      <strong>{p.name}</strong>
                      <span>{money(p.price)}</span>
                      <div className="quantity">
                        <button
                          aria-label={`Decrease ${p.name}`}
                          onClick={() =>
                            setCart((current) =>
                              current.flatMap((i) =>
                                i.id === p.id
                                  ? i.quantity > 1
                                    ? [{ ...i, quantity: i.quantity - 1 }]
                                    : []
                                  : [i],
                              ),
                            )
                          }
                        >
                          <Minus size={13} />
                        </button>
                        <span>{quantity}</span>
                        <button
                          disabled={quantity >= p.stock || quantity >= 50}
                          aria-label={`Increase ${p.name}`}
                          onClick={() =>
                            setCart((current) =>
                              current.map((i) =>
                                i.id === p.id
                                  ? { ...i, quantity: i.quantity + 1 }
                                  : i,
                              ),
                            )
                          }
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      {quantity > p.stock && (
                        <small className="error-text">
                          Only {p.stock} available. Update quantity.
                        </small>
                      )}
                    </div>
                    <button
                      aria-label={`Remove ${p.name}`}
                      className="icon-btn"
                      onClick={() =>
                        setCart((current) =>
                          current.filter((i) => i.id !== p.id),
                        )
                      }
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div className="totals">
                  <div>
                    <span>Subtotal</span>
                    <strong>{money(subtotal)}</strong>
                  </div>
                  <div>
                    <span>Delivery</span>
                    <span>{shipping ? money(shipping) : "FREE"}</span>
                  </div>
                  <div className="grand-total">
                    <strong>Total</strong>
                    <strong>{money(subtotal + shipping)}</strong>
                  </div>
                </div>
                <button
                  className="m-primary full"
                  disabled={
                    lines.some((i) => i.quantity > i.product.stock) ||
                    (!demo && !data.paymentMethods.length)
                  }
                  onClick={() => {
                    setCartOpen(false);
                    setCheckout(true);
                  }}
                >
                  {demo ? "Preview checkout" : "Proceed to checkout"}{" "}
                  <ArrowRight size={18} />
                </button>
                {!data.paymentMethods.length && !demo && (
                  <p className="notice">Checkout is currently unavailable.</p>
                )}
              </>
            )}
          </div>
        </Modal>
      )}
      {checkout && (
        <Checkout
          data={data}
          lines={lines}
          total={subtotal + shipping}
          demo={demo}
          onClose={() => setCheckout(false)}
          onSuccess={(o) => {
            setCheckout(false);
            setSuccess(o);
            setCart([]);
            reload();
          }}
        />
      )}
      {wishlistOpen && (
        <Modal
          title={`Your wishlist (${wishlist.length})`}
          onClose={() => setWishlistOpen(false)}
          wide
        >
          <div className="modal-body">
            {products.some((p) => wishlist.includes(p.id)) ? (
              <div className="m-product-grid wish-grid">
                {products
                  .filter((p) => wishlist.includes(p.id))
                  .map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      prefix={prefix}
                      wished
                      toggle={() => toggleWish(p.id)}
                      add={() => {
                        setWishlistOpen(false);
                        add(p);
                      }}
                    />
                  ))}
              </div>
            ) : (
              <Empty
                title="Save the things you love"
                description="Tap the heart on a product to keep it here for later."
              />
            )}
          </div>
        </Modal>
      )}
      {locationOpen && (
        <Modal
          title="Set your delivery PIN"
          onClose={() => setLocationOpen(false)}
        >
          <form
            className="modal-body form"
            onSubmit={(e) => {
              e.preventDefault();
              const value = String(new FormData(e.currentTarget).get("pin"));
              setPin(value);
              localStorage.setItem("shift-pin", JSON.stringify(value));
              setLocationOpen(false);
              setNotice("Delivery PIN saved for this browser");
            }}
          >
            <p className="muted">
              Save your PIN for reference while shopping. Final delivery details
              are collected at checkout.
            </p>
            <label>
              6-digit PIN code
              <input
                name="pin"
                inputMode="numeric"
                pattern="[1-9][0-9]{5}"
                maxLength={6}
                defaultValue={pin}
                required
              />
            </label>
            <button className="m-primary">
              Save PIN <Check size={16} />
            </button>
          </form>
        </Modal>
      )}
      {success && (
        <Modal
          title="Order placed successfully"
          onClose={() => setSuccess(null)}
        >
          <div className="success-panel">
            <div className="success-check">
              <Check size={30} />
            </div>
            <h2>Thank you for shopping with us!</h2>
            <p>
              Order <strong>{success.number}</strong> has been saved. Keep this
              reference for your delivery.
            </p>
            <div className="order-receipt">
              <span>Cash on delivery</span>
              <strong>{money(success.total)}</strong>
            </div>
            <button
              className="m-primary full"
              onClick={() => {
                setSuccess(null);
                navigate("/orders");
              }}
            >
              View my order <ArrowRight size={16} />
            </button>
          </div>
        </Modal>
      )}
      {notice && (
        <div className="toast" role="status">
          <CheckCircle2 size={17} />
          {notice}
        </div>
      )}
    </div>
  );
}
function EyeIcon() {
  return <span className="m-demo-dot" />;
}
function discount(p: Product) {
  return p.compare_price > p.price
    ? Math.round(((p.compare_price - p.price) / p.compare_price) * 100)
    : 0;
}
function ProductCard({
  product: p,
  prefix,
  wished,
  toggle,
  add,
}: {
  product: Product;
  prefix: string;
  wished: boolean;
  toggle: () => void;
  add: () => void;
}) {
  return (
    <article className="m-product">
      <div className="m-product-image">
        <Link to={prefix + "/products/" + p.slug}>
          {p.image ? (
            <img src={p.image} alt={p.name} loading="lazy" />
          ) : (
            <Package size={55} />
          )}
        </Link>
        {discount(p) > 0 && (
          <span className="m-discount">{discount(p)}% OFF</span>
        )}
        <button
          className={"m-heart " + (wished ? "saved" : "")}
          aria-label={`${wished ? "Remove" : "Save"} ${p.name} ${wished ? "from" : "to"} wishlist`}
          aria-pressed={wished}
          onClick={toggle}
        >
          <Heart size={17} fill={wished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="m-product-info">
        <span className="m-product-category">
          {p.category || "NEW DISCOVERIES"}
        </span>
        <Link to={prefix + "/products/" + p.slug}>
          <h3>{p.name}</h3>
        </Link>
        <div className="m-product-price">
          <strong>{money(p.price)}</strong>
          {discount(p) > 0 && <del>{money(p.compare_price)}</del>}
        </div>
        <p className="m-stock">
          {p.stock > 0 ? (
            <>
              <span /> In stock
            </>
          ) : (
            "Currently unavailable"
          )}
        </p>
        <button className="m-add" disabled={!p.stock} onClick={add}>
          <ShoppingCart size={15} /> Add to cart
        </button>
      </div>
    </article>
  );
}
function ProductDetail({
  product: p,
  add,
  wished,
  toggle,
  data,
  pin,
  setPin,
  prefix,
}: {
  product: Product;
  add: (buy: boolean) => void;
  wished: boolean;
  toggle: () => void;
  data: StoreData;
  pin: string;
  setPin: () => void;
  prefix: string;
}) {
  return (
    <>
      <div className="m-breadcrumb">
        <Link to={prefix || "/"}>Home</Link>
        <ChevronRight size={12} />
        <Link to={prefix + "/shop"}>Products</Link>
        <ChevronRight size={12} />
        {p.category}
      </div>
      <section className="m-pdp">
        <div className="m-pdp-image">
          {p.image ? <img src={p.image} alt={p.name} /> : <Package size={90} />}
          <button
            className="m-heart"
            aria-label="Save product to wishlist"
            onClick={toggle}
          >
            <Heart fill={wished ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="m-pdp-info">
          <span className="m-small-tag">{p.category}</span>
          <h1>{p.name}</h1>
          <div className="m-pdp-price">
            <strong>{money(p.price)}</strong>
            {discount(p) > 0 && (
              <>
                <del>{money(p.compare_price)}</del>
                <span>{discount(p)}% off</span>
              </>
            )}
          </div>
          <small>Inclusive of applicable taxes</small>
          <p className="m-pdp-description">
            {p.description ||
              "Discover a new addition to your everyday. Contact us if you need more product information."}
          </p>
          <p className="m-stock">
            <span />
            {p.stock ? "In stock — ready to order" : "Currently out of stock"}
          </p>
          <div className="m-pdp-actions">
            <button
              className="m-outline"
              disabled={!p.stock}
              onClick={() => add(false)}
            >
              <ShoppingCart size={19} /> Add to cart
            </button>
            <button
              className="m-primary"
              disabled={!p.stock}
              onClick={() => add(true)}
            >
              Buy now <ArrowRight size={18} />
            </button>
          </div>
          <div className="m-delivery-box">
            <MapPin size={20} />
            <div>
              <strong>Delivery details</strong>
              <p>
                {pin
                  ? "Your saved PIN: " + pin
                  : "Set a PIN for your delivery address"}
              </p>
            </div>
            <button onClick={setPin}>{pin ? "Change" : "Set PIN"}</button>
          </div>
          <div className="m-pdp-trust">
            <span>
              <ShieldCheck size={21} />
              Secure checkout
            </span>
            <span>
              <Package size={21} />
              Careful packing
            </span>
            <span>
              <Headphones size={21} />
              Customer support
            </span>
          </div>
          <details open>
            <summary>Product information</summary>
            <p>{p.description}</p>
            <p>
              Category: {p.category || "General"}
              <br />
              Product reference: {p.id.slice(0, 8).toUpperCase()}
            </p>
          </details>
          <details>
            <summary>Delivery & returns</summary>
            <p>{data.settings.shippingPolicy}</p>
            <p>{data.settings.returnPolicy}</p>
          </details>
        </div>
      </section>
    </>
  );
}
function Orders({
  returnId,
  demo,
  onPaid,
}: {
  returnId: string | null;
  demo: boolean;
  onPaid: () => void;
}) {
  const [list, setList] = useState<any[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const keys = demo ? [] : receipts();
  async function load() {
    setBusy(true);
    setError("");
    try {
      const selected = returnId ? keys.filter((k) => k.id === returnId) : keys;
      if (returnId && !selected.length)
        throw new Error(
          "Open this page in the browser used to place your order.",
        );
      const values = await Promise.all(
        selected.map(async (k) => ({
          ...(await api("/orders/" + k.id + "/status", {
            headers: { "X-Order-Token": k.token },
          })),
          key: k,
        })),
      );
      setList(values);
      if (returnId && values.some((v) => v.order.paymentStatus === "PAID"))
        onPaid();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    load();
  }, [returnId, demo]);
  useEffect(() => {
    if (
      !returnId ||
      !list.some(
        (x) =>
          x.order.paymentStatus === "PENDING" &&
          x.order.paymentMethod !== "COD" &&
          x.order.status !== "CANCELLED",
      )
    )
      return;
    const timer = setTimeout(load, 6000);
    return () => clearTimeout(timer);
  }, [list, returnId]);
  return (
    <section className="m-orders-page">
      <div className="m-section-heading">
        <div>
          <span className="m-small-tag">YOUR SHOPPING, ALL IN ONE PLACE</span>
          <h1>{returnId ? "Payment & order status" : "My orders"}</h1>
          <p>Orders placed from this browser appear here.</p>
        </div>
        <button onClick={load} disabled={busy}>
          {busy ? "Checking…" : "Refresh status"}
        </button>
      </div>
      <ErrorBox error={error} />
      {!list.length && !error ? (
        <Empty
          title={
            busy ? "Looking up your orders…" : "Your first good find is waiting"
          }
          description={
            demo
              ? "Demo purchases are disabled. Your real orders will appear in the live store."
              : "Once you place an order, you can check its status here."
          }
          action={
            <Link to={demo ? "/demo/shop" : "/shop"} className="m-primary">
              Explore products
            </Link>
          }
        />
      ) : (
        list.map(({ order: o, payment }) => (
          <article key={o.id} className="m-order-card">
            <div>
              <strong>{o.number}</strong>
              <span
                className={
                  "badge " + (o.paymentStatus === "PAID" ? "green" : "amber")
                }
              >
                {o.paymentStatus === "PAID"
                  ? "Payment verified"
                  : o.paymentMethod === "COD"
                    ? "Cash on delivery"
                    : o.status === "CANCELLED"
                      ? "Payment expired"
                      : "Awaiting payment"}
              </span>
            </div>
            <p>
              {o.paymentStatus === "PAID"
                ? "Your payment is confirmed. We’ll take care of your order."
                : o.paymentMethod === "COD"
                  ? "Your order is confirmed. Pay when it arrives."
                  : o.status === "CANCELLED"
                    ? "This payment session has expired. You can place a new order."
                    : "Payment has not been confirmed yet. Complete payment or refresh its status."}
            </p>
            {o.items.map((i: any) => (
              <div className="order-item" key={i.productId}>
                <span>
                  {i.name} × {i.quantity}
                </span>
                <strong>{money(i.price * i.quantity)}</strong>
              </div>
            ))}
            <div className="m-order-summary">
              <span>
                Order status: <strong>{o.status}</strong>
              </span>
              <strong>{money(o.total)}</strong>
            </div>
            {o.tracking && <p>Tracking: {o.tracking}</p>}
            {payment && (
              <button
                className="m-primary"
                onClick={async () => {
                  try {
                    await launchPayment(payment);
                  } catch (e: any) {
                    setError(e.message);
                  }
                }}
              >
                Continue payment <ArrowRight size={16} />
              </button>
            )}
          </article>
        ))
      )}
    </section>
  );
}
function Contact({ email, demo }: { email: string; demo: boolean }) {
  const [sent, setSent] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (demo) return;
    setBusy(true);
    try {
      await api(
        "/contact",
        write("POST", Object.fromEntries(new FormData(e.currentTarget))),
      );
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="m-contact-page">
      <div>
        <span className="m-small-tag">WE’RE HERE TO HELP</span>
        <h1>Let’s talk.</h1>
        <p>
          Questions about a product, payment or delivery? Send our store team a
          message.
        </p>
        {email && (
          <a href={"mailto:" + email}>
            <Mail size={18} />
            {email}
          </a>
        )}
      </div>
      {sent ? (
        <Empty
          title="Your message is with us"
          description="Our team will review your message. Thanks for getting in touch."
        />
      ) : (
        <form className="form" onSubmit={submit}>
          <ErrorBox error={error} />
          {demo && (
            <div className="notice">Demo preview — messages are not sent.</div>
          )}
          <label>
            Name
            <input name="name" required minLength={2} />
          </label>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Message
            <textarea name="message" required minLength={10} rows={5} />
          </label>
          <button className="m-primary" disabled={busy || demo}>
            {busy ? "Sending…" : "Send message"}
            <ArrowRight size={17} />
          </button>
        </form>
      )}
    </section>
  );
}
