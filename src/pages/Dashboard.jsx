import { useState, useMemo } from 'react';
import { useClassrooms } from '../hooks/useClassrooms';
import { useReservations } from '../hooks/useReservations';
import { useTimetable } from '../hooks/useTimetable';
import { useClassroomStatus } from '../hooks/useClassroomStatus';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ClassroomGrid from '../components/ClassroomGrid';
import RoomDetailModal from '../components/RoomDetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Radio } from 'lucide-react';

export default function Dashboard() {
  const { classrooms, loading: loadingRooms } = useClassrooms();
  const { reservations, loading: loadingRes } = useReservations();
  const { timetable, loading: loadingTT } = useTimetable();
  const statusMap = useClassroomStatus(classrooms, timetable, reservations);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    building: 'All',
    capacity: 'all',
    status: 'All',
    amenities: [],
  });
  const [selectedRoom, setSelectedRoom] = useState(null);

  const loading = loadingRooms || loadingRes || loadingTT;

  const filteredClassrooms = useMemo(() => {
    return classrooms.filter((room) => {
      if (search) {
        const q = search.toLowerCase();
        if (!room.room_number.toLowerCase().includes(q) &&
            !String(room.building_number).includes(q)) return false;
      }

      if (filters.building !== 'All' && String(room.building_number) !== filters.building) return false;

      if (filters.capacity !== 'all') {
        if (filters.capacity === '61+') {
          if (room.capacity < 61) return false;
        } else {
          const [min, max] = filters.capacity.split('-').map(Number);
          if (room.capacity < min || room.capacity > max) return false;
        }
      }

      if (filters.status !== 'All') {
        const computed = statusMap[room.id]?.status || room.status;
        if (computed !== filters.status) return false;
      }

      for (const amenity of filters.amenities) {
        if (!room[amenity]) return false;
      }

      return true;
    });
  }, [classrooms, search, filters, statusMap]);

  const stats = useMemo(() => {
    const available = Object.values(statusMap).filter((s) => s.status === 'available').length;
    const occupied = Object.values(statusMap).filter((s) => s.status === 'occupied').length;
    const reserved = Object.values(statusMap).filter((s) => s.status === 'reserved').length;
    return { available, occupied, reserved, total: classrooms.length };
  }, [statusMap, classrooms]);

  if (loading) return <LoadingSpinner text="Loading classrooms..." />;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Radio size={22} className="text-lpu-orange" />
            Classroom Finder
          </h1>
          <p className="text-sm text-text-secondary mt-1">Live availability across LPU campus</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="status-dot status-dot--available" />
            <span className="text-text-secondary font-medium">{stats.available} Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="status-dot status-dot--occupied" />
            <span className="text-text-secondary font-medium">{stats.occupied} Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="status-dot status-dot--reserved" />
            <span className="text-text-secondary font-medium">{stats.reserved} Reserved</span>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar filters={filters} onFilterChange={setFilters} />
      </div>

      {/* Grid */}
      <ClassroomGrid
        classrooms={filteredClassrooms}
        statusMap={statusMap}
        onCardClick={(room) => setSelectedRoom(room)}
      />

      {/* Room Detail Drawer */}
      {selectedRoom && (
        <RoomDetailModal
          classroom={selectedRoom}
          statusInfo={statusMap[selectedRoom.id]}
          timetable={timetable}
          reservations={reservations}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
