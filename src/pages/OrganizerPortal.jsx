import { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { Calendar } from 'lucide-react';

export default function OrganizerPortal() {
  const { events, addEvent, registrations } = useEvents();
  const { user } = useAuth();
  
  const myEvents = events.filter(e => e.org === user.name);

  const [formData, setFormData] = useState({
    title: '', cat: 'Fest', date: '', time: '', venue: 'UNIPOLIS', seats: '', duty: 'pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent({
      ...formData,
      org: user.name,
      seats: parseInt(formData.seats, 10)
    });
    setFormData({ title: '', cat: 'Fest', date: '', time: '', venue: 'UNIPOLIS', seats: '', duty: 'pending' });
    alert('Event Created Successfully!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Organizer Dashboard</h1>
        <p className="text-sm text-gray-500">Create new events and track registrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1 ums-card p-6">
          <h2 className="text-lg font-bold mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Event Title</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="ums-input" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="ums-input" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Time</label>
                <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="ums-input" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Venue</label>
              <select required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="ums-input">
                <option value="UNIPOLIS">UNIPOLIS</option>
                <option value="Shanti Devi Mittal Auditorium">Shanti Devi Mittal Auditorium</option>
                <option value="UNI-Auditorium">UNI-Auditorium</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
                <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="ums-input">
                  <option>Fest</option>
                  <option>Workshop</option>
                  <option>Seminar</option>
                  <option>Competition</option>
                  <option>Club</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Total Seats</label>
                <input type="number" required value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} className="ums-input" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Apply for Duty Leave?</label>
              <select value={formData.duty} onChange={e => setFormData({...formData, duty: e.target.value})} className="ums-input">
                <option value="pending">Yes (Pending Approval)</option>
                <option value="no">No</option>
              </select>
            </div>

            <button type="submit" className="ums-btn-primary w-full mt-4">Publish Event</button>
          </form>
        </div>

        {/* My Events List */}
        <div className="lg:col-span-2 ums-card p-6">
          <h2 className="text-lg font-bold mb-4">My Events</h2>
          {myEvents.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <Calendar className="mx-auto mb-2 text-gray-300" size={32} />
              You haven't created any events yet.
            </div>
          ) : (
            <div className="space-y-4">
              {myEvents.map(event => {
                const regCount = registrations.filter(r => r.eventId === event.id).length;
                return (
                  <div key={event.id} className="border border-gray-100 rounded-lg p-4 flex justify-between items-center bg-gray-50">
                    <div>
                      <h3 className="font-bold text-gray-800">{event.title}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {event.date} at {event.time} | {event.venue}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Registrations</div>
                      <div className="text-xl font-bold text-[#FCA24E]">{regCount} <span className="text-sm text-gray-400">/ {event.seats}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
