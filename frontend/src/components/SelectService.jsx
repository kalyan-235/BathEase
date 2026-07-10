import { Link } from 'react-router-dom';

const services = [
  { id: 'visit-packs',  image: '/20off.jpeg',         label: '3-visit packs',       to: '/services' },
  { id: 'value-deals',  image: '/combodeals.jpeg',    label: 'Value deals',         to: '/services' },
  { id: 'deep-clean',   image: '/toilet_sink.jpeg',   label: 'One time deep clean', to: '/services' },
  { id: 'mini-services',image: '/washbasin.jpeg',     label: 'Mini services',       to: '/services' },
];

export function SelectService() {
  return (
    <div className="rounded-xl bg-white/95 backdrop-blur-sm shadow-glow p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-sm font-semibold text-gray-700 whitespace-nowrap">Select a service</h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* 2×2 grid — fluid tiles, no fixed width */}
      <div className="grid grid-cols-2 gap-2">
        {services.map((s) => (
          <Link
            key={s.id}
            to={s.to}
            className="flex flex-col items-center gap-1.5 group rounded-lg p-1 hover:bg-gray-50 transition-colors"
          >
            <div className="w-full aspect-square rounded-lg bg-gray-100 overflow-hidden transition-shadow group-hover:shadow-md">
              <img
                src={s.image}
                alt={s.label}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center leading-snug">
              {s.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
