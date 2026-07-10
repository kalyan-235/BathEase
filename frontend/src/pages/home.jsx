import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Nav }                 from '@/components/Nav';
import { Footer }              from '@/components/Footer';
import { Button }              from '@/components/button';
import { SelectService }       from '@/components/SelectService';
import { CleaningRequirement } from '@/components/CleaningRequirement';
import { ViewDetails }         from '@/components/ViewDetails';
import { MINI_SERVICES, BATHROOM_PACKAGES, VALUE_DEALS, inr } from '@/lib/bathease';
import { useContent } from '@/hooks/useContent';
import {
  Sparkles, ShieldCheck, Clock, Star, ArrowRight,
  CheckCircle2, Bath, Zap, Shield, Users, Award, ChevronRight,
} from 'lucide-react';

const testimonials = [
  { name: 'Priya S.',  city: 'Hyderabad', rating: 5, text: 'Absolutely spotless! The team was on time and professional. Best bathroom cleaning.' },
  { name: 'Ravi K.',   city: 'Bangalore', rating: 5, text: 'Booked for 2 bathrooms. Got 10% off automatically and the cleaner was fantastic.' },
  { name: 'Anitha R.', city: 'Chennai',   rating: 5, text: 'The exhaust fan bundle deal saved me ₹100. Really impressed with the results.' },
  { name: 'Vikram M.', city: 'Mumbai',    rating: 5, text: 'Same-day slot was available. Tile and grout looks brand new. Highly recommend!' },
];

const stats = [
  { value: '50,000+', label: 'Cleanings done',  icon: Award },
  { value: '4.9 / 5', label: 'Average rating',   icon: Star },
  { value: '25+',     label: 'Cities covered',   icon: Shield },
  { value: '12,000+', label: 'Happy customers',  icon: Users },
];

export default function Home() {
  const [selectedService, setSelectedService] = useState(null);

  // Live content from backend — falls back to static defaults if not saved yet
  const { data: bathroomPackages } = useContent('packages',     BATHROOM_PACKAGES);
  const { data: valueDeals }       = useContent('valueDeals',   VALUE_DEALS);
  const { data: miniServices }     = useContent('miniServices',  MINI_SERVICES);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-hero relative overflow-hidden w-full flex items-center text-primary-foreground">
        <div className="absolute inset-0 pointer-events-none [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.15),transparent_45%)]" />

        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left — copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium ring-1 ring-white/20 mb-4 sm:mb-5">
              <Sparkles className="h-3.5 w-3.5 shrink-0" /> Now serving 25+ cities across India
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Bathrooms so clean,<br />
              <span className="text-white/80">they sparkle.</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed text-primary-foreground/80 max-w-md">
              Book vetted professionals for a deep clean — tiles, exhausts, mirrors and more.
              Transparent pricing, instant offers, zero hassle.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
              <Link to="/booking">
                <Button size="lg" variant="secondary" className="shadow-glow">
                  Book a cleaning <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
                  Browse services
                </Button>
              </Link>
            </div>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-primary-foreground/80">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 shrink-0" /> Insured & verified</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 shrink-0" /> Same-day slots</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 shrink-0" /> 4.9 / 5 rating</span>
            </div>
          </div>

          {/* Right — service selector */}
          <div className="w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
            <SelectService />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-6 sm:py-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2 sm:gap-3">
              <div className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-white/15">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-base sm:text-xl font-bold leading-none">{value}</p>
                <p className="text-[10px] sm:text-xs text-primary-foreground/70 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CLEANING REQUIREMENT ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">What we bring to your home</h2>
          <p className="mt-2 text-sm text-muted-foreground">Professional-grade equipment for every job.</p>
        </div>
        <CleaningRequirement />
      </section>

      {/* ── DEEP CLEAN PACKAGES ──────────────────────────────────────────── */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Bathroom Deep Clean Packages</h2>
              <p className="mt-1 sm:mt-2 text-sm text-muted-foreground">Discounts applied automatically.</p>
            </div>
            <Link to="/services" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0">
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Horizontal scroll — cards sized relative to viewport on mobile */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-border">
            {bathroomPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="snap-start shrink-0 w-[72vw] max-w-[260px] sm:w-60 rounded-3xl border border-border/60 bg-card shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="p-4 sm:p-5 text-white relative"
                  style={{ backgroundImage: `url('${pkg.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '160px' }}
                >
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="relative z-10">
                    {pkg.badge && (
                      <span className="absolute top-2 right-2 rounded-full bg-white/20 backdrop-blur px-2 py-0.5 text-[10px] font-bold">
                        {pkg.badge}
                      </span>
                    )}
                    <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/20 mb-2">
                      <Bath className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-bold">{pkg.title}</h3>
                    <p className="text-xs text-white/80">{pkg.bathrooms} bathroom{pkg.bathrooms > 1 ? 's' : ''}</p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-xl font-extrabold">{inr(pkg.price)}</span>
                      {pkg.originalPrice && (
                        <span className="text-xs text-white/60 line-through mb-0.5">{inr(pkg.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4 gap-3">
                  <ul className="space-y-1.5">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setSelectedService(pkg)}>
                      Details
                    </Button>
                    <Link to={`/booking?bathrooms=${pkg.bathrooms}`} className="flex-1">
                      <Button size="sm" className="w-full text-xs">
                        Book <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE DEALS ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Value Deals</h2>
            <p className="mt-1 sm:mt-2 text-sm text-muted-foreground">Bundle services and save — up to ₹500 off.</p>
          </div>
          <Link to="/services" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0">
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-border">
          {valueDeals.map((deal) => (
            <div
              key={deal.id}
              className="snap-start shrink-0 w-[72vw] max-w-[260px] sm:w-60 rounded-3xl border border-border/60 bg-card shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="p-4 sm:p-5 text-white relative"
                style={{ backgroundImage: `url('${deal.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '160px' }}
              >
                <div className="absolute inset-0 bg-black/45" />
                <div className="relative z-10">
                  {deal.badge && (
                    <span className="absolute top-2 right-2 rounded-full bg-green-500/90 px-2 py-0.5 text-[10px] font-bold">
                      {deal.badge}
                    </span>
                  )}
                  <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/20 mb-2">
                    <Bath className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold leading-snug">{deal.title}</h3>
                  <p className="text-xs text-white/80">{deal.bathrooms} bath + add-on</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-xl font-extrabold">{inr(deal.totalPrice)}</span>
                    {deal.originalPrice && (
                      <span className="text-xs text-white/60 line-through mb-0.5">{inr(deal.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-4 gap-3">
                <ul className="space-y-1.5">
                  {deal.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setSelectedService(deal)}>
                    Details
                  </Button>
                  <Link to={`/booking?bathrooms=${deal.bathrooms}`} className="flex-1">
                    <Button size="sm" className="w-full text-xs bg-green-600 hover:bg-green-700">
                      Book <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OFFER BANNERS ────────────────────────────────────────────────── */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8">Current Offers</h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Weekday */}
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-teal-500 to-emerald-500 p-5 sm:p-8 text-primary-foreground shadow-glow">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl bg-white/20">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 font-medium">Weekday offers</p>
                  <h3 className="text-xl sm:text-2xl font-extrabold mt-0.5">Up to 20% off</h3>
                </div>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-white/90 mb-5 sm:mb-6">
                {['2 bathrooms → 10% off', '3+ bathrooms → 20% off', 'Add a mini service → ₹100 off', 'Coupon SHINE10 stacks on top'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <Link to="/booking">
                <Button size="default" variant="secondary" className="w-full shadow-lg">
                  Claim now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Weekend */}
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-5 sm:p-8 text-white shadow-glow relative overflow-hidden">
              <div className="absolute -top-3 -right-3 bg-white text-red-600 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg">
                Hot Deal
              </div>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl bg-white/20">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 font-medium">Weekend Special</p>
                  <h3 className="text-xl sm:text-3xl font-extrabold mt-0.5">20% off</h3>
                </div>
              </div>
              <p className="text-white/90 font-medium text-sm mb-1 sm:mb-2">Every booking on weekends</p>
              <p className="text-white/75 text-xs sm:text-sm mb-5 sm:mb-6">Saturday & Sunday — no restrictions, no combo required.</p>
              <Link to="/booking">
                <Button size="default" variant="secondary" className="w-full shadow-lg">
                  Book Weekend <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MINI SERVICES ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Mini Add-on Services</h2>
            <p className="mt-1 sm:mt-2 text-sm text-muted-foreground">Bundle with any booking — save ₹100.</p>
          </div>
          <Link to="/services" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0">
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {miniServices.slice(0, 4).map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-border/60 bg-card flex flex-col overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="h-28 sm:h-36 overflow-hidden">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2 sm:gap-3">
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm">{s.name}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{s.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="font-bold text-primary text-sm">{inr(s.price)}</span>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] sm:text-xs px-2 sm:px-3" onClick={() => setSelectedService(s)}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-10">How BathEase works</h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { step: '01', icon: Bath,  title: 'Pick what you need', desc: 'Choose bathrooms & add-ons. Pricing updates live as you build.' },
              { step: '02', icon: Clock, title: 'Schedule a slot',    desc: 'Same-day or advance booking. Pay by UPI, Razorpay or cash.' },
              { step: '03', icon: Zap,   title: 'Relax — we clean',  desc: 'A vetted professional arrives, deep-cleans, and shares an invoice.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="bg-card rounded-2xl border border-border/60 p-5 sm:p-6 relative overflow-hidden">
                <span className="absolute top-4 right-4 text-4xl sm:text-5xl font-black text-muted/20 select-none leading-none">{step}</span>
                <div className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl bg-primary/10 text-primary mb-3 sm:mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8">What customers say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {testimonials.map(({ name, city, rating, text }) => (
            <div key={name} className="bg-card rounded-2xl border border-border/60 p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">"{text}"</p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-hero text-primary-foreground py-14 sm:py-20 px-4 sm:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Ready for a sparkling clean bathroom?</h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-primary-foreground/80 max-w-md mx-auto">
          Book in under a minute. Flexible slots. Vetted professionals. Cancel anytime.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link to="/booking">
            <Button size="lg" variant="secondary" className="shadow-glow w-full sm:w-auto">
              Start your booking <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/services">
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20 w-full sm:w-auto">
              Browse all services
            </Button>
          </Link>
        </div>
      </section>

      {/* View Details Modal */}
      <ViewDetails
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
      />

      <Footer />
    </div>
  );
}
