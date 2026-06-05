-- =============================================================
-- ClassFinder — Supabase Schema
-- LPU Classroom Availability System
-- =============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Classrooms Table
CREATE TABLE classrooms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number text NOT NULL UNIQUE,
  building_number int NOT NULL,
  floor int NOT NULL DEFAULT 0,
  capacity int NOT NULL DEFAULT 30,
  has_ac boolean NOT NULL DEFAULT false,
  has_projector boolean NOT NULL DEFAULT false,
  has_whiteboard boolean NOT NULL DEFAULT false,
  has_wifi boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Reservations Table
CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id uuid NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  teacher_name text NOT NULL,
  subject_name text NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Timetable Table
CREATE TABLE timetable (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id uuid NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  subject_name text NOT NULL,
  teacher_name text NOT NULL,
  day_of_week text NOT NULL
    CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')),
  start_time time NOT NULL,
  end_time time NOT NULL
);

-- =============================================================
-- RLS Policies
-- =============================================================

ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read classrooms" ON classrooms FOR SELECT USING (true);
CREATE POLICY "Anyone can read reservations" ON reservations FOR SELECT USING (true);
CREATE POLICY "Anyone can read timetable" ON timetable FOR SELECT USING (true);

-- Teacher write access
CREATE POLICY "Teachers can insert classrooms" ON classrooms FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'teacher');
CREATE POLICY "Teachers can update classrooms" ON classrooms FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'teacher');
CREATE POLICY "Teachers can delete classrooms" ON classrooms FOR DELETE
  USING (auth.jwt() ->> 'role' = 'teacher');

CREATE POLICY "Teachers can insert reservations" ON reservations FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'teacher');
CREATE POLICY "Teachers can delete reservations" ON reservations FOR DELETE
  USING (auth.jwt() ->> 'role' = 'teacher');

-- =============================================================
-- Enable Realtime
-- =============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE classrooms;
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;

-- =============================================================
-- Indexes
-- =============================================================

CREATE INDEX idx_reservations_classroom ON reservations(classroom_id, date);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_timetable_classroom ON timetable(classroom_id, day_of_week);

-- =============================================================
-- Seed Data — LPU Classrooms
-- =============================================================

INSERT INTO classrooms (room_number, building_number, floor, capacity, has_ac, has_projector, has_whiteboard, has_wifi) VALUES
  ('36-502A', 36, 5, 60,  true,  true,  true,  true),
  ('36-506',  36, 5, 40,  false, true,  true,  false),
  ('36-507',  36, 5, 35,  false, false, true,  true),
  ('34-104',  34, 1, 30,  true,  false, true,  false),
  ('37-606',  37, 6, 45,  true,  true,  false, true),
  ('37-610',  37, 6, 45,  true,  true,  false, true),
  ('33-508',  33, 5, 50,  true,  true,  true,  true),
  ('27-507A', 27, 5, 60,  true,  true,  false, true),
  ('25-403',  25, 4, 80,  true,  true,  true,  true),
  ('6-405',    6, 4, 35,  false, false, true,  false),
  ('38-403',  38, 4, 40,  true,  false, false, true),
  ('38-509',  38, 5, 30,  false, false, true,  true);

-- Mark one room under maintenance
UPDATE classrooms SET status = 'maintenance' WHERE room_number = '38-509';

-- =============================================================
-- Seed Data — Timetable (LPU slot timings)
-- =============================================================

INSERT INTO timetable (classroom_id, subject_name, teacher_name, day_of_week, start_time, end_time) VALUES
  -- Monday
  ((SELECT id FROM classrooms WHERE room_number='36-502A'), 'Data Structures & Algorithms', 'Dr. Ravi Kumar',    'Monday', '10:00', '10:50'),
  ((SELECT id FROM classrooms WHERE room_number='36-502A'), 'Computer Networks',            'Prof. Anita Sharma', 'Monday', '11:10', '12:00'),
  ((SELECT id FROM classrooms WHERE room_number='36-506'),  'Operating Systems',             'Dr. Suresh Patel',  'Monday', '10:20', '11:10'),
  ((SELECT id FROM classrooms WHERE room_number='36-506'),  'Database Management',           'Prof. Meena Gupta', 'Monday', '14:30', '15:20'),
  ((SELECT id FROM classrooms WHERE room_number='34-104'),  'Engineering Mathematics',       'Dr. Kiran Joshi',   'Monday', '12:00', '12:50'),
  ((SELECT id FROM classrooms WHERE room_number='25-403'),  'Physics',                       'Prof. Sanjay Bose', 'Monday', '10:00', '10:50'),
  ((SELECT id FROM classrooms WHERE room_number='25-403'),  'Chemistry Lab',                 'Dr. Neha Agarwal',  'Monday', '14:30', '16:10'),
  -- Tuesday
  ((SELECT id FROM classrooms WHERE room_number='37-606'),  'Machine Learning',              'Dr. Priya Singh',   'Tuesday', '10:00', '10:50'),
  ((SELECT id FROM classrooms WHERE room_number='37-606'),  'Deep Learning Lab',             'Dr. Priya Singh',   'Tuesday', '11:10', '12:50'),
  ((SELECT id FROM classrooms WHERE room_number='33-508'),  'Software Engineering',          'Prof. Rajesh Verma','Tuesday', '10:20', '11:10'),
  ((SELECT id FROM classrooms WHERE room_number='27-507A'), 'Cloud Computing',               'Dr. Vikram Reddy',  'Tuesday', '14:30', '15:20'),
  ((SELECT id FROM classrooms WHERE room_number='36-507'),  'Web Development',               'Prof. Amit Das',    'Tuesday', '12:00', '12:50'),
  ((SELECT id FROM classrooms WHERE room_number='6-405'),   'English Communication',         'Prof. Pooja Nair',  'Tuesday', '10:00', '10:50'),
  -- Wednesday
  ((SELECT id FROM classrooms WHERE room_number='25-403'),  'Physics Tutorial',              'Prof. Sanjay Bose', 'Wednesday', '10:00', '10:50'),
  ((SELECT id FROM classrooms WHERE room_number='36-507'),  'Web Development Lab',           'Prof. Amit Das',    'Wednesday', '11:10', '12:50'),
  ((SELECT id FROM classrooms WHERE room_number='37-610'),  'Artificial Intelligence',       'Dr. Ravi Kumar',    'Wednesday', '15:20', '16:10'),
  ((SELECT id FROM classrooms WHERE room_number='33-508'),  'Computer Architecture',         'Dr. Suresh Patel',  'Wednesday', '12:00', '12:50'),
  ((SELECT id FROM classrooms WHERE room_number='38-403'),  'Cyber Security',                'Dr. Vikram Reddy',  'Wednesday', '14:30', '15:20'),
  -- Thursday
  ((SELECT id FROM classrooms WHERE room_number='36-502A'), 'Compiler Design',               'Prof. Anita Sharma','Thursday', '10:20', '11:10'),
  ((SELECT id FROM classrooms WHERE room_number='33-508'),  'Computer Architecture',         'Dr. Suresh Patel',  'Thursday', '12:00', '12:50'),
  ((SELECT id FROM classrooms WHERE room_number='6-405'),   'English Communication',         'Prof. Pooja Nair',  'Thursday', '10:00', '10:50'),
  ((SELECT id FROM classrooms WHERE room_number='38-403'),  'Cyber Security Lab',            'Dr. Vikram Reddy',  'Thursday', '14:30', '16:10'),
  ((SELECT id FROM classrooms WHERE room_number='27-507A'), 'IoT Systems',                   'Prof. Rajesh Verma','Thursday', '11:10', '12:00'),
  -- Friday
  ((SELECT id FROM classrooms WHERE room_number='34-104'),  'Discrete Mathematics',          'Dr. Kiran Joshi',   'Friday', '10:00', '10:50'),
  ((SELECT id FROM classrooms WHERE room_number='27-507A'), 'IoT Lab',                       'Prof. Rajesh Verma','Friday', '11:10', '12:50'),
  ((SELECT id FROM classrooms WHERE room_number='36-502A'), 'Data Science',                  'Dr. Priya Singh',   'Friday', '12:50', '13:40'),
  ((SELECT id FROM classrooms WHERE room_number='37-606'),  'ML Project Review',             'Dr. Priya Singh',   'Friday', '14:30', '15:20'),
  ((SELECT id FROM classrooms WHERE room_number='36-506'),  'DBMS Lab',                      'Prof. Meena Gupta', 'Friday', '10:20', '12:00'),
  -- Saturday
  ((SELECT id FROM classrooms WHERE room_number='25-403'),  'Environmental Science',         'Prof. Sanjay Bose', 'Saturday', '10:00', '10:50'),
  ((SELECT id FROM classrooms WHERE room_number='37-606'),  'Seminar',                       'Dr. Ravi Kumar',    'Saturday', '11:10', '12:00'),
  ((SELECT id FROM classrooms WHERE room_number='33-508'),  'Mini Project Review',           'Prof. Rajesh Verma','Saturday', '12:00', '12:50'),
  ((SELECT id FROM classrooms WHERE room_number='36-502A'), 'Extra Tutorial',                'Dr. Kiran Joshi',   'Saturday', '10:00', '10:50');
