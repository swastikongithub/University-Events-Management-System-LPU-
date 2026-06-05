import { useState } from 'react';
import { useClassrooms } from '../hooks/useClassrooms';
import { useReservations } from '../hooks/useReservations';
import ReservationTable from '../components/ReservationTable';
import ClassroomManager from '../components/ClassroomManager';
import LoadingSpinner from '../components/LoadingSpinner';
import { CalendarDays, Building2, Settings } from 'lucide-react';

const tabs = [
  { id: 'reservations', label: 'Reservations', icon: CalendarDays },
  { id: 'classrooms', label: 'Classrooms', icon: Building2 },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('reservations');
  const { classrooms, loading: loadingClassrooms, addClassroom, updateClassroom, deleteClassroom } = useClassrooms();
  const { reservations, loading: loadingReservations, deleteReservation } = useReservations();

  const loading = loadingClassrooms || loadingReservations;

  if (loading) return <LoadingSpinner text="Loading admin data..." />;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Settings size={22} className="text-lpu-orange" />
          Admin Panel
        </h1>
        <p className="text-sm text-text-secondary mt-1">Manage classrooms and reservations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-px">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all inline-flex items-center gap-2 border-b-2 -mb-px ${
              activeTab === id
                ? 'border-lpu-orange text-lpu-orange'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
            id={`admin-tab-${id}`}
          >
            <Icon size={16} />
            {label}
            <span className="ml-1 text-xs bg-bg-page px-2 py-0.5 rounded-full text-text-muted">
              {id === 'reservations' ? reservations.length : classrooms.length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card p-5">
        {activeTab === 'reservations' ? (
          <ReservationTable
            reservations={reservations}
            onDelete={async (id) => { if (confirm('Delete this reservation?')) await deleteReservation(id); }}
          />
        ) : (
          <ClassroomManager
            classrooms={classrooms}
            onAdd={addClassroom}
            onUpdate={updateClassroom}
            onDelete={deleteClassroom}
          />
        )}
      </div>
    </div>
  );
}
