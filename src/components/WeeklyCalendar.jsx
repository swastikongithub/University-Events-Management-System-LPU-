import { formatTime } from '../lib/utils';

const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM

export default function WeeklyCalendar({ timetable }) {
  const grid = {};
  for (const day of daysOrder) {
    grid[day] = {};
    for (const h of hours) {
      grid[day][h] = null;
    }
  }

  for (const entry of timetable) {
    const startH = parseInt(entry.start_time.split(':')[0]);
    const endH = parseInt(entry.end_time.split(':')[0]);
    const endM = parseInt(entry.end_time.split(':')[1] || 0);
    const actualEnd = endM > 0 ? endH + 1 : endH;
    for (let h = startH; h < actualEnd; h++) {
      if (grid[entry.day_of_week] && h >= 8 && h <= 17) {
        grid[entry.day_of_week][h] = entry;
      }
    }
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-text-primary mb-3">
        Weekly Overview
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="p-2 text-left text-text-muted font-medium w-16">Time</th>
              {daysOrder.map((day) => (
                <th key={day} className="p-2 text-center text-text-muted font-medium">
                  {day.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((h) => (
              <tr key={h} className="border-t border-border">
                <td className="p-2 text-text-muted font-medium">
                  {formatTime(`${h}:00`)}
                </td>
                {daysOrder.map((day) => {
                  const event = grid[day][h];
                  return (
                    <td key={`${day}-${h}`} className="p-1">
                      {event ? (
                        <div className="bg-red-light border border-red-status/15 rounded px-2 py-1 text-center">
                          <p className="text-red-status font-medium truncate text-[10px]">
                            {event.subject_name}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-green-light/50 rounded px-2 py-1 text-center">
                          <span className="text-green-status/30">–</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
