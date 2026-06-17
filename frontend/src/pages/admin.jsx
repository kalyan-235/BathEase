import { Link } from 'react-router-dom';
import { Nav }    from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Card }   from '@/components/card';
import { Button } from '@/components/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { useEffect, useMemo, useState } from 'react';
import { STAFF, inr, MINI_SERVICES } from '@/lib/bathease';
import { api, session } from '@/lib/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';
import { Users, IndianRupee, CalendarCheck, BellRing } from 'lucide-react';

export default function AdminPage() {
  const user = session.getUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await api.allBookings();
      setBookings(data);
    } catch (e) {
      toast.error('Could not load bookings: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchBookings();
    else setLoading(false);
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 grid place-items-center px-6">
          <Card className="p-8 text-center max-w-sm">
            <h2 className="text-xl font-semibold">Admin access required</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in with admin credentials to view this dashboard.</p>
            <Link to="/auth"><Button className="mt-5">Sign in</Button></Link>
            <p className="mt-4 text-[11px] text-muted-foreground">Demo: admin@bathease.in / admin123</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 grid place-items-center">
          <p className="text-muted-foreground">Loading dashboard…</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <section className="mx-auto max-w-7xl w-full px-6 py-10 space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of users, bookings, revenue and operations.</p>
        </header>
        <Stats bookings={bookings} />
        <Charts bookings={bookings} />
        <Operations bookings={bookings} onChange={fetchBookings} />
      </section>
      <Footer />
    </div>
  );
}

function Stats({ bookings }) {
  const revenue      = bookings.filter((b) => b.status !== 'cancelled').reduce((a, b) => a + b.price.total, 0);
  const active       = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress').length;
  const needsAttention = bookings.filter((b) => !b.assignedStaff && b.status !== 'cancelled').length;

  const cards = [
    { label: 'Total bookings',  value: bookings.length, icon: Users },
    { label: 'Active bookings', value: active,          icon: CalendarCheck },
    { label: 'Total revenue',   value: inr(revenue),    icon: IndianRupee },
    { label: 'Needs attention', value: needsAttention,  icon: BellRing },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="mt-2 text-2xl font-bold">{c.value}</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function Charts({ bookings }) {
  const revenueByDay = useMemo(() => {
    const map = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      map.set(d.toISOString().slice(0, 10), 0);
    }
    bookings.forEach((b) => {
      const k = (b.createdAt || '').slice(0, 10);
      if (map.has(k)) map.set(k, (map.get(k) ?? 0) + b.price.total);
    });
    return Array.from(map.entries()).map(([d, v]) => ({ day: d.slice(5), revenue: v }));
  }, [bookings]);

  const statusData = useMemo(() => {
    const counts = {};
    bookings.forEach((b) => (counts[b.status] = (counts[b.status] ?? 0) + 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  const serviceData = useMemo(() => {
    const counts = {};
    bookings.forEach((b) => (b.miniServices || []).forEach((s) => (counts[s] = (counts[s] ?? 0) + 1)));
    return MINI_SERVICES.map((m) => ({ name: m.name.replace(' Cleaning', ''), value: counts[m.id] ?? 0 }));
  }, [bookings]);

  const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'];

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="p-5 lg:col-span-2">
        <h3 className="font-semibold">Revenue (last 7 days)</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer>
            <LineChart data={revenueByDay}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--color-popover)', border: '1px solid var(--color-border)', borderRadius: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="font-semibold">Booking status</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="p-5 lg:col-span-3">
        <h3 className="font-semibold">Mini service popularity</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer>
            <BarChart data={serviceData}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'var(--color-popover)', border: '1px solid var(--color-border)', borderRadius: 12 }} />
              <Bar dataKey="value" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function Operations({ bookings, onChange }) {
  const updateStatus = async (id, status) => {
    try { await api.updateBooking(id, { status }); toast.success(`Status → ${status}`); onChange(); }
    catch (e) { toast.error(e.message); }
  };
  const assign = async (id, staff) => {
    try { await api.updateBooking(id, { assignedStaff: staff }); toast.success(`Assigned to ${staff}`); onChange(); }
    catch (e) { toast.error(e.message); }
  };
  const notify = (b) => toast.success(`Notified ${b.userEmail}`, { description: 'WhatsApp + email sent (demo)' });

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-5 border-b border-border/60">
        <h3 className="font-semibold">Manage bookings</h3>
        <p className="text-sm text-muted-foreground">Assign staff, change status, send notifications.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <Th>ID</Th><Th>Customer</Th><Th>Date / Slot</Th><Th>Items</Th>
              <Th>Total</Th><Th>Staff</Th><Th>Status</Th><Th> </Th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No bookings yet.</td></tr>
            )}
            {bookings.map((b) => (
              <tr key={b._id} className="border-t border-border/60">
                <Td className="font-mono text-xs">{b.bookingId}</Td>
                <Td>{b.userEmail}</Td>
                <Td>{new Date(b.date).toLocaleDateString()} <span className="text-muted-foreground">· {b.slot}</span></Td>
                <Td>{b.bathroomCount} bath{b.miniServices?.length ? ` + ${b.miniServices.length}` : ''}</Td>
                <Td className="font-semibold">{inr(b.price.total)}</Td>
                <Td>
                  <Select value={b.assignedStaff ?? ''} onValueChange={(v) => assign(b.bookingId, v)}>
                    <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue placeholder="Assign" /></SelectTrigger>
                    <SelectContent>{STAFF.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </Td>
                <Td>
                  <Select value={b.status} onValueChange={(v) => updateStatus(b.bookingId, v)}>
                    <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((s) => (
                        <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Td>
                <Td>
                  <Button size="sm" variant="ghost" onClick={() => notify(b)}>
                    <BellRing className="h-4 w-4" />
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Th({ children }) { return <th className="px-4 py-3 text-left font-semibold">{children}</th>; }
function Td({ children, className = '' }) { return <td className={`px-4 py-3 ${className}`}>{children}</td>; }
