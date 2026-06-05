import { Trash2, Calendar, Clock } from 'lucide-react';
import { formatTime } from '../lib/utils';

export default function ReservationTable({ reservations, onDelete }) {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-text-secondary text-sm">No reservations found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Room</th>
            <th className="text-left p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Subject</th>
            <th className="text-left p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Teacher</th>
            <th className="text-left p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Date</th>
            <th className="text-left p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Time</th>
            <th className="text-left p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Notes</th>
            <th className="text-right p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id} className="border-b border-border/50 hover:bg-bg-page transition-colors">
              <td className="p-3 font-bold text-text-primary">
                {res.classrooms?.room_number || '—'}
                <span className="block text-xs text-text-muted font-normal">
                  Bldg {res.classrooms?.building_number}
                </span>
              </td>
              <td className="p-3 text-text-primary">{res.subject_name}</td>
              <td className="p-3 text-text-secondary">{res.teacher_name}</td>
              <td className="p-3 text-text-secondary flex items-center gap-1.5">
                <Calendar size={12} className="text-text-muted" />
                {res.date}
              </td>
              <td className="p-3 text-text-secondary text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-text-muted" />
                  {formatTime(res.start_time)} – {formatTime(res.end_time)}
                </span>
              </td>
              <td className="p-3 text-text-muted text-xs max-w-[150px] truncate">
                {res.notes || '—'}
              </td>
              <td className="p-3 text-right">
                <button
                  onClick={() => onDelete(res.id)}
                  className="p-2 rounded-lg hover:bg-red-light text-text-muted hover:text-red-status transition-colors"
                  title="Delete reservation"
                  id={`delete-reservation-${res.id}`}
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
