import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Moon, Sun, Bath, Menu, X, LogOut } from 'lucide-react';
import { theme } from '@/lib/bathease';
import { session } from '@/lib/api';
import { Button } from '@/components/button';
import { toast } from 'sonner';

export function Nav() {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [open, setOpen]   = useState(false);
  const [user, setUser]   = useState(null);
  const navigate          = useNavigate();
  const location          = useLocation();

  useEffect(() => {
    const t = theme.get();
    setCurrentTheme(t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    setUser(session.getUser());
  }, [location.pathname]); // refresh on route change so login/logout reflects immediately

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

  const links = [
    { to: '/',          label: 'Home' },
    { to: '/services',  label: 'Services' },
    { to: '/booking',   label: 'Book' },
    { to: '/dashboard', label: 'My Bookings' },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  const logout = () => {
    session.clear();
    setUser(null);
    toast.success('Signed out');
    navigate('/');
  };

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
            <Bath className="h-5 w-5" />
          </span>
          <span>BathEase</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
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
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">
                Hi, {user.name?.split(' ')[0]}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-1" />Sign out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="shadow-soft">Sign in</Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" className="md:hidden"
            onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="flex flex-col p-2">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-sm hover:bg-accent/50">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
