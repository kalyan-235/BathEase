import { Users, CalendarCheck, MessageCircle, LayoutDashboard } from 'lucide-react';

const navItems = [
  { key: 'dashboard', label: 'Dashboard',          icon: LayoutDashboard },
  { key: 'users',     label: 'Login Users',         icon: Users },
  { key: 'bookings',  label: 'Booking Users',       icon: CalendarCheck },
  { key: 'chat',      label: 'Chat with Customers', icon: MessageCircle },
];

export function AdminSidebar({ active, onChange }) {
  return (
    <aside className="w-60 shrink-0 min-h-screen bg-card border-r border-border/60 flex flex-col pt-8 pb-6 gap-1">
      {/* Brand */}
      <div className="px-6 mb-6">
        <span className="text-lg font-bold text-primary tracking-tight">Admin Panel</span>
        <p className="text-[11px] text-muted-foreground mt-0.5">BathEase Dashboard</p>
      </div>

      {/* Nav */}
      {navItems.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`mx-3 flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
            ${active === key
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </button>
      ))}
    </aside>
  );
}
