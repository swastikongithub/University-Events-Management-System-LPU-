import ClassroomCard from './ClassroomCard';

export default function ClassroomGrid({ classrooms, statusMap, onCardClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {classrooms.map((room) => (
        <ClassroomCard
          key={room.id}
          classroom={room}
          statusInfo={statusMap[room.id]}
          onClick={() => onCardClick(room)}
        />
      ))}
      {classrooms.length === 0 && (
        <div className="col-span-full py-16 text-center">
          <p className="text-4xl mb-3">🏫</p>
          <p className="text-text-secondary text-sm">No classrooms match your filters.</p>
        </div>
      )}
    </div>
  );
}
