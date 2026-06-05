import { useEvents } from '../context/EventContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function TeacherPortal() {
  const { events, updateDutyLeave } = useEvents();
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.row-anim', 
      { x: -20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.4,
        ease: 'power2.out',
        clearProps: 'all'
      }
    );
  }, { scope: containerRef, dependencies: [events] });

  const pendingEvents = events.filter(e => e.duty === 'pending');
  const processedEvents = events.filter(e => e.duty !== 'pending');

  const handleAction = (id, status) => {
    updateDutyLeave(id, status);
  };

  return (
    <div ref={containerRef} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Duty Leave Approvals</h1>
        <p className="text-sm text-gray-500">Review and approve duty leave requests for upcoming events.</p>
      </div>

      <div className="ums-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FCA24E]"></span>
          Pending Requests ({pendingEvents.length})
        </h2>
        
        {pendingEvents.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No pending requests at the moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="pb-3 font-semibold">Event Name</th>
                  <th className="pb-3 font-semibold">Organizer</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingEvents.map(event => (
                  <tr key={event.id} className="row-anim border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-semibold text-gray-800">{event.title}</td>
                    <td className="py-4 text-sm text-gray-600">{event.org}</td>
                    <td className="py-4 text-sm text-gray-600">{event.date}</td>
                    <td className="py-4 flex gap-2">
                      <button 
                        onClick={() => handleAction(event.id, 'yes')}
                        className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button 
                        onClick={() => handleAction(event.id, 'no')}
                        className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-3 py-1.5 rounded hover:bg-red-200 transition-colors"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="ums-card p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Recently Processed</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="pb-3 font-semibold">Event Name</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {processedEvents.map(event => (
                <tr key={event.id} className="row-anim border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-800">{event.title}</td>
                  <td className="py-3 text-sm text-gray-600">{event.date}</td>
                  <td className="py-3">
                    {event.duty === 'yes' 
                      ? <span className="status-badge status-approved">Approved</span>
                      : <span className="status-badge status-rejected">Rejected</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
