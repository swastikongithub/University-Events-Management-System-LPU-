import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { isDemoMode, demoReservations } from '../lib/demoData';
import { v4Fallback } from '../lib/utils';

export function useReservations(classroomId = null) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    // Demo mode — use local data
    if (isDemoMode()) {
      let data = [...demoReservations];
      if (classroomId) {
        data = data.filter((r) => r.classroom_id === classroomId);
      }
      setReservations(data);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('reservations')
        .select('*, classrooms(room_number, building)')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (classroomId) {
        query = query.eq('classroom_id', classroomId);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setReservations(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    fetchReservations();

    // Skip realtime in demo mode
    if (isDemoMode()) return;

    // Realtime subscription
    const channel = supabase
      .channel(`reservations-changes-${classroomId || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => {
          // Refetch on any change to get joined data
          fetchReservations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [classroomId, fetchReservations]);

  const createReservation = async (reservation) => {
    if (isDemoMode()) {
      const newRes = {
        ...reservation,
        id: crypto.randomUUID?.() || v4Fallback(),
        created_at: new Date().toISOString(),
      };
      setReservations((prev) => [...prev, newRes]);
      // Also push to the global demo data so other components see it
      demoReservations.push(newRes);
      return newRes;
    }

    const { data, error: insertError } = await supabase
      .from('reservations')
      .insert(reservation)
      .select()
      .single();
    if (insertError) throw insertError;
    return data;
  };

  const deleteReservation = async (id) => {
    if (isDemoMode()) {
      setReservations((prev) => prev.filter((r) => r.id !== id));
      // Also remove from global demo data
      const idx = demoReservations.findIndex((r) => r.id === id);
      if (idx !== -1) demoReservations.splice(idx, 1);
      return;
    }

    const { error: deleteError } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);
    if (deleteError) throw deleteError;
  };

  return { reservations, loading, error, createReservation, deleteReservation, refetch: fetchReservations };
}
