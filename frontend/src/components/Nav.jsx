import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Moon, Sun, Bath, Home, Wrench, CalendarCheck, BookOpen, ShieldCheck } from 'lucide-react';
import { theme } from '@/lib/bathease';
import { session } from '@/lib/api';
import { Button } from '@/components/button';
import { UserProfilePanel } from '@/components/UserProfilePanel';
import { toast } from 'sonner';

// Bottom tab bar links (mobile only)
const TAB_LINKS = [
  { to: '/',          label: 'Home',        icon: Home },
  { to: '/services',  label: 'Services',    icon: Wrench },
  { to: '/booking',   label: 'Book',        icon: CalendarCheck },
  { to: '/dashboard', label: 'My Bookings', icon: BookOpen },
];

export function Nav() {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [user,         setUser]         = useState(null);
  const [panelOpen,    setPanelOpen]    = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const t = theme.get();
    setCurrentTheme(t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    setUser(session.getUser());
  }, [location.pathname]);

  useEffect(() => {
    const onStorage = () => setUser(session.getUser());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(next);
    theme.set(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const logout = () => {
    session.clear();
    setUser(null);
    setPanelOpen(false);
    toast.success('Signed out');
    navigate('/');
  };

  const desktopLinks = [
    { to: '/',          label: 'Home' },
    { to: '/services',  label: 'Services' },
    { to: '/booking',   label: 'Book' },
    { to: '/dashboard', label: 'My Bookings' },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  const tabLinks = [
    ...TAB_LINKS,
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: ShieldCheck }] : []),
  ];

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  // Avatar: show profile image or initials
  const initials = (user?.name ?? 'U')
    .split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      {/* ── TOP NAV ── */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
              <Bath className="h-5 w-5" />
            </span>
            <span>BathEase</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {desktopLinks.map((l) => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(l.to)
                    ? 'text-foreground bg-accent/60 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                }`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              /* ── Avatar button — opens profile panel ── */
              <button
                onClick={() => setPanelOpen(true)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Open profile"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover border-2 border-primary/30 hover:border-primary transition-colors"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-hero text-primary-foreground text-xs font-bold grid place-items-center border-2 border-primary/30 hover:border-primary transition-colors">
                    {initials}
                  </div>
                )}
              </button>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="shadow-soft">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── BOTTOM TAB BAR (mobile only) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/60">
        <div className="flex items-stretch h-16">
          {tabLinks.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className={`grid h-8 w-8 place-items-center rounded-xl transition-all ${active ? 'bg-primary/10' : ''}`}>
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span className={`text-[10px] font-medium leading-none ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── USER PROFILE PANEL ── */}
      {panelOpen && user && (
        <UserProfilePanel
          user={user}
          onClose={() => setPanelOpen(false)}
          onLogout={logout}
          onUserUpdate={(updated) => setUser({ ...user, ...updated })}
        />
      )}
    </>
  );
}
