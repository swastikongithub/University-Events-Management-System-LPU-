import { useState } from 'react';
import { Trash2, Edit3, Plus, X, Wrench, CheckCircle } from 'lucide-react';
import AmenityIcons from './AmenityIcons';

export default function ClassroomManager({ classrooms, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    room_number: '',
    building_number: 36,
    floor: 1,
    capacity: 30,
    has_ac: false,
    has_projector: false,
    has_whiteboard: true,
    has_wifi: false,
  });

  const resetForm = () => {
    setForm({
      room_number: '', building_number: 36, floor: 1, capacity: 30,
      has_ac: false, has_projector: false, has_whiteboard: true, has_wifi: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (room) => {
    setForm({
      room_number: room.room_number,
      building_number: room.building_number,
      floor: room.floor,
      capacity: room.capacity,
      has_ac: room.has_ac,
      has_projector: room.has_projector,
      has_whiteboard: room.has_whiteboard,
      has_wifi: room.has_wifi,
    });
    setEditingId(room.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await onUpdate(editingId, form);
      } else {
        await onAdd({ ...form, status: 'available' });
      }
      resetForm();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const toggleMaintenance = async (room) => {
    const newStatus = room.status === 'maintenance' ? 'available' : 'maintenance';
    await onUpdate(room.id, { status: newStatus });
  };

  return (
    <div className="space-y-4">
      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="btn-primary inline-flex items-center gap-2"
          id="add-classroom-btn"
        >
          <Plus size={14} /> Add Classroom
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 space-y-4" id="classroom-form">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-text-primary">
              {editingId ? 'Edit Classroom' : 'Add New Classroom'}
            </h4>
            <button type="button" onClick={resetForm} className="text-text-muted hover:text-text-primary">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-text-secondary">Room Number</label>
              <input type="text" value={form.room_number}
                onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                className="input" placeholder="e.g., 36-502A" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-secondary">Building #</label>
              <input type="number" value={form.building_number}
                onChange={(e) => setForm({ ...form, building_number: parseInt(e.target.value) || 0 })}
                className="input" min={1} required />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-secondary">Floor</label>
              <input type="number" value={form.floor}
                onChange={(e) => setForm({ ...form, floor: parseInt(e.target.value) || 0 })}
                className="input" min={0} required />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-text-secondary">Capacity</label>
              <input type="number" value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })}
                className="input" min={1} required />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { key: 'has_ac', label: 'AC' },
              { key: 'has_projector', label: 'Projector' },
              { key: 'has_whiteboard', label: 'Whiteboard' },
              { key: 'has_wifi', label: 'WiFi' },
            ].map(({ key, label }) => (
              <label key={key} className="inline-flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input type="checkbox" checked={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  className="rounded accent-lpu-orange" />
                {label}
              </label>
            ))}
          </div>

          <button type="submit" className="btn-primary">
            {editingId ? 'Save Changes' : 'Add Classroom'}
          </button>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Room</th>
              <th className="text-left p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Building</th>
              <th className="text-left p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Capacity</th>
              <th className="text-left p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Amenities</th>
              <th className="text-left p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="text-right p-3 text-text-muted font-medium text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((room) => (
              <tr key={room.id} className="border-b border-border/50 hover:bg-bg-page transition-colors">
                <td className="p-3 font-bold text-text-primary">{room.room_number}</td>
                <td className="p-3 text-text-secondary">Bldg {room.building_number}</td>
                <td className="p-3 text-text-secondary">{room.capacity}</td>
                <td className="p-3"><AmenityIcons classroom={room} size={14} /></td>
                <td className="p-3">
                  <span className={`text-xs font-semibold capitalize ${
                    room.status === 'maintenance' ? 'text-slate-status' : 'text-green-status'
                  }`}>
                    {room.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => toggleMaintenance(room)}
                      className={`p-2 rounded-lg transition-colors ${
                        room.status === 'maintenance'
                          ? 'hover:bg-green-light text-green-status'
                          : 'hover:bg-amber-light text-text-muted hover:text-amber-status'
                      }`}
                      title={room.status === 'maintenance' ? 'Mark Available' : 'Mark Maintenance'}
                    >
                      {room.status === 'maintenance' ? <CheckCircle size={14} /> : <Wrench size={14} />}
                    </button>
                    <button onClick={() => handleEdit(room)}
                      className="p-2 rounded-lg hover:bg-bg-page text-text-muted hover:text-text-primary transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => { if (confirm('Delete this classroom?')) onDelete(room.id); }}
                      className="p-2 rounded-lg hover:bg-red-light text-text-muted hover:text-red-status transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
