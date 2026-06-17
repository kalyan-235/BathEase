import { Bath } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4">
        <div>
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
        <div>
          <h4 className="font-semibold mb-3 text-sm">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Deep Bathroom Clean</li>
            <li>Tile & Grout Restore</li>
            <li>Mini Add-ons</li>
            <li>Subscription Plans</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li><li>Careers</li><li>Press</li><li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>WhatsApp: +91 99999 99999</li>
            <li>support@bathease.in</li>
            <li>Help Center</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} BathEase. All rights reserved.
      </div>
    </footer>
  );
}
