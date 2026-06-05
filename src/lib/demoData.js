// ============================================
// ClassFinder — LPU Demo / Mock Data
// ============================================

import { v4Fallback, getDayName } from './utils';

const genId = () => crypto.randomUUID?.() || v4Fallback();

// 12 classrooms with LPU-accurate room numbers
const classroomSeeds = [
  { room_number: '36-502A', building_number: 36, floor: 5, capacity: 60,  has_ac: true,  has_projector: true,  has_whiteboard: true,  has_wifi: true,  status: 'available' },
  { room_number: '36-506',  building_number: 36, floor: 5, capacity: 40,  has_ac: false, has_projector: true,  has_whiteboard: true,  has_wifi: false, status: 'available' },
  { room_number: '36-507',  building_number: 36, floor: 5, capacity: 35,  has_ac: false, has_projector: false, has_whiteboard: true,  has_wifi: true,  status: 'available' },
  { room_number: '34-104',  building_number: 34, floor: 1, capacity: 30,  has_ac: true,  has_projector: false, has_whiteboard: true,  has_wifi: false, status: 'available' },
  { room_number: '37-606',  building_number: 37, floor: 6, capacity: 45,  has_ac: true,  has_projector: true,  has_whiteboard: false, has_wifi: true,  status: 'available' },
  { room_number: '37-610',  building_number: 37, floor: 6, capacity: 45,  has_ac: true,  has_projector: true,  has_whiteboard: false, has_wifi: true,  status: 'available' },
  { room_number: '33-508',  building_number: 33, floor: 5, capacity: 50,  has_ac: true,  has_projector: true,  has_whiteboard: true,  has_wifi: true,  status: 'available' },
  { room_number: '27-507A', building_number: 27, floor: 5, capacity: 60,  has_ac: true,  has_projector: true,  has_whiteboard: false, has_wifi: true,  status: 'available' },
  { room_number: '25-403',  building_number: 25, floor: 4, capacity: 80,  has_ac: true,  has_projector: true,  has_whiteboard: true,  has_wifi: true,  status: 'available' },
  { room_number: '6-405',   building_number: 6,  floor: 4, capacity: 35,  has_ac: false, has_projector: false, has_whiteboard: true,  has_wifi: false, status: 'available' },
  { room_number: '38-403',  building_number: 38, floor: 4, capacity: 40,  has_ac: true,  has_projector: false, has_whiteboard: false, has_wifi: true,  status: 'available' },
  { room_number: '38-509',  building_number: 38, floor: 5, capacity: 30,  has_ac: false, has_projector: false, has_whiteboard: true,  has_wifi: true,  status: 'maintenance' },
];

export const demoClassrooms = classroomSeeds.map((seed, i) => ({
  ...seed,
  id: `demo-room-${String(i + 1).padStart(3, '0')}`,
  created_at: new Date().toISOString(),
}));

const roomId = (num) => demoClassrooms.find((c) => c.room_number === num)?.id;

// LPU slot timings used as references
// 10:00-10:50, 10:20-11:10, 11:10-12:00, 12:00-12:50, 12:50-1:40, 1:40-2:30, 2:30-3:20, 3:20-4:10

function generateDynamicTimetable() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const today = getDayName(now);
  const pad = (n) => String(n).padStart(2, '0');

  // Fixed weekly entries (Mon-Sat)
  const fixedEntries = [
    { classroom_id: roomId('36-502A'), subject_name: 'Data Structures & Algorithms', teacher_name: 'Dr. Ravi Kumar',    day_of_week: 'Monday',    start_time: '10:00', end_time: '10:50' },
    { classroom_id: roomId('36-502A'), subject_name: 'Computer Networks',            teacher_name: 'Prof. Anita Sharma', day_of_week: 'Monday',    start_time: '11:10', end_time: '12:00' },
    { classroom_id: roomId('36-506'),  subject_name: 'Operating Systems',             teacher_name: 'Dr. Suresh Patel',  day_of_week: 'Monday',    start_time: '10:20', end_time: '11:10' },
    { classroom_id: roomId('36-506'),  subject_name: 'Database Management',           teacher_name: 'Prof. Meena Gupta', day_of_week: 'Monday',    start_time: '14:30', end_time: '15:20' },
    { classroom_id: roomId('34-104'),  subject_name: 'Engineering Mathematics',       teacher_name: 'Dr. Kiran Joshi',   day_of_week: 'Monday',    start_time: '12:00', end_time: '12:50' },
    { classroom_id: roomId('37-606'),  subject_name: 'Machine Learning',              teacher_name: 'Dr. Priya Singh',   day_of_week: 'Tuesday',   start_time: '10:00', end_time: '10:50' },
    { classroom_id: roomId('37-606'),  subject_name: 'Deep Learning Lab',             teacher_name: 'Dr. Priya Singh',   day_of_week: 'Tuesday',   start_time: '11:10', end_time: '12:50' },
    { classroom_id: roomId('33-508'),  subject_name: 'Software Engineering',          teacher_name: 'Prof. Rajesh Verma',day_of_week: 'Tuesday',   start_time: '10:20', end_time: '11:10' },
    { classroom_id: roomId('27-507A'), subject_name: 'Cloud Computing',               teacher_name: 'Dr. Vikram Reddy',  day_of_week: 'Tuesday',   start_time: '14:30', end_time: '15:20' },
    { classroom_id: roomId('25-403'),  subject_name: 'Physics',                       teacher_name: 'Prof. Sanjay Bose',  day_of_week: 'Wednesday', start_time: '10:00', end_time: '10:50' },
    { classroom_id: roomId('25-403'),  subject_name: 'Chemistry Lab',                 teacher_name: 'Dr. Neha Agarwal', day_of_week: 'Wednesday', start_time: '12:00', end_time: '13:40' },
    { classroom_id: roomId('36-507'),  subject_name: 'Web Development',               teacher_name: 'Prof. Amit Das',    day_of_week: 'Wednesday', start_time: '11:10', end_time: '12:00' },
    { classroom_id: roomId('37-610'),  subject_name: 'Artificial Intelligence',       teacher_name: 'Dr. Ravi Kumar',    day_of_week: 'Wednesday', start_time: '15:20', end_time: '16:10' },
    { classroom_id: roomId('36-502A'), subject_name: 'Compiler Design',               teacher_name: 'Prof. Anita Sharma',day_of_week: 'Thursday',  start_time: '10:20', end_time: '11:10' },
    { classroom_id: roomId('33-508'),  subject_name: 'Computer Architecture',         teacher_name: 'Dr. Suresh Patel',  day_of_week: 'Thursday',  start_time: '12:00', end_time: '12:50' },
    { classroom_id: roomId('6-405'),   subject_name: 'English Communication',         teacher_name: 'Prof. Pooja Nair',  day_of_week: 'Thursday',  start_time: '10:00', end_time: '10:50' },
    { classroom_id: roomId('38-403'),  subject_name: 'Cyber Security',                teacher_name: 'Dr. Vikram Reddy',  day_of_week: 'Thursday',  start_time: '14:30', end_time: '15:20' },
    { classroom_id: roomId('34-104'),  subject_name: 'Discrete Mathematics',          teacher_name: 'Dr. Kiran Joshi',   day_of_week: 'Friday',    start_time: '10:00', end_time: '10:50' },
    { classroom_id: roomId('27-507A'), subject_name: 'IoT Systems',                   teacher_name: 'Prof. Rajesh Verma',day_of_week: 'Friday',    start_time: '11:10', end_time: '12:00' },
    { classroom_id: roomId('36-502A'), subject_name: 'Data Science',                  teacher_name: 'Dr. Priya Singh',   day_of_week: 'Friday',    start_time: '12:50', end_time: '13:40' },
    { classroom_id: roomId('25-403'),  subject_name: 'Environmental Science',         teacher_name: 'Prof. Sanjay Bose',  day_of_week: 'Saturday',  start_time: '10:00', end_time: '10:50' },
    { classroom_id: roomId('37-606'),  subject_name: 'Seminar',                       teacher_name: 'Dr. Ravi Kumar',    day_of_week: 'Saturday',  start_time: '11:10', end_time: '12:00' },
  ];

  // Dynamic entries for TODAY — so dashboard always shows occupied rooms
  const activeStart = `${pad(currentHour)}:${pad(Math.max(0, currentMin - 25))}`;
  const activeEnd = `${pad(Math.min(23, currentHour + 1))}:${pad(currentMin)}`;
  const upcomingStart = `${pad(Math.min(23, currentHour + 2))}:00`;
  const upcomingEnd = `${pad(Math.min(23, currentHour + 3))}:00`;

  const dynamicEntries = [
    { classroom_id: roomId('36-502A'), subject_name: 'Data Structures Lab',   teacher_name: 'Dr. Ravi Kumar',    day_of_week: today, start_time: activeStart, end_time: activeEnd },
    { classroom_id: roomId('37-606'),  subject_name: 'ML Workshop',           teacher_name: 'Dr. Priya Singh',   day_of_week: today, start_time: activeStart, end_time: activeEnd },
    { classroom_id: roomId('25-403'),  subject_name: 'Physics Tutorial',      teacher_name: 'Prof. Sanjay Bose', day_of_week: today, start_time: activeStart, end_time: activeEnd },
    { classroom_id: roomId('34-104'),  subject_name: 'Math Problem Solving',  teacher_name: 'Dr. Kiran Joshi',   day_of_week: today, start_time: activeStart, end_time: activeEnd },
    // Upcoming
    { classroom_id: roomId('36-506'),  subject_name: 'Evening Lecture',       teacher_name: 'Prof. Meena Gupta', day_of_week: today, start_time: upcomingStart, end_time: upcomingEnd },
    { classroom_id: roomId('33-508'),  subject_name: 'Lab Session',           teacher_name: 'Dr. Suresh Patel',  day_of_week: today, start_time: upcomingStart, end_time: upcomingEnd },
  ];

  return [
    ...fixedEntries.map((e) => ({ id: genId(), ...e })),
    ...dynamicEntries.map((e) => ({ id: genId(), ...e })),
  ].filter((t) => t.classroom_id);
}

export const demoTimetable = generateDynamicTimetable();

// Reservations
const todayStr = new Date().toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const resStart = `${pad(now.getHours())}:${pad(Math.max(0, now.getMinutes() - 15))}`;
const resEnd = `${pad(Math.min(23, now.getHours() + 1))}:${pad(now.getMinutes())}`;

export const demoReservations = [
  {
    id: genId(),
    classroom_id: roomId('38-403'),
    teacher_name: 'Dr. Vikram Reddy',
    subject_name: 'Cyber Security Workshop',
    date: todayStr,
    start_time: resStart,
    end_time: resEnd,
    notes: 'Hands-on penetration testing lab',
    created_at: new Date().toISOString(),
    classrooms: { room_number: '38-403', building_number: 38 },
  },
  {
    id: genId(),
    classroom_id: roomId('36-507'),
    teacher_name: 'Prof. Amit Das',
    subject_name: 'Web Dev Extra Session',
    date: todayStr,
    start_time: resStart,
    end_time: resEnd,
    notes: 'React + Supabase project review',
    created_at: new Date().toISOString(),
    classrooms: { room_number: '36-507', building_number: 36 },
  },
  {
    id: genId(),
    classroom_id: roomId('27-507A'),
    teacher_name: 'Prof. Rajesh Verma',
    subject_name: 'Cloud Computing Remedial',
    date: tomorrowStr,
    start_time: '10:00',
    end_time: '12:00',
    notes: null,
    created_at: new Date().toISOString(),
    classrooms: { room_number: '27-507A', building_number: 27 },
  },
];

export function isDemoMode() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return !url || url === 'your-supabase-url-here';
}
