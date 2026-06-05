import { useState } from 'react';
import { useReservations } from '../hooks/useReservations';
import { CalendarDays, Clock, BookOpen, User, FileText, CheckCircle } from 'lucide-react';

export default function ReserveForm({ classrooms, preselectedRoom = '' }) {
  const { createReservation } = useReservations();
  const [form, setForm] = useState({
    classroom_id: preselectedRoom,
    date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '10:50',
    subject_name: '',
    teacher_name: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.classroom_id || !form.date || !form.start_time || !form.end_time || !form.subject_name || !form.teacher_name) {
      setError('Please fill in all required fields.');
      return;
    }

    if (form.start_time >= form.end_time) {
      setError('End time must be after start time.');
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({
        classroom_id: form.classroom_id,
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
        subject_name: form.subject_name,
        teacher_name: form.teacher_name,
        notes: form.notes || null,
      });
      setSuccess(true);
      setForm((prev) => ({ ...prev, subject_name: '', teacher_name: '', notes: '' }));
    } catch (err) {
      setError(err.message || 'Failed to create reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5 max-w-xl w-full fade-in" id="reserve-form">
      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
        <CalendarDays size={18} className="text-lpu-orange" />
        Reserve a Classroom
      </h3>

      {/* Room */}
      <div className="space-y-1.5">
        <label className="text-xs text-text-secondary font-medium">Room *</label>
        <select
          name="classroom_id"
          value={form.classroom_id}
          onChange={handleChange}
          className="select"
          id="reserve-room-select"
        >
          <option value="">Select a room...</option>
          {classrooms
            .filter((c) => c.status !== 'maintenance')
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.room_number} — Bldg {c.building_number} ({c.capacity} seats)
              </option>
            ))}
        </select>
      </div>

      {/* Date */}
      <div className="space-y-1.5">
        <label className="text-xs text-text-secondary font-medium flex items-center gap-1.5">
          <CalendarDays size={12} />
          Date *
        </label>
        <input type="date" name="date" value={form.date} onChange={handleChange} className="input" id="reserve-date" />
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-text-secondary font-medium flex items-center gap-1.5">
            <Clock size={12} /> Start Time *
          </label>
          <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="input" id="reserve-start-time" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-text-secondary font-medium flex items-center gap-1.5">
            <Clock size={12} /> End Time *
          </label>
          <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="input" id="reserve-end-time" />
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <label className="text-xs text-text-secondary font-medium flex items-center gap-1.5">
          <BookOpen size={12} /> Subject Name *
        </label>
        <input type="text" name="subject_name" value={form.subject_name} onChange={handleChange}
          placeholder="e.g. Advanced Algorithms" className="input" id="reserve-subject" />
      </div>

      {/* Teacher */}
      <div className="space-y-1.5">
        <label className="text-xs text-text-secondary font-medium flex items-center gap-1.5">
          <User size={12} /> Teacher Name *
        </label>
        <input type="text" name="teacher_name" value={form.teacher_name} onChange={handleChange}
          placeholder="e.g. Dr. Ravi Kumar" className="input" id="reserve-teacher" />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="text-xs text-text-secondary font-medium flex items-center gap-1.5">
          <FileText size={12} /> Notes (optional)
        </label>
        <textarea name="notes" value={form.notes} onChange={handleChange}
          placeholder="Additional notes..." rows={3} className="input resize-none" id="reserve-notes" />
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-light border border-red-status/20 rounded-lg px-4 py-2 text-sm text-red-status">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-light border border-green-status/20 rounded-lg px-4 py-2 text-sm text-green-status flex items-center gap-2">
          <CheckCircle size={16} /> Reservation created successfully!
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full" id="reserve-submit">
        {submitting ? 'Reserving...' : 'Reserve Room'}
      </button>
    </form>
  );
}
