// BathEase pricing engine, constants and utilities.
// The localStorage store has been replaced by the Express API (src/lib/api.js).

export const MINI_SERVICES = [
  { id: "fan1.lpeg",        name: "Fan Cleaning",     price: 149, description: "Dust-free, deep-clean ceiling & wall fans.",    image: "/fan.jpeg" },
  { id: "door",       name: "Door Cleaning",    price: 99,  description: "Hinges, handles, and full panel polish.",       image: "/door.jpeg" },
  { id: "wash-basin", name: "Wash Basin",       price: 129, description: "Stain & limescale removal, shine finish.",      image: "/washbasin.jpeg" },
  { id: "exhaust",    name: "Exhaust Cleaning", price: 179, description: "Grease and dust extraction from vents.",        image: "/exhaust_fan.jpeg" },
  { id: "mirror",     name: "Mirror Cleaning",  price: 79,  description: "Streak-free crystal clear mirrors.",           image: "/mirror.jpeg" },
  { id: "shower",     name: "Shower Cleaning",  price: 159, description: "Descale heads, polish fixtures.",              image: "/img2.png" },
  { id: "tile",       name: "Tile Cleaning",    price: 249, description: "Grout, mildew, and tile deep restore.",        image: "/tile_cleaning.jpeg" },
];

export const BATHROOM_PACKAGES = [
  {
    id: 1,
    title: 'Single Bathroom',
    bathrooms: 1,
    price: 499,
    originalPrice: null,
    badge: null,
    image: '/img6.png',
    rating: 4.9,
    reviews: 1240,
    duration: '1 hour',
    features: ['Full scrub & descale', 'Tile cleaning', 'Mirror polish', 'Sanitization'],
  },
  {
    id: 2,
    title: 'Double Bathroom',
    bathrooms: 2,
    price: 898,
    originalPrice: 998,
    badge: '10% OFF',
    image: '/img6.png',
    rating: 4.9,
    reviews: 950,
    duration: '1.5 hours',
    features: ['Full scrub & descale', 'Tile cleaning', 'Mirror polish', 'Sanitization'],
  },
  {
    id: 3,
    title: 'Triple Bathroom',
    bathrooms: 3,
    price: 1197,
    originalPrice: 1497,
    badge: '20% OFF',
    image: '/img6.png',
    rating: 4.8,
    reviews: 820,
    duration: '2 hours',
    features: ['Full scrub & descale', 'Tile cleaning', 'Mirror polish', 'Sanitization'],
  },
  {
    id: 4,
    title: 'Four Bathrooms',
    bathrooms: 4,
    price: 1596,
    originalPrice: 1996,
    badge: '20% OFF',
    image: '/img6.png',
    rating: 4.8,
    reviews: 680,
    duration: '2.5 hours',
    features: ['Full scrub & descale', 'Tile cleaning', 'Mirror polish', 'Sanitization'],
  },
  {
    id: 5,
    title: 'Five Bathrooms',
    bathrooms: 5,
    price: 1995,
    originalPrice: 2495,
    badge: 'BEST VALUE',
    image: '/img6.png',
    rating: 4.9,
    reviews: 1100,
    duration: '3 hours',
    features: ['Full scrub & descale', 'Tile cleaning', 'Mirror polish', 'Sanitization'],
  },
];

export const VALUE_DEALS = [
  {
    id: 1,
    title: 'Bathroom + Exhaust Fan',
    bathrooms: 1,
    totalPrice: 599,
    originalPrice: 699,
    badge: 'SAVE ₹100',
    image: '/bathroom_exhaustfan.jpeg',
    rating: 4.9,
    reviews: 890,
    duration: '1.5 hours',
    features: ['Full scrub & descale', 'Tile cleaning', 'Mirror polish', 'Exhaust fan cleaning'],
  },
  {
    id: 2,
    title: 'Bathroom + Washbasin',
    bathrooms: 1,
    totalPrice: 649,
    originalPrice: 798,
    badge: 'SAVE ₹149',
    image: '/washbasin1.jpeg',
    rating: 4.9,
    reviews: 756,
    duration: '1.5 hours',
    features: ['Full scrub & descale', 'Tile cleaning', 'Washbasin upgrade', 'Sanitization'],
  },
  {
    id: 3,
    title: 'Double + Floor Finishing',
    bathrooms: 2,
    totalPrice: 1099,
    originalPrice: 1298,
    badge: 'SAVE ₹199',
    image: '/floor_scrubber2.jpeg',
    rating: 4.8,
    reviews: 614,
    duration: '2 hours',
    features: ['Everything in Double', 'Premium floor finishing', 'Grout protection', 'Sanitization'],
  },
  {
    id: 4,
    title: 'Double + Exhaust + Fan',
    bathrooms: 2,
    totalPrice: 1149,
    originalPrice: 1447,
    badge: 'SAVE ₹298',
    image: '/bathroom_ceillingfan.jpeg',
    rating: 4.9,
    reviews: 502,
    duration: '2.25 hours',
    features: ['Everything in Double', 'Exhaust fan cleaning', 'Ventilation upgrade', 'Full sanitization'],
  },
  {
    id: 5,
    title: 'Triple + Premium Package',
    bathrooms: 3,
    totalPrice: 1549,
    originalPrice: 1997,
    badge: 'SAVE ₹448',
    image: '/tile_cleaning.jpeg',
    rating: 4.8,
    reviews: 441,
    duration: '2.5 hours',
    features: ['Everything in Triple', 'Premium floor coating', 'Fan cleaning', 'Wall polishing'],
  },
];

export const BATHROOM_BASE_PRICE = 499; // per bathroom

export const COUPONS = {
  WELCOME50:  { type: "flat",    value: 50,  label: "₹50 off welcome" },
  SHINE10:    { type: "percent", value: 10,  label: "10% off (SHINE10)" },
  SPARKLE20:  { type: "percent", value: 20,  label: "20% off (SPARKLE20)" },
};

export const STAFF = ["Ravi K.", "Priya S.", "Arjun M.", "Neha R.", "Kiran J."];

export const TIME_SLOTS = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

// ─── Pricing engine ───────────────────────────────────────────────────────────

export function computePrice(bathroomCount, miniServiceIds, couponCode) {
  const offersApplied = [];
  const bathroomSubtotal = Math.max(0, bathroomCount) * BATHROOM_BASE_PRICE;
  const miniSubtotal = miniServiceIds.reduce(
    (sum, id) => sum + (MINI_SERVICES.find((m) => m.id === id)?.price ?? 0),
    0,
  );

  let bathroomDiscount = 0;
  if (bathroomCount === 2) {
    bathroomDiscount = bathroomSubtotal * 0.1;
    offersApplied.push("2 bathrooms · 10% off");
  } else if (bathroomCount >= 3) {
    bathroomDiscount = bathroomSubtotal * 0.2;
    offersApplied.push(`${bathroomCount} bathrooms · 20% off`);
  }

  let bundleDiscount = 0;
  if (bathroomCount >= 1 && miniServiceIds.length >= 1) {
    bundleDiscount = 100;
    offersApplied.push("Bathroom + Mini bundle · ₹100 off");
  }

  let couponDiscount = 0;
  const code = couponCode?.trim().toUpperCase();
  const coupon = code ? COUPONS[code] : undefined;
  const preCouponNet = Math.max(0, bathroomSubtotal + miniSubtotal - bathroomDiscount - bundleDiscount);
  if (coupon) {
    couponDiscount = coupon.type === "flat" ? coupon.value : preCouponNet * (coupon.value / 100);
    offersApplied.push(`Coupon · ${coupon.label}`);
  }

  const net = Math.max(0, preCouponNet - couponDiscount);
  const taxes = Math.round(net * 0.05);
  const total = Math.round(net + taxes);

  return {
    bathroomCount,
    bathroomSubtotal,
    miniSubtotal,
    subtotal: bathroomSubtotal + miniSubtotal,
    bathroomDiscount: Math.round(bathroomDiscount),
    bundleDiscount,
    couponDiscount: Math.round(couponDiscount),
    couponCode: coupon ? code : undefined,
    taxes,
    total,
    offersApplied,
  };
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export const inr = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// ─── ID generation ────────────────────────────────────────────────────────────

export function genId() {
  return "BE-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// ─── Theme (still client-side only) ──────────────────────────────────────────

export const theme = {
  get: () => {
    try { return localStorage.getItem("bathease:theme") || "light"; } catch { return "light"; }
  },
  set: (t) => {
    try { localStorage.setItem("bathease:theme", t); } catch {}
  },
};

// ─── Invoice (client-side PDF generation) ────────────────────────────────────

export function buildInvoiceHtml(b) {
  const rows = [
    `<tr><td>Bathrooms × ${b.bathroomCount}</td><td style="text-align:right">${inr(b.price.bathroomSubtotal)}</td></tr>`,
    ...(b.miniServices || []).map((id) => {
      const m = MINI_SERVICES.find((x) => x.id === id);
      return m ? `<tr><td>${m.name}</td><td style="text-align:right">${inr(m.price)}</td></tr>` : "";
    }),
    b.price.bathroomDiscount ? `<tr><td>Bathroom discount</td><td style="text-align:right;color:#0a8">-${inr(b.price.bathroomDiscount)}</td></tr>` : "",
    b.price.bundleDiscount   ? `<tr><td>Bundle discount</td><td style="text-align:right;color:#0a8">-${inr(b.price.bundleDiscount)}</td></tr>` : "",
    b.price.couponDiscount   ? `<tr><td>Coupon ${b.price.couponCode ?? ""}</td><td style="text-align:right;color:#0a8">-${inr(b.price.couponDiscount)}</td></tr>` : "",
    `<tr><td>GST 5%</td><td style="text-align:right">${inr(b.price.taxes)}</td></tr>`,
    `<tr><td style="font-weight:700;border-top:2px solid #222;padding-top:8px">Total</td><td style="text-align:right;font-weight:700;border-top:2px solid #222;padding-top:8px">${inr(b.price.total)}</td></tr>`,
  ].join("");

  return `<!doctype html><html><head><meta charset="utf-8"/><title>Invoice ${b.bookingId || b.id}</title>
<style>
body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#111;padding:32px;max-width:720px;margin:auto}
h1{margin:0;color:#0891b2}.muted{color:#666;font-size:13px}
table{width:100%;border-collapse:collapse;margin-top:24px}
td{padding:8px 0;border-bottom:1px solid #eee;font-size:14px}
.box{background:#ecfeff;border:1px solid #a5f3fc;padding:16px;border-radius:12px;margin-top:24px}
.row{display:flex;justify-content:space-between;gap:24px;margin-top:24px}
</style></head><body>
<div class="row"><div><h1>BathEase</h1><div class="muted">Sparkling clean, every time.</div></div>
<div style="text-align:right"><div><strong>Invoice</strong> ${b.bookingId || b.id}</div>
<div class="muted">${new Date(b.createdAt).toLocaleString()}</div></div></div>
<div class="box">
<div><strong>Customer:</strong> ${b.userEmail}</div>
<div><strong>Service date:</strong> ${new Date(b.date).toDateString()} · ${b.slot}</div>
<div><strong>Address:</strong> ${b.address}</div>
<div><strong>Payment:</strong> ${b.paymentMethod.toUpperCase()}</div>
</div>
<table>${rows}</table>
<p class="muted" style="margin-top:32px">Thank you for choosing BathEase. For support, WhatsApp us anytime.</p>
</body></html>`;
}

export function downloadInvoice(b) {
  const html = buildInvoiceHtml(b);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `BathEase-${b.bookingId || b.id}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function whatsappLink(phone, message) {
  const clean = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
