import { Link } from 'react-router-dom';
import { Nav }    from '@/components/Nav';
import { Card }   from '@/components/card';
import { Button } from '@/components/button';
import { AdminSidebar }      from '@/components/admin/AdminSidebar';
import { AdminDashboard }    from '@/components/admin/AdminDashboard';
import { LoginUsers }        from '@/components/admin/LoginUsers';
import { BookingUsers }      from '@/components/admin/BookingUsers';
import { ChatWithCustomers } from '@/components/admin/ChatWithCustomers';
import { useEffect, useState } from 'react';
import { api, session } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminPage() {
  const user = session.getUser();
  const [activePage, setActivePage] = useState('dashboard');
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);

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

  // ── Access guard ─────────────────────────────────────────────────────────
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 grid place-items-center px-6">
          <Card className="p-8 text-center max-w-sm">
            <h2 className="text-xl font-semibold">Admin access required</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in with admin credentials to view this dashboard.
            </p>
            <Link to="/auth">
              <Button className="mt-5">Sign in</Button>
            </Link>
            <p className="mt-4 text-[11px] text-muted-foreground">
              Demo: admin@bathease.in / admin123
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 grid place-items-center">
          <p className="text-muted-foreground animate-pulse">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar active={activePage} onChange={setActivePage} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {activePage === 'dashboard' && (
            <AdminDashboard bookings={bookings} />
          )}
          {activePage === 'users' && (
            <LoginUsers />
          )}
          {activePage === 'bookings' && (
            <BookingUsers bookings={bookings} onChange={fetchBookings} />
          )}
          {activePage === 'chat' && (
            <ChatWithCustomers />
          )}
        </main>
      </div>
    </div>
  );
}
