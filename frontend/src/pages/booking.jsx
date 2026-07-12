import { useNavigate, useSearchParams } from 'react-router-dom';
import { Nav }      from '@/components/Nav';
import { Footer }   from '@/components/Footer';
import { Card }     from '@/components/card';
import { Button }   from '@/components/button';
import { Input }    from '@/components/input';
import { Label }    from '@/components/label';
import { Textarea } from '@/components/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Badge }    from '@/components/badge';
import { useMemo, useState } from 'react';
import { MINI_SERVICES, computePrice, inr, genId, TIME_SLOTS } from '@/lib/bathease';
import { api, session } from '@/lib/api';
import { toast } from 'sonner';
import { Minus, Plus, Tag, CalendarDays, MapPin, Loader2 } from 'lucide-react';

export default function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = session.getUser();

  // Read URL params: ?bathrooms=3&mini=exhaust,mirror
  const initBathrooms = Math.min(10, Math.max(1, parseInt(searchParams.get('bathrooms') || '1', 10)));
  const initMinis     = searchParams.get('mini')
    ? searchParams.get('mini').split(',').filter((id) => MINI_SERVICES.some((m) => m.id === id))
    : [];

  const [bathrooms, setBathrooms] = useState(initBathrooms);
  const [minis, setMinis]         = useState(initMinis);
  const [coupon, setCoupon]       = useState('');
  const [date, setDate]           = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [slot, setSlot]           = useState(TIME_SLOTS[1]);
  const [address, setAddress]     = useState(user?.address ?? '');
  const [whatsapp, setWhatsapp]   = useState(user?.whatsapp ?? '');
  const [payment, setPayment]     = useState('razorpay');
  const [loading, setLoading]     = useState(false);
  const [lat, setLat]             = useState(null);
  const [lng, setLng]             = useState(null);
  const [locating, setLocating]   = useState(false);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocating(false);
        toast.success('Location captured successfully');
      },
      (err) => {
        setLocating(false);
        toast.error('Could not get location — please enter address manually');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const price = useMemo(() => computePrice(bathrooms, minis, coupon), [bathrooms, minis, coupon]);

  const toggleMini = (id) =>
    setMinis((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  const submit = async () => {
    if (!user) {
      toast.error('Please sign in to book');
      navigate('/auth');
      return;
    }
    if (!address || !whatsapp) {
      toast.error('Add your address and WhatsApp number');
      return;
    }
    setLoading(true);
    try {
      const booking = await api.createBooking({
        bookingId: genId(),
        bathroomCount: bathrooms,
        miniServices: minis,
        date,
        slot,
        address,
        whatsapp,
        paymentMethod: payment,
        price,
        lat,
        lng,
      });
      toast.success(`Booking confirmed — ${booking.bookingId}`, {
        description: `${inr(price.total)} · ${slot} on ${new Date(date).toDateString()}`,
      });
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-8 sm:py-12 grid lg:grid-cols-[1fr_380px] gap-6 sm:gap-8 items-start">

        {/* ── Left col ── */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Build your booking</h1>
            <p className="mt-2 text-muted-foreground">Pick bathrooms, add-ons and a slot. Pricing updates live.</p>
          </div>

          {/* Bathrooms */}
          <Card className="p-6">
            <h2 className="font-semibold">How many bathrooms?</h2>
            <div className="mt-4 flex items-center gap-4">
              <Button size="icon" variant="outline" onClick={() => setBathrooms((n) => Math.max(1, n - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <div className="text-3xl font-bold w-12 text-center">{bathrooms}</div>
              <Button size="icon" variant="outline" onClick={() => setBathrooms((n) => Math.min(10, n + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
              <div className="ml-4 flex gap-2 flex-wrap">
                {bathrooms === 2 && <Badge className="bg-success text-success-foreground">10% off applied</Badge>}
                {bathrooms >= 3 && <Badge className="bg-success text-success-foreground">20% off applied</Badge>}
              </div>
            </div>
          </Card>

          {/* Mini services */}
          <Card className="p-6">
            <h2 className="font-semibold">Add mini services</h2>
            <p className="text-sm text-muted-foreground mt-1">Add any service → bundle ₹100 off applies automatically.</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {MINI_SERVICES.map((m) => {
                const active = minis.includes(m.id);
                return (
                  <button key={m.id} type="button" onClick={() => toggleMini(m.id)}
                    className={`text-left rounded-xl border p-4 transition flex items-start gap-3 ${
                      active ? 'border-primary bg-primary/5 ring-1 ring-primary/40' : 'border-border hover:border-primary/40'
                    }`}>
                    <div className={`grid h-10 w-10 place-items-center rounded-lg overflow-hidden flex-shrink-0 ${active ? 'bg-primary text-primary-foreground' : 'bg-accent/40 text-primary'}`}>
                      <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <span className="font-medium">{m.name}</span>
                        <span className="text-sm font-semibold">{inr(m.price)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Schedule */}
          <Card className="p-6">
            <h2 className="font-semibold flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Schedule</h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDate(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Time slot</Label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((s) => (
                    <button key={s} type="button" onClick={() => setSlot(s)}
                      className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                        slot === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Address + Payment */}
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold">Address & payment</h2>
            <div>
              <Label htmlFor="addr">Service address</Label>
              <Textarea id="addr" value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat, building, street, city" className="mt-1" />

              {/* Location button */}
              <div className="mt-2 flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={captureLocation}
                  disabled={locating}
                  className="gap-2 text-xs"
                >
                  {locating
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <MapPin className="h-3.5 w-3.5" />
                  }
                  {locating ? 'Getting location…' : 'Use my current location'}
                </Button>
                {lat && lng && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <MapPin className="h-3 w-3" />
                    Location captured ✓
                  </span>
                )}
              </div>

              {/* Mini map preview if location captured */}
              {lat && lng && (
                <a
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-2 p-3 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors group"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-green-500 text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-green-700">Live location pinned</p>
                    <p className="text-xs text-green-600 truncate">
                      {lat.toFixed(5)}, {lng.toFixed(5)} — tap to preview
                    </p>
                  </div>
                  <span className="text-xs text-green-600 group-hover:underline shrink-0">Open map →</span>
                </a>
              )}
            </div>
            <div>
              <Label htmlFor="wa">WhatsApp number</Label>
              <Input id="wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91..." className="mt-1" />
            </div>
            <div>
              <Label>Payment method</Label>
              <RadioGroup value={payment} onValueChange={setPayment} className="mt-2 grid sm:grid-cols-3 gap-3">
                {[{ v: 'razorpay', l: 'Razorpay' }, { v: 'upi', l: 'UPI' }, { v: 'cash', l: 'Cash on service' }].map((o) => (
                  <label key={o.v} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer ${payment === o.v ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value={o.v} />
                    <span className="text-sm font-medium">{o.l}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </Card>
        </div>

        {/* ── Summary sidebar — shows below form on mobile, sticky on desktop ── */}
        <aside className="w-full lg:sticky lg:top-24 self-start order-first lg:order-last">
          <Card className="p-6 bg-gradient-card shadow-soft">
            <h3 className="font-semibold">Order summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Row label={`Bathrooms × ${bathrooms}`} value={inr(price.bathroomSubtotal)} />
              {minis.map((id) => {
                const m = MINI_SERVICES.find((x) => x.id === id);
                return <Row key={id} label={m.name} value={inr(m.price)} />;
              })}
              {price.bathroomDiscount > 0 && <Row label="Bathroom discount" value={`-${inr(price.bathroomDiscount)}`} positive />}
              {price.bundleDiscount   > 0 && <Row label="Bundle bonus"      value={`-${inr(price.bundleDiscount)}`}   positive />}
              {price.couponDiscount   > 0 && <Row label={`Coupon ${price.couponCode}`} value={`-${inr(price.couponDiscount)}`} positive />}
              <Row label="GST 5%" value={inr(price.taxes)} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">{inr(price.total)}</span>
            </div>

            <div className="mt-5">
              <Label htmlFor="coupon" className="text-xs">Have a coupon?</Label>
              <div className="mt-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)}
                  placeholder="WELCOME50 · SHINE10 · SPARKLE20" className="pl-9 uppercase" />
              </div>
              {coupon && !price.couponDiscount && (
                <p className="mt-1 text-xs text-destructive">Invalid coupon code</p>
              )}
            </div>

            {price.offersApplied.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-xs text-success">
                {price.offersApplied.map((o) => <li key={o}>✓ {o}</li>)}
              </ul>
            )}

            <Button size="lg" className="w-full mt-6 shadow-soft" onClick={submit} disabled={loading}>
              {loading ? 'Confirming…' : 'Confirm booking'}
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground text-center">
              By booking you agree to BathEase terms. You can cancel up to 2 hours before the slot.
            </p>
          </Card>
        </aside>
      </section>
      <Footer />
    </div>
  );
}

function Row({ label, value, positive }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={positive ? 'text-success font-medium' : 'font-medium'}>{value}</span>
    </div>
  );
}
