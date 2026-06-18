import { Link } from 'react-router-dom';
import { Nav }      from '@/components/Nav';
import { Footer }   from '@/components/Footer';
import { Card }     from '@/components/card';
import { Button }   from '@/components/button';
import { Badge }    from '@/components/badge';
import { Input }    from '@/components/input';
import { Textarea } from '@/components/textarea';
import { useEffect, useState } from 'react';
import { inr, MINI_SERVICES, downloadInvoice, whatsappLink } from '@/lib/bathease';
import { api, session } from '@/lib/api';
import { toast } from 'sonner';
import { Calendar, MapPin, Phone, FileDown, MessageCircle, Star } from 'lucide-react';

export default function Dashboard() {
  const user = session.getUser();
  const [bookings, setBookings]         = useState([]);
  const [loadingBookings, setLoading]   = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await api.myBookings();
      setBookings(data);
    } catch (e) {
      toast.error('Could not load bookings: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
    else setLoading(false);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 grid place-items-center px-6">
          <Card className="p-8 text-center max-w-sm">
            <h2 className="text-xl font-semibold">Please sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">You need an account to view your bookings.</p>
            <Link to="/auth"><Button className="mt-5">Sign in</Button></Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-12">
        <ProfileCard onUpdate={fetchBookings} />

        <div className="mt-10 flex items-end justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold">Your bookings</h2>
            <p className="text-sm text-muted-foreground">Track status, download invoices, leave reviews.</p>
          </div>
          <Link to="/booking"><Button>New booking</Button></Link>
        </div>

        {loadingBookings ? (
          <Card className="mt-6 p-10 text-center text-muted-foreground">Loading bookings…</Card>
        ) : bookings.length === 0 ? (
          <Card className="mt-6 p-10 text-center text-muted-foreground">No bookings yet — book your first cleaning.</Card>
        ) : (
          <div className="mt-6 grid gap-4">
            {bookings.map((b) => <BookingCard key={b._id} b={b} onChange={fetchBookings} />)}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

function ProfileCard({ onUpdate }) {
  const user = session.getUser();
  const [name, setName]         = useState(user?.name ?? '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp ?? '');
  const [address, setAddress]   = useState(user?.address ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [img, setImg]           = useState(user?.profileImage ?? '');
  const [saving, setSaving]     = useState(false);

  const onFile = (f) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImg(String(reader.result));
    reader.readAsDataURL(f);
  };

  const save = async () => {
    setSaving(true);
    try {
      const updated = await api.updateProfile({ name, whatsapp, address, location, profileImage: img });
      session.updateUser(updated);
      toast.success('Profile updated');
      onUpdate();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card">
      <div className="flex flex-wrap gap-6 items-start">
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          {img ? (
            <img src={img} alt="" className="h-24 w-24 rounded-2xl object-cover shadow-soft" />
          ) : (
            <div className="h-24 w-24 rounded-2xl bg-gradient-hero text-primary-foreground grid place-items-center text-3xl font-bold shadow-soft">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="text-[11px] text-center mt-2 text-muted-foreground">Change photo</div>
        </label>
        <div className="flex-1 min-w-0 grid sm:grid-cols-2 gap-3">
          <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Email"><Input value={user?.email ?? ''} disabled /></Field>
          <Field label="WhatsApp"><Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91..." /></Field>
          <Field label="City / Location"><Input value={location} onChange={(e) => setLocation(e.target.value)} /></Field>
          <div className="sm:col-span-2">
            <Field label="Address"><Textarea value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</Button>
      </div>
    </Card>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function BookingCard({ b, onChange }) {
  const statusColor = {
    pending:     'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
    confirmed:   'bg-primary/15 text-primary',
    in_progress: 'bg-accent/40 text-accent-foreground',
    completed:   'bg-success/20 text-success',
    cancelled:   'bg-destructive/15 text-destructive',
  };
  const stages = ['confirmed', 'in_progress', 'completed'];
  const idx    = stages.indexOf(b.status);
  const displayId = b.bookingId || b._id;

  const [showReview, setShowReview] = useState(false);
  const [rating, setRating]         = useState(b.review?.rating ?? 5);
  const [comment, setComment]       = useState(b.review?.comment ?? '');

  const submitReview = async () => {
    try {
      await api.reviewBooking(b.bookingId, rating, comment);
      toast.success('Thanks for your review!');
      setShowReview(false);
      onChange();
    } catch (e) { toast.error(e.message); }
  };

  const cancel = async () => {
    try {
      await api.cancelBooking(b.bookingId);
      toast.success('Booking cancelled');
      onChange();
    } catch (e) { toast.error(e.message); }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap gap-4 items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{displayId}</span>
            <Badge className={statusColor[b.status]}>{b.status.replace('_', ' ')}</Badge>
          </div>
          <div className="mt-1 text-lg font-semibold">
            {b.bathroomCount} bathroom{b.bathroomCount > 1 ? 's' : ''}
            {b.miniServices?.length ? ` + ${b.miniServices.length} add-on${b.miniServices.length > 1 ? 's' : ''}` : ''}
          </div>
          <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{new Date(b.date).toDateString()} · {b.slot}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{b.address}</span>
            {b.assignedStaff && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />Staff: {b.assignedStaff}</span>}
          </div>
          {b.miniServices?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {b.miniServices.map((id) => (
                <Badge key={id} variant="secondary">{MINI_SERVICES.find((m) => m.id === id)?.name}</Badge>
              ))}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{inr(b.price.total)}</div>
          <div className="text-xs text-muted-foreground uppercase">{b.paymentMethod}</div>
        </div>
      </div>

      {/* Progress tracker */}
      {b.status !== 'cancelled' && (
        <div className="mt-5">
          <div className="flex items-center gap-1">
            {stages.map((s, i) => (
              <div key={s} className="flex-1 flex items-center gap-1">
                <div className={`h-2 flex-1 rounded-full ${i <= idx ? 'bg-primary' : 'bg-muted'}`} />
                {i < stages.length - 1 && <div className={`h-2 w-2 rounded-full ${i < idx ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
            <span>Confirmed</span><span>In progress</span><span>Completed</span>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => downloadInvoice(b)}>
          <FileDown className="h-4 w-4 mr-1" />Invoice
        </Button>
        <a href={whatsappLink(b.whatsapp || '+919999999999', `Hi! About my booking ${displayId}.`)} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline"><MessageCircle className="h-4 w-4 mr-1" />WhatsApp</Button>
        </a>
        {b.status === 'completed' && !b.review && (
          <Button size="sm" onClick={() => setShowReview((s) => !s)}>
            <Star className="h-4 w-4 mr-1" />Leave review
          </Button>
        )}
        {b.status !== 'completed' && b.status !== 'cancelled' && (
          <Button size="sm" variant="ghost" className="text-destructive" onClick={cancel}>Cancel</Button>
        )}
      </div>

      {b.review && (
        <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < b.review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
            ))}
          </div>
          <p className="mt-1 text-muted-foreground">{b.review.comment}</p>
        </div>
      )}

      {showReview && (
        <div className="mt-4 rounded-lg border p-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} onClick={() => setRating(i + 1)}>
                <Star className={`h-6 w-6 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
              </button>
            ))}
          </div>
          <Textarea className="mt-3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was your experience?" />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowReview(false)}>Cancel</Button>
            <Button size="sm" onClick={submitReview}>Submit review</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
