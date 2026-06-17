import { Link } from 'react-router-dom';
import { Nav }    from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/button';
import { MINI_SERVICES, inr } from '@/lib/bathease';
import { Bath, CheckCircle2, Star, Zap, Shield, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const carouselImages = [
  { src: '/img4.png', alt: 'Exhaust and mirror cleaning' },
  { src: '/img5.png', alt: 'Premium bathroom service' },
  { src: '/img1.png', alt: 'Bathroom cleaning service' },
  { src: '/img2.png', alt: 'Professional deep clean' },
  { src: '/img3.png', alt: 'Tile and grout cleaning' },
]

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (idx) => {
    setCurrent(idx);
    startTimer();
  };

  const prev = () => goTo((current - 1 + carouselImages.length) % carouselImages.length);
  const next = () => goTo((current + 1) % carouselImages.length);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '390px' }}>

      {/* Images */}
      {carouselImages.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-fit"
          />
          {/* dark overlay for readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur hover:bg-white/40 transition text-white"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur hover:bg-white/40 transition text-white"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {carouselImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-7 bg-white' : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Bathroom packages ─────────────────────────────────────────────────────────
const bathroomPackages = [
  {
    id: 1,
    title: 'Single Bathroom',
    bathrooms: 1,
    price: 499,
    originalPrice: null,
    badge: null,
    color: 'from-blue-500 to-cyan-500',
    features: ['Full scrub & descale', 'Tile cleaning', 'Mirror polish', 'Sanitization'],
  },
  {
    id: 2,
    title: 'Double Bathroom',
    bathrooms: 2,
    price: 898,
    originalPrice: 998,
    badge: '10% OFF',
    color: 'from-primary to-teal-500',
    features: ['Everything in Single', '10% bundle discount', 'Priority scheduling', 'Free re-clean if needed'],
  },
  {
    id: 3,
    title: 'Triple Bathroom',
    bathrooms: 3,
    price: 1197,
    originalPrice: 1497,
    badge: '20% OFF',
    color: 'from-violet-500 to-purple-600',
    features: ['Everything in Double', '20% bundle discount', 'Same-day availability', 'Dedicated cleaner'],
  },
  {
    id: 4,
    title: 'Four Bathrooms',
    bathrooms: 4,
    price: 1596,
    originalPrice: 1996,
    badge: '20% OFF',
    color: 'from-orange-500 to-rose-500',
    features: ['Everything in Triple', 'Team of 2 cleaners', 'Post-clean inspection', 'Invoice provided'],
  },
  {
    id: 5,
    title: 'Five Bathrooms',
    bathrooms: 5,
    price: 1995,
    originalPrice: 2495,
    badge: 'BEST VALUE',
    color: 'from-emerald-500 to-green-600',
    features: ['Everything in Four', 'Team of 2 cleaners', 'Flexible time slots', 'Monthly plan available'],
  },
];

// ── Why choose us ─────────────────────────────────────────────────────────────
const highlights = [
  { icon: Shield,  title: 'Insured Professionals', desc: 'All cleaners are background-verified & insured.' },
  { icon: Clock,   title: 'Same-Day Slots',         desc: 'Book today, get cleaned today.' },
  { icon: Star,    title: '4.9 / 5 Rating',         desc: '12,000+ happy customers across 25 cities.' },
  { icon: Zap,     title: 'Instant Confirmation',   desc: 'Booking confirmed in under 60 seconds.' },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />

      {/* ── AUTO SCROLL IMAGE CAROUSEL ── */}
      <HeroCarousel />

      {/* ── Why us ── */}
      <section className="mx-auto max-w-7xl w-full px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.title} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{h.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bathroom Packages — horizontal scroll ── */}
      <section className="mx-auto max-w-7xl w-full px-6 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Bathroom Deep Clean Packages</h2>
          <p className="text-muted-foreground mt-1">More bathrooms = bigger savings. Scroll to explore →</p>
        </div>

        {/* Scrollable row */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-border">
          {bathroomPackages.map((pkg, i) => (
            <div
              key={pkg.id}
              className="snap-start shrink-0 w-64 rounded-3xl border border-border/60 bg-card shadow-soft flex flex-col overflow-hidden"
            >
              {/* Card top gradient */}
              <div className={`bg-gradient-to-br ${pkg.color} p-5 text-white relative`}>
                {pkg.badge && (
                  <span className="absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur px-2.5 py-0.5 text-[11px] font-bold tracking-wide">
                    {pkg.badge}
                  </span>
                )}
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 mb-3">
                  <Bath className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{pkg.title}</h3>
                <p className="text-sm text-white/80 mt-0.5">{pkg.bathrooms} bathroom{pkg.bathrooms > 1 ? 's' : ''}</p>

                {/* Price */}
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-3xl font-extrabold">{inr(pkg.price)}</span>
                  {pkg.originalPrice && (
                    <span className="text-sm text-white/60 line-through mb-1">{inr(pkg.originalPrice)}</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-col flex-1 p-5 gap-4">
                <ul className="space-y-2.5">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">
                  <Link to={`/booking?bathrooms=${pkg.bathrooms}`}>
                    <Button className="w-full" size="sm">
                      Book now <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mini services grid ── */}
      <section className="mx-auto max-w-7xl w-full px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Mini Add-on Services</h2>
          <p className="text-muted-foreground mt-1">
            Add to any booking. Bundle with bathroom clean → get <span className="text-success font-semibold">₹100 off</span>.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MINI_SERVICES.map((s) => {
            return (
              <div key={s.id}
                className="group rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-3 hover:shadow-soft hover:-translate-y-0.5 transition-all">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary overflow-hidden">
                  <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{s.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.description}</p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                  <span className="text-base font-bold text-primary">{inr(s.price)}</span>
                  <Link to="/booking">
                    <Button size="sm" variant="outline" className="h-7 text-xs px-3">Add</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-gradient-hero text-primary-foreground py-16 px-6 text-center">
        <h2 className="text-3xl font-bold">Ready for a sparkling clean bathroom?</h2>
        <p className="mt-3 text-primary-foreground/80">Book in under a minute. Flexible slots. Cancel anytime.</p>
        <Link to="/booking">
          <Button size="lg" variant="secondary" className="mt-7 shadow-glow">
            Start booking <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
