import { Card } from '@/components/card';
import { Button } from '@/components/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { STAFF, inr } from '@/lib/bathease';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  CalendarCheck, BellRing, Search, Filter,
  CheckCircle2, Clock, Loader2, XCircle, AlertCircle, MapPin,
} from 'lucide-react';

const STATUS_STYLES = {
  pending:     'bg-yellow-100 text-yellow-700',
  confirmed:   'bg-blue-100   text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed:   'bg-green-100  text-green-700',
  cancelled:   'bg-red-100    text-red-600',
};

const STATUS_ICONS = {
  pending:     AlertCircle,
  confirmed:   CheckCircle2,
  in_progress: Loader2,
  completed:   CheckCircle2,
  cancelled:   XCircle,
};

export function BookingUsers({ bookings, onChange }) {
  const [search,        setSearch]        = useState('');
  const [filterStatus,  setFilterStatus]  = useState('all');

  const updateStatus = async (id, status) => {
    try   { await api.updateBooking(id, { status }); toast.success(`Status → ${status}`); onChange(); }
    catch (e) { toast.error(e.message); }
  };

  const assign = async (id, staff) => {
    try   { await api.updateBooking(id, { assignedStaff: staff }); toast.success(`Assigned to ${staff}`); onChange(); }
    catch (e) { toast.error(e.message); }
  };

  const notify = (b) =>
    toast.success(`Notified ${b.userEmail}`, { description: 'WhatsApp + email sent (demo)' });

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
      b.userEmail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex-1 p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-primary" /> Booking Users
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage bookings, assign staff and update status
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm bg-muted px-3 py-1.5 rounded-full text-muted-foreground">
            {bookings.length} total
          </span>
          <span className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
            {bookings.filter((b) => b.status === 'completed').length} completed
          </span>
          <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full font-medium">
            {bookings.filter((b) => b.status === 'pending').length} pending
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8 pr-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <Th>Booking ID</Th>
                <Th>Customer</Th>
                <Th>Date / Slot</Th>
                <Th>Service</Th>
                <Th>Total</Th>
                <Th>Location</Th>
                <Th>Staff</Th>
                <Th>Status</Th>
                <Th>Notify</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-muted-foreground">
                    No bookings found.
                  </td>
                </tr>
              )}
              {filtered.map((b) => {
                const StatusIcon = STATUS_ICONS[b.status] ?? Clock;
                return (
                  <tr key={b._id} className="border-t border-border/60 hover:bg-muted/20 transition-colors">
                    <Td className="font-mono text-xs font-semibold text-primary">{b.bookingId}</Td>
                    <Td>
                      <div>
                        <p className="font-medium">{b.userEmail}</p>
                        {b.whatsapp && (
                          <p className="text-xs text-muted-foreground">{b.whatsapp}</p>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <div>
                        <p className="font-medium">{new Date(b.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p className="text-xs text-muted-foreground">{b.slot}</p>
                      </div>
                    </Td>
                    <Td>
                      <div>
                        <p>{b.bathroomCount} bathroom{b.bathroomCount > 1 ? 's' : ''}</p>
                        {b.miniServices?.length > 0 && (
                          <p className="text-xs text-muted-foreground">+{b.miniServices.length} add-on</p>
                        )}
                      </div>
                    </Td>
                    <Td className="font-bold text-primary">{inr(b.price?.total)}</Td>
                    <Td>
                      {b.location?.lat && b.location?.lng ? (
                        <a
                          href={`https://www.google.com/maps?q=${b.location.lat},${b.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open in Google Maps"
                        >
                          <Button size="sm" variant="outline" className="gap-1.5 text-green-600 border-green-300 hover:bg-green-50 h-8 px-3 text-xs">
                            <MapPin className="h-3.5 w-3.5" />
                            View Map
                          </Button>
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">No location</span>
                      )}
                    </Td>
                    <Td>
                      <Select value={b.assignedStaff ?? ''} onValueChange={(v) => assign(b.bookingId, v)}>
                        <SelectTrigger className="h-8 w-[130px] text-xs">
                          <SelectValue placeholder="Assign" />
                        </SelectTrigger>
                        <SelectContent>
                          {STAFF.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Td>
                    <Td>
                      <Select value={b.status} onValueChange={(v) => updateStatus(b.bookingId, v)}>
                        <SelectTrigger className={`h-8 w-[130px] text-xs font-medium ${STATUS_STYLES[b.status] ?? ''}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((s) => (
                            <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Td>
                    <Td>
                      <Button size="sm" variant="ghost" onClick={() => notify(b)} title="Send notification">
                        <BellRing className="h-4 w-4 text-primary" />
                      </Button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left font-semibold">{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
