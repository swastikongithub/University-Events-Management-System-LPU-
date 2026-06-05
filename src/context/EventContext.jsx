import { createContext, useContext, useState } from 'react';

const EventContext = createContext(null);

const initialEvents = [
  { id: 1, title: 'YouthVibe 2026', org: 'Student Welfare', cat: 'Fest', date: '2026-06-01', time: '09:00', venue: 'UNIPOLIS', seats: 5000, duty: 'yes' },
  { id: 8, title: 'Annual Sports Meet', org: 'Sports Department', cat: 'Sports', date: '2026-06-03', time: '10:00', venue: 'Main Ground', seats: 1000, duty: 'yes' },
  { id: 9, title: 'Guest Lecture on AI', org: 'Tech Club', cat: 'Seminar', date: '2026-06-04', time: '14:00', venue: 'Block 32, Auditorium', seats: 300, duty: 'yes' },
  { id: 10, title: 'Blood Donation Camp', org: 'NSS', cat: 'Social', date: '2026-06-05', time: '09:00', venue: 'Student Center', seats: 200, duty: 'yes' },
  { id: 2, title: 'RoboWars', org: 'Robotics Society', cat: 'Competition', date: '2026-06-06', time: '10:00', venue: 'Shanti Devi Mittal Auditorium', seats: 500, duty: 'pending' },
  { id: 3, title: 'React Workshop', org: 'Web Dev Cell', cat: 'Workshop', date: '2026-06-07', time: '16:00', venue: 'UNI-Auditorium', seats: 60, duty: 'no' },
  { id: 4, title: 'AI Hackathon', org: 'Tech Club', cat: 'Competition', date: '2026-06-08', time: '09:00', venue: 'Block 32, Lab 3', seats: 120, duty: 'yes' },
  { id: 5, title: 'Music Fest', org: 'Cultural Society', cat: 'Fest', date: '2026-06-09', time: '09:00', venue: 'Baldev Raj Mittal Auditorium', seats: 800, duty: 'pending' },
  { id: 6, title: 'Startup Pitch', org: 'Entrepreneurship Cell', cat: 'Seminar', date: '2026-06-10', time: '09:00', venue: 'Block 14, Room 201', seats: 200, duty: 'yes' },
  { id: 7, title: 'Basketball Tournament', org: 'Sports Department', cat: 'Sports', date: '2026-06-11', time: '14:00', venue: 'Indoor Stadium', seats: 300, duty: 'yes' },
];

export function EventProvider({ children }) {
  const [events, setEvents] = useState(initialEvents);
  const [registrations, setRegistrations] = useState([]); // { eventId, studentRegNo }

  const addEvent = (event) => {
    setEvents([...events, { ...event, id: Date.now() }]);
  };

  const updateDutyLeave = (eventId, newStatus) => {
    setEvents(events.map(e => e.id === eventId ? { ...e, duty: newStatus } : e));
  };

  const registerForEvent = (eventId, studentRegNo, type = 'attendee') => {
    if (registrations.find(r => r.eventId === eventId && r.studentRegNo === studentRegNo)) {
      return { success: false, message: 'You are already registered for this event.' };
    }

    if (type === 'volunteer') {
      const targetEvent = events.find(e => e.id === eventId);
      if (!targetEvent) return { success: false, message: 'Event not found.' };

      const studentVolunteerRegs = registrations.filter(r => r.studentRegNo === studentRegNo && r.type === 'volunteer');
      
      const overlappingEventsCount = studentVolunteerRegs.reduce((count, reg) => {
        const ev = events.find(e => e.id === reg.eventId);
        if (ev && ev.date === targetEvent.date && ev.time === targetEvent.time) {
          return count + 1;
        }
        return count;
      }, 0);

      if (overlappingEventsCount >= 2) {
        return { success: false, message: 'You cannot volunteer for more than 2 events happening at the same time.' };
      }
    }

    setRegistrations([...registrations, { eventId, studentRegNo, type }]);
    return { success: true };
  };

  const isRegistered = (eventId, studentRegNo) => {
    return !!registrations.find(r => r.eventId === eventId && r.studentRegNo === studentRegNo);
  };

  return (
    <EventContext.Provider value={{ events, registrations, addEvent, updateDutyLeave, registerForEvent, isRegistered }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents must be used within EventProvider');
  return ctx;
}
