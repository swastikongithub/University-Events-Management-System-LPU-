import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { isDemoMode, demoClassrooms } from '../lib/demoData';

export function useClassrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClassrooms = useCallback(async () => {
    // Demo mode — use local data
    if (isDemoMode()) {
      setClassrooms(demoClassrooms);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('classrooms')
        .select('*')
        .order('building', { ascending: true })
        .order('room_number', { ascending: true });

      if (fetchError) throw fetchError;
      setClassrooms(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassrooms();

    // Skip realtime in demo mode
    if (isDemoMode()) return;

    // Realtime subscription
    const channel = supabase
      .channel('classrooms-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'classrooms' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setClassrooms((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setClassrooms((prev) =>
              prev.map((c) => (c.id === payload.new.id ? payload.new : c))
            );
          } else if (payload.eventType === 'DELETE') {
            setClassrooms((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchClassrooms]);

  const addClassroom = async (classroom) => {
    if (isDemoMode()) {
      const newRoom = {
        ...classroom,
        id: `demo-room-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      setClassrooms((prev) => [...prev, newRoom]);
      return newRoom;
    }

    const { data, error: insertError } = await supabase
      .from('classrooms')
      .insert(classroom)
      .select()
      .single();
    if (insertError) throw insertError;
    return data;
  };

  const updateClassroom = async (id, updates) => {
    if (isDemoMode()) {
      setClassrooms((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
      return { id, ...updates };
    }

    const { data, error: updateError } = await supabase
      .from('classrooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (updateError) throw updateError;
    return data;
  };

  const deleteClassroom = async (id) => {
    if (isDemoMode()) {
      setClassrooms((prev) => prev.filter((c) => c.id !== id));
      return;
    }

    const { error: deleteError } = await supabase
      .from('classrooms')
      .delete()
      .eq('id', id);
    if (deleteError) throw deleteError;
  };

  return { classrooms, loading, error, addClassroom, updateClassroom, deleteClassroom, refetch: fetchClassrooms };
}
