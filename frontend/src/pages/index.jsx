import { Link } from 'react-router-dom';
import { Nav }              from '@/components/Nav';
import { Footer }           from '@/components/Footer';
import { Button }           from '@/components/button';
import { Card }             from '@/components/card';
import { SelectService }    from '@/components/SelectService';
import { CleaningRequirement } from '@/components/CleaningRequirement';
import { Sparkles, ShieldCheck, Clock, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MINI_SERVICES } from '@/lib/bathease';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden h-screen w-full">
        <div className="absolute inset-0 -z-10 bg-gradient-hero opacity-95" />
        <div className="absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.15),transparent_45%)]" />
        <div className="mx-auto max-w-6xl px-10 pt-12 grid lg:grid-cols-2 gap-12 items-start text-primary-foreground h-full">

          {/* Left — copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium ring-1 ring-white/20">
              <Sparkles className="h-3.5 w-3.5" /> Now serving 25+ cities
            </span>
            <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
              Bathrooms so clean, <br /> they sparkle.
            </h1>
            <p className="mt-4 text-base/relaxed text-primary-foreground/85 max-w-md">
              Book vetted professionals for a deep clean — tiles, exhausts, mirrors and more.
              Transparent pricing, instant offers, zero hassle.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
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
            <div className="mt-7 flex flex-wrap gap-5 text-sm">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Insured & verified</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Same-day slots</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4" /> 4.9 / 5 rating</span>
            </div>
          </div>

          {/* Right — SelectService inside hero */}
          <div>
            <SelectService />
          </div>
        </div>
      </section>

      {/* ── CLEANING REQUIREMENT ── */}
      <section className="mx-auto w-full px-10">
        <CleaningRequirement />
      </section>

      {/* ── OFFER BANNER ── */}
      <section className="mx-auto max-w-6xl w-full px-10 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Weekday Offers Card */}
          <div className="rounded-3xl bg-gradient-to-br from-primary via-teal-500 to-emerald-500 p-8 text-primary-foreground shadow-glow">
            <div className="flex flex-col">
              {/* Top — offer text */}
              <div className="flex items-center gap-4 mb-6">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/70 font-medium">Weekday offers</p>
                  <h3 className="text-2xl font-extrabold mt-0.5">Up to 20% off</h3>
                </div>
              </div>

              {/* Offer list */}
              <ul className="space-y-2 text-sm text-white/90 mb-6">
                {[
                  '2 bathrooms → 10% off',
                  '3+ bathrooms → 20% off',
                  'Add a mini service → ₹100 off bundle',
                  'Coupon SHINE10 stacks on top',
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white shrink-0" /> {t}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/booking">
                <Button size="lg" variant="secondary" className="shadow-lg w-full">
                  Claim now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Weekend Special Card */}
          <div className="rounded-3xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-8 text-primary-foreground shadow-glow relative overflow-hidden">
            {/* Decorative badge */}
            <div className="absolute -top-3 -right-3 bg-white text-red-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Hot Deal</div>
            
            <div className="flex flex-col">
              {/* Top — offer text */}
              <div className="flex items-center gap-4 mb-6">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/70 font-medium">Weekend Special</p>
                  <h3 className="text-3xl font-extrabold mt-0.5">20% off</h3>
                </div>
              </div>

              {/* Offer description */}
              <p className="text-white/90 font-medium mb-2">Every booking on weekends</p>
              <p className="text-white/75 text-sm mb-6">Saturday & Sunday — no restrictions, no combo required. Pure savings!</p>

              {/* CTA */}
              <Link to="/booking">
                <Button size="lg" variant="secondary" className="shadow-lg w-full">
                  Book Weekend <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── MINI SERVICES ── */}
      <section className="mx-auto max-w-6xl w-full px-10 py-12">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Add-on mini services</h2>
            <p className="mt-1 text-muted-foreground">Tack on any of these to your booking — bundle and save.</p>
          </div>
          <Link to="/services" className="text-sm font-medium text-primary hover:underline">See all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MINI_SERVICES.slice(0, 4).map((s) => {
            return (
              <Card key={s.id} className="p-5 bg-gradient-card hover:shadow-soft transition-all hover:-translate-y-1">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary overflow-hidden">
                  <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-4 font-semibold text-sm">{s.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                <div className="mt-3 font-semibold text-primary">₹{s.price}</div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="mx-auto max-w-6xl px-10 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center">How BathEase works</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              { t: '1. Pick what you need', d: 'Choose bathrooms & add-ons. See pricing live as you build.' },
              { t: '2. Schedule a slot',    d: 'Same-day or pick a time that fits. Pay by UPI, Razorpay or cash.' },
              { t: '3. Relax — we clean',  d: 'A vetted pro arrives, deep-cleans, and shares an invoice.' },
            ].map((s) => (
              <Card key={s.t} className="p-6 bg-card">
                <h3 className="font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-6xl w-full px-10 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">Ready for a sparkling bathroom?</h2>
        <p className="mt-3 text-muted-foreground">Book in under a minute. Cancel anytime.</p>
        <Link to="/booking">
          <Button size="lg" className="mt-6 shadow-soft">Start your booking</Button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
