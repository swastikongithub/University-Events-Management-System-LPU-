import { Building2, Users, Snowflake, Projector, PenLine, Wifi, Filter } from 'lucide-react';

const buildings = ['All', '6', '25', '27', '33', '34', '36', '37', '38'];
const capacityRanges = [
  { label: 'All', value: 'all' },
  { label: '≤30', value: '0-30' },
  { label: '31–60', value: '31-60' },
  { label: '61+', value: '61+' },
];
const statuses = ['All', 'available', 'occupied', 'reserved'];
const amenities = [
  { key: 'has_ac', label: 'AC', icon: Snowflake },
  { key: 'has_projector', label: 'Projector', icon: Projector },
  { key: 'has_whiteboard', label: 'Whiteboard', icon: PenLine },
  { key: 'has_wifi', label: 'WiFi', icon: Wifi },
];

export default function FilterBar({ filters, onFilterChange }) {
  const toggle = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleAmenity = (amenityKey) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenityKey)
      ? current.filter((a) => a !== amenityKey)
      : [...current, amenityKey];
    onFilterChange({ ...filters, amenities: updated });
  };

  return (
    <div
      className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap fade-in"
      id="filter-bar"
    >
      {/* Building filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Building2 size={14} className="text-text-muted shrink-0" />
        {buildings.map((b) => (
          <button
            key={b}
            onClick={() => toggle('building', b)}
            className={`chip ${filters.building === b ? 'chip--active' : ''}`}
          >
            {b === 'All' ? 'All Buildings' : `Bldg ${b}`}
          </button>
        ))}
      </div>

      {/* Capacity filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Users size={14} className="text-text-muted shrink-0" />
        {capacityRanges.map((c) => (
          <button
            key={c.value}
            onClick={() => toggle('capacity', c.value)}
            className={`chip ${filters.capacity === c.value ? 'chip--active' : ''}`}
          >
            {c.label === 'All' ? 'All Capacity' : c.label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => toggle('status', s)}
            className={`chip ${filters.status === s ? 'chip--active' : ''}`}
          >
            {s === 'All' ? (
              'All Status'
            ) : (
              <>
                <span className={`status-dot status-dot--${s}`} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Amenity toggles */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {amenities.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => toggleAmenity(key)}
            className={`chip ${(filters.amenities || []).includes(key) ? 'chip--active' : ''}`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
