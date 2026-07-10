import { Bell, Users, CalendarCheck, MessageCircle, LayoutDashboard, Hammer, UserCircle } from 'lucide-react';

const navItems = [
  { key: 'dashboard', label: 'Dashboard',           icon: LayoutDashboard, countKey: null },
  { key: 'users',     label: 'Login Users',          icon: Users,           countKey: 'users' },
  { key: 'bookings',  label: 'Booking Users',        icon: CalendarCheck,   countKey: 'bookings' },
  { key: 'chat',      label: 'Chat with Customers',  icon: MessageCircle,   countKey: 'chat' },
  { key: 'content',   label: 'Content Manager',      icon: Hammer,          countKey: null },
  { key: 'profile',   label: 'Admin Profile',        icon: UserCircle,      countKey: null },
];

export function AdminSidebar({ active, onChange, counts = {}, total = 0 }) {
  return (
    <aside className="w-60 shrink-0 min-h-screen bg-card border-r border-border/60 flex flex-col pt-8 pb-6 gap-1">

      {/* Brand + global bell */}
      <div className="px-6 mb-6 flex items-start justify-between">
        <div>
          <span className="text-lg font-bold text-primary tracking-tight">Admin Panel</span>
          <p className="text-[11px] text-muted-foreground mt-0.5">BathEase Dashboard</p>
        </div>

        {/* Global notification bell */}
        <div className="relative mt-0.5">
          <Bell className={`h-5 w-5 transition-colors ${total > 0 ? 'text-primary animate-bounce' : 'text-muted-foreground'}`} />
          {total > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
              {total > 99 ? '99+' : total}
            </span>
          )}
        </div>
      </div>

      {/* Nav items */}
      {navItems.map(({ key, label, icon: Icon, countKey }) => {
        const badge = countKey ? (counts[countKey] ?? 0) : 0;
        return (
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
            <span className="flex-1 text-left">{label}</span>

            {/* Per-section badge */}
            {badge > 0 && (
              <span className={`min-w-[20px] h-5 rounded-full text-[10px] font-bold flex items-center justify-center px-1.5 leading-none ${
                active === key
                  ? 'bg-white/30 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}
