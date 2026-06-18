const items = [
  { id: 1, image: '/floor_scrubber.jpeg',     label: 'Floor Scrubber' },
  { id: 2, image: '/vacuum_cleaner.jpeg',     label: 'Vacuum Clean' },
  { id: 3, image: '/wiper.jpeg',              label: 'Wiper' },
  { id: 4, image: '/buffing_machine.jpeg',    label: 'Buffing Machine' },
  { id: 5, image: '/cleaning_solutions.jpeg', label: 'Cleaning Solutions' },
  { id: 6, image: '/fine_brushes.jpeg',       label: 'Fine Brush' },
  { id: 7, image: '/microsoft_cloths.jpeg',   label: 'Microfibre Cloths' },
  { id: 8, image: '/sponge.jpeg',             label: 'Sponge' },
];

export function CleaningRequirement() {
  return (
    <div className="w-full rounded-2xl bg-card shadow-sm border border-border/60">
      {/* Header */}
      <div className="px-4 sm:px-8 pt-6 pb-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">
          Cleaning Requirement
        </h2>
      </div>

      {/* Grid — 4 cols on md+, 2 cols on mobile */}
      <div className="grid grid-cols-4 gap-3 sm:gap-5 px-4 sm:px-8 pb-6">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-2">
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-muted/30 border border-border/30">
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-foreground text-center leading-snug">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
