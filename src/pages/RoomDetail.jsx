import { useParams, Link } from 'react-router-dom';
import { useClassrooms } from '../hooks/useClassrooms';
import { useReservations } from '../hooks/useReservations';
import { useTimetable } from '../hooks/useTimetable';
import { useClassroomStatus } from '../hooks/useClassroomStatus';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import AmenityIcons from '../components/AmenityIcons';
import TimetableView from '../components/TimetableView';
import WeeklyCalendar from '../components/WeeklyCalendar';
import CountdownTimer from '../components/CountdownTimer';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Building2, Users, BookOpen } from 'lucide-react';

export default function RoomDetail() {
  const { id } = useParams();
  const { classrooms, loading: loadingRooms } = useClassrooms();
  const { reservations, loading: loadingRes } = useReservations(id);
  const { timetable, loading: loadingTT } = useTimetable(id);
  const { isTeacher } = useAuth();

  const room = classrooms.find((c) => c.id === id);
  const statusMap = useClassroomStatus(room ? [room] : [], timetable, reservations);
  const statusInfo = room ? statusMap[room.id] : null;

  const loading = loadingRooms || loadingRes || loadingTT;

  if (loading) return <LoadingSpinner text="Loading room details..." />;

  if (!room) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">🏫</p>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Room Not Found</h2>
        <p className="text-sm text-text-secondary mb-6">The classroom you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-lpu-orange transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{room.room_number}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-text-secondary text-sm">
                <Building2 size={14} /> Building {room.building_number}, Floor {room.floor}
              </span>
              <span className="flex items-center gap-1.5 text-text-secondary text-sm">
                <Users size={14} /> {room.capacity} seats
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={statusInfo?.status || room.status} />
            {isTeacher && statusInfo?.status !== 'maintenance' && (
              <Link to={`/reserve?room=${room.id}`} className="btn-primary text-sm">
                Reserve Room
              </Link>
            )}
          </div>
        </div>

        {statusInfo?.occupant && (
          <div className="mt-4 p-3 rounded-lg bg-lpu-orange-light border border-lpu-orange/10">
            <p className="text-sm text-text-primary font-medium">{statusInfo.occupant.subject}</p>
            <p className="text-xs text-text-secondary">{statusInfo.occupant.teacher}</p>
          </div>
        )}

        {statusInfo?.timeRemaining > 0 && (
          <div className="mt-3">
            <CountdownTimer seconds={statusInfo.timeRemaining} label="Ends in" />
          </div>
        )}
      </div>

      {/* Amenities */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <BookOpen size={14} className="text-text-muted" /> Amenities
        </h3>
        <AmenityIcons classroom={room} showLabels size={18} />
      </div>

      {/* Timetable */}
      <div className="card p-5">
        <TimetableView timetable={timetable} reservations={reservations} />
      </div>

      {/* Weekly */}
      <div className="card p-5">
        <WeeklyCalendar timetable={timetable} />
      </div>
    </div>
  );
}
