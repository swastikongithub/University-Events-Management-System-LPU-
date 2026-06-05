import { Users, Building2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import AmenityIcons from './AmenityIcons';
import CountdownTimer from './CountdownTimer';

export default function ClassroomCard({ classroom, statusInfo, onClick }) {
  const { status, occupant, timeRemaining, nextEvent } = statusInfo || {
    status: classroom.status, occupant: null, timeRemaining: null, nextEvent: null,
  };

  return (
    <div
      className="card card-clickable p-5 flex flex-col gap-3 fade-in"
      onClick={onClick}
      id={`classroom-card-${classroom.room_number}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-text-primary tracking-wide">
            {classroom.room_number}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-text-muted text-xs">
            <Building2 size={12} />
            <span>Building {classroom.building_number}, Floor {classroom.floor}</span>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Capacity */}
      <div className="flex items-center gap-1.5 text-sm text-text-secondary">
        <Users size={14} className="text-text-muted" />
        <span>{classroom.capacity} seats</span>
      </div>

      {/* Amenities */}
      <AmenityIcons classroom={classroom} />

      {/* Occupant info */}
      {occupant && (
        <div className="mt-1 px-3 py-2 rounded-lg bg-lpu-orange-light border border-lpu-orange/10">
          <p className="text-sm font-medium text-text-primary truncate">
            {occupant.subject}
          </p>
          <p className="text-xs text-text-secondary truncate">{occupant.teacher}</p>
        </div>
      )}

      {/* Countdown */}
      {timeRemaining > 0 && (
        <CountdownTimer seconds={timeRemaining} label="Ends in" />
      )}

      {/* Next event for available rooms */}
      {status === 'available' && nextEvent && (
        <CountdownTimer seconds={nextEvent.startsIn} label="Next class in" />
      )}

      {/* Free all day */}
      {status === 'available' && !nextEvent && (
        <p className="text-xs text-green-status font-medium">Free all day</p>
      )}
    </div>
  );
}
