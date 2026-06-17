import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/button';
import { inr } from '@/lib/bathease';

export function ViewDetails({ isOpen, onClose, service }) {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border/30 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{service.title}</h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Service Image */}
          <div
            className="w-full h-48 rounded-xl bg-cover bg-center"
            style={{
              backgroundImage: `url('${service.image}')`,
            }}
          />

          {/* Price & Info Section */}
          <div className="bg-primary/5 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{inr(service.price || service.totalPrice)}</span>
                {service.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">{inr(service.originalPrice)}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">⏱️</span>
              <span className="font-medium">{service.duration}</span>
            </div>
          </div>

          {/* What is Covered */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              What is Covered
            </h3>
            <div className="space-y-3">
              <p className="text-green-600 font-medium flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                Hard water stains removal
              </p>
              <p className="text-green-600 font-medium flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                Toilet seat from outside & inside
              </p>
              <p className="text-green-600 font-medium flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                Sink, tiles, taps & other fixtures
              </p>
              <p className="text-green-600 font-medium flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                Mirrors, windows & glass partition
              </p>
              <p className="text-green-600 font-medium flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                Exhaust fan & hard to reach areas
              </p>
            </div>
          </div>

          {/* What is NOT Covered */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              What is NOT Covered
            </h3>
            <div className="space-y-3">
              <p className="text-red-600 font-medium flex items-start gap-2">
                <X className="h-5 w-5 shrink-0 mt-0.5" />
                Cements & rust stains
              </p>
              <p className="text-red-600 font-medium flex items-start gap-2">
                <X className="h-5 w-5 shrink-0 mt-0.5" />
                Cabinet interiors, buckets, mugs & stools
              </p>
              <p className="text-red-600 font-medium flex items-start gap-2">
                <X className="h-5 w-5 shrink-0 mt-0.5" />
                Dismantling & cleaning of any appliance
              </p>
            </div>
          </div>

          {/* Cleaning Equipments */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Our Cleaning Equipments</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🔧</div>
                <p className="text-xs font-medium">Buffing Machine</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🧺</div>
                <p className="text-xs font-medium">Microfibre Cloths</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🧽</div>
                <p className="text-xs font-medium">Professional Sponge</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🧼</div>
                <p className="text-xs font-medium">Cleaning Solutions</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🪥</div>
                <p className="text-xs font-medium">Fine Brushes</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🧹</div>
                <p className="text-xs font-medium">Professional Wiper</p>
              </div>
            </div>
          </div>

          {/* What We Need From You */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">What We Will Need From You</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-2">🪣</div>
                <p className="text-xs font-medium">Bucket & Water</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-2">🔌</div>
                <p className="text-xs font-medium">Power Point</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-2">🪜</div>
                <p className="text-xs font-medium">Ladder / Stool</p>
              </div>
            </div>
          </div>

          {/* Damage Protection */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-4">
            <div className="text-4xl shrink-0">🛡️</div>
            <div>
              <h4 className="font-bold text-foreground mb-1">Damage Protection</h4>
              <p className="text-sm text-muted-foreground">
                Up to ₹5,000 cover if any damage happens during the job
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border/30">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
