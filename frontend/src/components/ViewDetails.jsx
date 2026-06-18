import { X, CheckCircle2, AlertCircle, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/button';
import { inr } from '@/lib/bathease';

// ── Mini service specific covered/not-covered content ────────────────────────
const MINI_DETAILS = {
  'fan1.lpeg': {
    covered:    ['Ceiling & wall fan blade cleaning', 'Motor cover dust removal', 'Full de-dusting of fins', 'Safe disassembly & reassembly'],
    notCovered: ['Electrical repairs or rewiring', 'Fan motor replacement', 'Broken blade replacement'],
    duration:   '30 min',
  },
  door: {
    covered:    ['Full door panel wipe & polish', 'Hinge and handle cleaning', 'Frame & edge cleaning', 'Stain removal from surface'],
    notCovered: ['Paint or varnish application', 'Wood repair or filling', 'Lock or hinge replacement'],
    duration:   '20 min',
  },
  'wash-basin': {
    covered:    ['Limescale & stain removal', 'Tap & fixture descaling', 'Basin bowl deep scrub', 'Shine & polish finish'],
    notCovered: ['Pipe repairs or replacement', 'Tap replacement', 'Tile repair around basin'],
    duration:   '25 min',
  },
  exhaust: {
    covered:    ['Grease & dust extraction', 'Fan blade & cover cleaning', 'Vent grille deep clean', 'Odour removal treatment'],
    notCovered: ['Electrical wiring repair', 'Motor or fan replacement', 'Duct cleaning beyond vent'],
    duration:   '35 min',
  },
  mirror: {
    covered:    ['Streak-free glass cleaning', 'Frame & edge polish', 'Water stain removal', 'Anti-smear finish'],
    notCovered: ['Mirror replacement', 'Frame repair or repainting', 'Crack or chip repair'],
    duration:   '15 min',
  },
  shower: {
    covered:    ['Shower head descaling', 'Fixture & rail polish', 'Glass screen cleaning', 'Grout line scrub'],
    notCovered: ['Pipe or valve repairs', 'Shower tray re-grouting', 'Replacement of fittings'],
    duration:   '30 min',
  },
  tile: {
    covered:    ['Grout deep cleaning', 'Mildew & mould removal', 'Tile surface restore & polish', 'Full floor & wall tile scrub'],
    notCovered: ['Tile replacement or re-laying', 'Re-grouting service', 'Crack or chip repair'],
    duration:   '45 min',
  },
};

export function ViewDetails({ isOpen, onClose, service }) {
  if (!isOpen || !service) return null;

  // Detect if this is a mini service (has `name` field, no `bathrooms`)
  const isMini = !service.bathrooms && !!service.name;

  const title    = isMini ? service.name    : service.title;
  const miniMeta = isMini ? (MINI_DETAILS[service.id] ?? null) : null;
  const duration = miniMeta?.duration ?? service.duration;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border/30 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
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
          {service.image && (
            <div className="w-full h-52 rounded-xl overflow-hidden">
              <img
                src={service.image}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Price & Info */}
          <div className="bg-primary/5 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {inr(service.price || service.totalPrice)}
                </span>
                {service.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {inr(service.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            {duration && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{duration}</span>
              </div>
            )}
            {/* Mini service description */}
            {isMini && service.description && (
              <p className="text-sm text-muted-foreground pt-1 border-t border-border/30">
                {service.description}
              </p>
            )}
          </div>

          {/* ── MINI SERVICE layout ── */}
          {isMini && miniMeta && (
            <>
              {/* What is Covered */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  What is Covered
                </h3>
                <div className="space-y-3">
                  {miniMeta.covered.map((item) => (
                    <p key={item} className="text-green-600 font-medium flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              {/* What is NOT Covered */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  What is NOT Covered
                </h3>
                <div className="space-y-3">
                  {miniMeta.notCovered.map((item) => (
                    <p key={item} className="text-red-600 font-medium flex items-start gap-2">
                      <X className="h-5 w-5 shrink-0 mt-0.5" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── BATHROOM PACKAGE layout ── */}
          {!isMini && (
            <>
              {/* What is Covered */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  What is Covered
                </h3>
                <div className="space-y-3">
                  {[
                    'Hard water stains removal',
                    'Toilet seat from outside & inside',
                    'Sink, tiles, taps & other fixtures',
                    'Mirrors, windows & glass partition',
                    'Exhaust fan & hard to reach areas',
                  ].map((item) => (
                    <p key={item} className="text-green-600 font-medium flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              {/* What is NOT Covered */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  What is NOT Covered
                </h3>
                <div className="space-y-3">
                  {[
                    'Cements & rust stains',
                    'Cabinet interiors, buckets, mugs & stools',
                    'Dismantling & cleaning of any appliance',
                  ].map((item) => (
                    <p key={item} className="text-red-600 font-medium flex items-start gap-2">
                      <X className="h-5 w-5 shrink-0 mt-0.5" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              {/* Cleaning Equipments */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Our Cleaning Equipments</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { img: '/buffing_machine.jpeg',  label: 'Buffing Machine' },
                    { img: '/microsoft_cloths.jpeg', label: 'Microfibre Cloths' },
                    { img: '/sponge.jpeg',           label: 'Professional Sponge' },
                    { img: '/cleaning_solutions.jpeg', label: 'Cleaning Solutions' },
                    { img: '/fine_brushes.jpeg',     label: 'Fine Brushes' },
                    { img: '/wiper.jpeg',            label: 'Professional Wiper' },
                  ].map(({ img, label }) => (
                    <div key={label} className="p-3 bg-gray-50 rounded-lg">
                      <div className="h-12 w-12 mx-auto mb-2 rounded-lg overflow-hidden">
                        <img src={img} alt={label} className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                      <p className="text-xs font-medium">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What We Need From You */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">What We Will Need From You</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { emoji: '🪣', label: 'Bucket & Water' },
                    { emoji: '🔌', label: 'Power Point' },
                    { emoji: '🪜', label: 'Ladder / Stool' },
                  ].map(({ emoji, label }) => (
                    <div key={label} className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-3xl mb-2">{emoji}</div>
                      <p className="text-xs font-medium">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Damage Protection — shown for all */}
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
            <Link
              to={
                isMini
                  ? `/booking?mini=${service.id}`
                  : `/booking?bathrooms=${service.bathrooms || 1}`
              }
              className="flex-1"
              onClick={onClose}
            >
              <Button className="w-full bg-primary hover:bg-primary/90">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
