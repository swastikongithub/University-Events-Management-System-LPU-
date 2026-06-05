import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { isDemoMode, demoTimetable } from '../lib/demoData';

export function useTimetable(classroomId = null) {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTimetable = useCallback(async () => {
    // Demo mode — use local data
    if (isDemoMode()) {
      let data = [...demoTimetable];
      if (classroomId) {
        data = data.filter((t) => t.classroom_id === classroomId);
      }
      setTimetable(data);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('timetable')
        .select('*, classrooms(room_number, building)')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (classroomId) {
        query = query.eq('classroom_id', classroomId);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setTimetable(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  return { timetable, loading, error, refetch: fetchTimetable };
}
