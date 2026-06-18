import { useMemo } from 'react';
import { Card } from '@/components/card';
import { MINI_SERVICES, inr } from '@/lib/bathease';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Users, IndianRupee, CalendarCheck, BellRing, LayoutDashboard } from 'lucide-react';

export function AdminDashboard({ bookings }) {
  const revenue        = bookings.filter((b) => b.status !== 'cancelled').reduce((a, b) => a + b.price.total, 0);
  const active         = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress').length;
  const needsAttention = bookings.filter((b) => !b.assignedStaff && b.status !== 'cancelled').length;

  const statCards = [
    { label: 'Total Bookings',  value: bookings.length, icon: Users,         color: 'bg-blue-50   text-blue-600' },
    { label: 'Active Bookings', value: active,          icon: CalendarCheck, color: 'bg-green-50  text-green-600' },
    { label: 'Total Revenue',   value: inr(revenue),    icon: IndianRupee,   color: 'bg-purple-50 text-purple-600' },
    { label: 'Needs Attention', value: needsAttention,  icon: BellRing,      color: 'bg-yellow-50 text-yellow-600' },
  ];

  // ── Chart data ────────────────────────────────────────────────────────────
  const revenueByDay = useMemo(() => {
    const map = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
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
    bookings.forEach((b) =>
      (b.miniServices || []).forEach((s) => (counts[s] = (counts[s] ?? 0) + 1))
    );
    return MINI_SERVICES.map((m) => ({
      name: m.name.replace(' Cleaning', ''),
      value: counts[m.id] ?? 0,
    }));
  }, [bookings]);

  const COLORS = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
  ];

  const tooltipStyle = {
    contentStyle: {
      background: 'var(--color-popover)',
      border: '1px solid var(--color-border)',
      borderRadius: 12,
      fontSize: 12,
    },
  };

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          Overview
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Stats, revenue trends and booking analytics
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="mt-2 text-2xl font-bold">{c.value}</p>
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${c.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Charts row 1 ── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Line Chart */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-1">Revenue — last 7 days</h3>
          <p className="text-xs text-muted-foreground mb-3">Daily earnings from confirmed bookings</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByDay}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip {...tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--color-chart-1)' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Booking Status Pie */}
        <Card className="p-5">
          <h3 className="font-semibold mb-1">Booking Status</h3>
          <p className="text-xs text-muted-foreground mb-3">Distribution by current status</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Charts row 2 ── */}
      <Card className="p-5">
        <h3 className="font-semibold mb-1">Mini Service Popularity</h3>
        <p className="text-xs text-muted-foreground mb-3">How often each add-on service is booked</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceData} barSize={36}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
