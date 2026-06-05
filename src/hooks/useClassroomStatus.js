import { useState, useEffect, useMemo } from 'react';
import { computeClassroomStatus } from '../lib/utils';

export function useClassroomStatus(classrooms, timetable, reservations) {
  const [tick, setTick] = useState(0);

  // Re-compute every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const statusMap = useMemo(() => {
    const map = {};
    for (const classroom of classrooms) {
      const roomTimetable = timetable.filter(
        (t) => t.classroom_id === classroom.id
      );
      const roomReservations = reservations.filter(
        (r) => r.classroom_id === classroom.id
      );
      map[classroom.id] = computeClassroomStatus(
        classroom,
        roomTimetable,
        roomReservations
      );
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classrooms, timetable, reservations, tick]);

  return statusMap;
}
