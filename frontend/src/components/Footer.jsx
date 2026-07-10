import { Bath } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

// Fetch admin WhatsApp number — falls back to default if not set
function useAdminWhatsApp() {
  const [number, setNumber] = useState('+91 99999 99999');

  useEffect(() => {
    (async () => {
      try {
        const users = await api.allUsers();
        const admin = users.find((u) => u.role === 'admin');
        if (admin?.whatsapp) setNumber(admin.whatsapp);
      } catch {
        // silently use default
      }
    })();
  }, []);

  return number;
}

export function Footer() {
  const adminWhatsApp = useAdminWhatsApp();

  return (
    <footer className="mt-16 border-t border-border/60 bg-muted/30 pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground">
              <Bath className="h-5 w-5" />
            </span>
            BathEase
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Professional bathroom cleaning at your doorstep. Sparkling clean, every time.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold mb-3 text-sm">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground transition-colors">Deep Bathroom Clean</Link></li>
            <li><Link to="/services" className="hover:text-foreground transition-colors">Tile & Grout Restore</Link></li>
            <li><Link to="/services" className="hover:text-foreground transition-colors">Mini Add-ons</Link></li>
            <li><Link to="/booking" className="hover:text-foreground transition-colors">Book Now</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold mb-3 text-sm">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={`https://wa.me/${adminWhatsApp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-600 transition-colors flex items-center gap-1.5"
              >
                WhatsApp: +91 {adminWhatsApp}
              </a>
            </li>
            <li>support@bathease.in</li>
            <li>Help Center</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground px-4">
        © {new Date().getFullYear()} BathEase. All rights reserved.
      </div>
    </footer>
  );
}
