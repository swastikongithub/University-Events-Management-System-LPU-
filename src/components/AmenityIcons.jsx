import { Snowflake, Projector, PenLine, Wifi } from 'lucide-react';

const amenityConfig = [
  { key: 'has_ac', icon: Snowflake, label: 'AC' },
  { key: 'has_projector', icon: Projector, label: 'Projector' },
  { key: 'has_whiteboard', icon: PenLine, label: 'Whiteboard' },
  { key: 'has_wifi', icon: Wifi, label: 'WiFi' },
];

export default function AmenityIcons({ classroom, showLabels = false, size = 14 }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {amenityConfig.map(({ key, icon: Icon, label }) => (
        <span
          key={key}
          className={`inline-flex items-center gap-1 transition-colors ${
            classroom[key]
              ? 'text-text-secondary'
              : 'text-border opacity-40'
          }`}
          title={label}
        >
          <Icon size={size} />
          {showLabels && <span className="text-xs">{label}</span>}
        </span>
      ))}
    </div>
  );
}

export { amenityConfig };
