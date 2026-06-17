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
    <div className="w-full rounded-2xl dark:bg-card shadow-sm border border-border/60">
      {/* Header */}
      <div className="px-10 pt-7 pb-6">
        <h2 className="text-lg font-semibold text-foreground whitespace-nowrap">
          Cleaning Requirement
        </h2>
      </div>

      {/* Grid — 4 columns × 2 rows, images smaller & centered */}
      <div className="grid grid-cols-4 gap-6 px-10 pb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center gap-2"
          >
            {/* Fixed small square image */}
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 dark:bg-muted/30 flex items-center justify-center border border-border/30">
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Label */}
            <span className="text-xs font-medium text-foreground text-center leading-snug">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
