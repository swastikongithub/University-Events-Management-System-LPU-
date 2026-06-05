import { X, Building2, Users, BookOpen } from 'lucide-react';
import StatusBadge from './StatusBadge';
import AmenityIcons from './AmenityIcons';
import TimetableView from './TimetableView';
import WeeklyCalendar from './WeeklyCalendar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function RoomDetailModal({
  classroom,
  statusInfo,
  timetable,
  reservations,
  onClose,
}) {
  const { isTeacher } = useAuth();
  const navigate = useNavigate();

  if (!classroom) return null;

  const roomTimetable = timetable.filter((t) => t.classroom_id === classroom.id);
  const roomReservations = reservations.filter((r) => r.classroom_id === classroom.id);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 drawer-backdrop"
        onClick={onClose}
      />

      {/* Side Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white border-l border-border overflow-y-auto slide-in-right shadow-xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                {classroom.room_number}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-text-secondary text-sm">
                <Building2 size={14} />
                <span>Building {classroom.building_number}, Floor {classroom.floor}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg-page text-text-muted hover:text-text-primary transition-colors"
              id="close-room-detail"
            >
              <X size={20} />
            </button>
          </div>

          {/* Status + Capacity */}
          <div className="flex items-center gap-3">
            <StatusBadge status={statusInfo?.status || classroom.status} />
            <span className="text-sm text-text-secondary flex items-center gap-1.5">
              <Users size={14} />
              {classroom.capacity} seats
            </span>
          </div>

          {/* Amenities */}
          <div className="card p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-text-muted" />
              Amenities
            </h4>
            <AmenityIcons classroom={classroom} showLabels size={16} />
          </div>

          {/* Reserve CTA */}
          {isTeacher && statusInfo?.status !== 'maintenance' && (
            <button
              className="btn-primary w-full text-center"
              onClick={() => {
                onClose();
                navigate(`/reserve?room=${classroom.id}`);
              }}
              id="reserve-room-cta"
            >
              Reserve This Room
            </button>
          )}

          {/* Today's Timetable */}
          <div className="card p-4">
            <TimetableView
              timetable={roomTimetable}
              reservations={roomReservations}
            />
          </div>

          {/* Weekly Calendar */}
          <div className="card p-4">
            <WeeklyCalendar timetable={roomTimetable} />
          </div>
        </div>
      </div>
    </>
  );
}
