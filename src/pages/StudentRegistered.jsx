import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function StudentRegistered() {
  const { events, registrations } = useEvents();
  const { user } = useAuth();
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.reg-card', 
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        duration: 0.4,
        ease: 'back.out(1.2)',
        clearProps: 'all'
      }
    );
  }, { scope: containerRef });

  const myRegistrations = registrations
    .filter(r => r.studentRegNo === user.regNo)
    .map(r => events.find(e => e.id === r.eventId))
    .filter(Boolean); // remove any nulls

  return (
    <div ref={containerRef} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Registered Events</h1>
        <p className="text-sm text-gray-500">Events you have successfully registered for.</p>
      </div>

      {myRegistrations.length === 0 ? (
        <div className="ums-card p-12 flex flex-col items-center justify-center text-gray-500">
          <Calendar size={48} className="mb-4 text-gray-300" />
          <h2 className="text-lg font-bold text-gray-700 mb-1">No Registrations Yet</h2>
          <p>Head over to the Dashboard to discover and register for events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myRegistrations.map(event => (
            <div key={event.id} className="reg-card ums-card p-5 flex items-start gap-4 border-l-4 border-l-[#FCA24E]">
              <div className="bg-[#FCA24E]/10 p-3 rounded-lg flex-shrink-0 text-[#FCA24E]">
                <Calendar size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{event.org}</p>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock size={12} /> {event.date} at {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin size={12} /> {event.venue}
                  </div>
                </div>
              </div>
              <div>
                {event.duty === 'yes' ? (
                  <span className="status-badge status-approved">Duty Leave</span>
                ) : event.duty === 'pending' ? (
                  <span className="status-badge status-pending text-xs">Duty Pending</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
