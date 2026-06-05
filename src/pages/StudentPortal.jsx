import { useRef } from 'react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function StudentPortal({ filterType = 'all' }) {
  const { events } = useEvents();
  const { searchQuery } = useOutletContext() || { searchQuery: '' };
  const navigate = useNavigate();
  
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.event-card', 
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'all'
      }
    );
  }, { scope: containerRef, dependencies: [events, searchQuery, filterType] });

  // Get current date as YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  const filteredEvents = events.filter(e => {
    // Search query filter
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.cat.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Date/Tab filter
    if (filterType === 'ongoing') {
      return e.date >= today && e.duty === 'yes';
    } else if (filterType === 'upcoming') {
      return e.date >= today && e.duty === 'pending';
    } else if (filterType === 'past') {
      return e.date < today && e.duty === 'yes';
    }
    
    return true; // 'all'
  }).sort((a, b) => {
    const getPriority = (event) => {
      if (event.date < today) return 4; // Closed events
      if (event.duty === 'yes') return 1; // Approved ongoing
      if (event.duty === 'pending') return 2; // Pending
      return 3; // Not approved
    };
    return getPriority(a) - getPriority(b);
  });

  const getDutyBadge = (status) => {
    if (status === 'yes') return <span className="status-badge status-approved">Approved</span>;
    if (status === 'pending') return <span className="status-badge status-pending">Pending</span>;
    return <span className="status-badge status-rejected">Not Approved</span>;
  };

  const handleRegisterClick = (e, eventId) => {
    e.stopPropagation();
    navigate(`/event/${eventId}/register`);
  };

  const getPageTitle = () => {
    if (filterType === 'ongoing') return 'Ongoing Events';
    if (filterType === 'upcoming') return 'Upcoming Events';
    if (filterType === 'past') return 'Past Events';
    return 'All Campus Events';
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
          <p className="text-sm text-gray-500">Discover and register for university events.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => {
          // Since it's public, we don't know if they are registered yet from this screen.
          // They will find out when they try to register if they use the same RegNo.
          return (
            <div key={event.id} className="event-card ums-card interactive pl-6 pr-5 py-5 flex flex-col h-full relative overflow-hidden group">
              {/* Hover Sidebar accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FCA24E] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
              
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {event.cat}
                </span>
                {getDutyBadge(event.duty)}
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-1">{event.title}</h3>
              <p className="text-sm text-gray-500 mb-4 flex-1">By {event.org}</p>
              
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} className="text-[#FCA24E]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} className="text-[#FCA24E]" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-[#FCA24E]" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={14} className="text-[#FCA24E]" />
                  <span>{event.seats} Seats</span>
                </div>
              </div>
              
              {event.date < today ? (
                <button 
                  disabled
                  className="w-full py-2.5 rounded-lg font-bold text-sm transition-colors bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  Registration Closed
                </button>
              ) : event.duty === 'pending' ? (
                <button 
                  disabled
                  className="w-full py-2.5 rounded-lg font-bold text-sm transition-colors bg-yellow-100 text-yellow-700 cursor-not-allowed border border-yellow-200"
                >
                  Waiting for the approval by higher authorities
                </button>
              ) : event.duty !== 'yes' ? (
                <button 
                  disabled
                  className="w-full py-2.5 rounded-lg font-bold text-sm transition-colors bg-red-100 text-red-700 cursor-not-allowed border border-red-200"
                >
                  Not Approved
                </button>
              ) : (
                <button 
                  onClick={(e) => handleRegisterClick(e, event.id)}
                  className="w-full py-2.5 rounded-lg font-bold text-sm transition-colors bg-[#FCA24E] hover:bg-[#E5872E] text-white"
                >
                  Register Now
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No events found matching your search.
        </div>
      )}
    </div>
  );
}
