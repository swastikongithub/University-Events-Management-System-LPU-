import { formatTime, getDayName, generateHourSlots } from '../lib/utils';

export default function TimetableView({ timetable, reservations = [] }) {
  const today = getDayName();
  const slots = generateHourSlots();

  const todayTimetable = timetable.filter((t) => t.day_of_week === today);
  const todayDate = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter((r) => r.date === todayDate);

  const findEvent = (slotStart, slotEnd) => {
    const startH = parseInt(slotStart.split(':')[0]);
    const endH = parseInt(slotEnd.split(':')[0]);

    for (const entry of todayTimetable) {
      const entryStartH = parseInt(entry.start_time.split(':')[0]);
      const entryEndH = parseInt(entry.end_time.split(':')[0]);
      const entryEndM = parseInt(entry.end_time.split(':')[1] || 0);
      if (entryStartH < endH && (entryEndH > startH || (entryEndH === startH && entryEndM > 0))) {
        return { ...entry, type: 'timetable' };
      }
    }

    for (const res of todayReservations) {
      const resStartH = parseInt(res.start_time.split(':')[0]);
      const resEndH = parseInt(res.end_time.split(':')[0]);
      if (resStartH < endH && resEndH > startH) {
        return { ...res, type: 'reservation' };
      }
    }

    return null;
  };

  return (
    <div className="space-y-1">
      <h4 className="text-sm font-semibold text-text-primary mb-3">
        Today's Schedule ({today})
      </h4>
      <div className="space-y-1">
        {slots.map((slot) => {
          const event = findEvent(slot.start, slot.end);
          const slotClass = event
            ? event.type === 'reservation' ? 'slot-reserved' : 'slot-occupied'
            : 'slot-available';

          return (
            <div
              key={slot.hour}
              className={`${slotClass} rounded-lg px-3 py-2 flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-16 shrink-0 font-medium">
                  {slot.label}
                </span>
                {event ? (
                  <div>
                    <p className="text-sm text-text-primary">{event.subject_name}</p>
                    <p className="text-xs text-text-secondary">{event.teacher_name}</p>
                  </div>
                ) : (
                  <span className="text-xs text-green-status italic">Available</span>
                )}
              </div>
              {event && (
                <span className="text-xs text-text-muted font-medium">
                  {formatTime(event.start_time)} – {formatTime(event.end_time)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
