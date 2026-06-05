import { format, isWithinInterval, differenceInSeconds } from 'date-fns';

/**
 * Get the full day name for a Date object (Monday, Tuesday, etc.)
 */
export function getDayName(date = new Date()) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/**
 * Parse a "HH:mm:ss" or "HH:mm" time string into a Date for today
 */
export function parseTimeToday(timeStr) {
  const [h, m, s = 0] = timeStr.split(':').map(Number);
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s);
}

/**
 * Check if the current time falls within a start–end range
 */
export function isCurrentlyActive(startTime, endTime) {
  const now = new Date();
  const start = parseTimeToday(startTime);
  const end = parseTimeToday(endTime);
  return isWithinInterval(now, { start, end });
}

/**
 * Compute dynamic status for a classroom based on timetable & reservations
 */
export function computeClassroomStatus(classroom, timetableEntries, reservations) {
  if (classroom.status === 'maintenance') {
    return { status: 'maintenance', occupant: null, timeRemaining: null, nextEvent: null };
  }

  const now = new Date();
  const today = getDayName(now);
  const todayDate = format(now, 'yyyy-MM-dd');

  // Check timetable for current occupancy
  const todayTimetable = timetableEntries.filter((t) => t.day_of_week === today);
  for (const entry of todayTimetable) {
    if (isCurrentlyActive(entry.start_time, entry.end_time)) {
      const end = parseTimeToday(entry.end_time);
      const remaining = differenceInSeconds(end, now);
      return {
        status: 'occupied',
        occupant: { subject: entry.subject_name, teacher: entry.teacher_name },
        timeRemaining: remaining > 0 ? remaining : 0,
        nextEvent: null,
      };
    }
  }

  // Check reservations for today
  const todayReservations = reservations.filter((r) => r.date === todayDate);
  for (const res of todayReservations) {
    if (isCurrentlyActive(res.start_time, res.end_time)) {
      const end = parseTimeToday(res.end_time);
      const remaining = differenceInSeconds(end, now);
      return {
        status: 'reserved',
        occupant: { subject: res.subject_name, teacher: res.teacher_name },
        timeRemaining: remaining > 0 ? remaining : 0,
        nextEvent: null,
      };
    }
  }

  // Find next upcoming event today
  const allTodayEvents = [
    ...todayTimetable.map((t) => ({
      start: t.start_time, end: t.end_time,
      subject: t.subject_name, teacher: t.teacher_name, type: 'timetable',
    })),
    ...todayReservations.map((r) => ({
      start: r.start_time, end: r.end_time,
      subject: r.subject_name, teacher: r.teacher_name, type: 'reservation',
    })),
  ];

  const upcoming = allTodayEvents
    .filter((e) => parseTimeToday(e.start) > now)
    .sort((a, b) => parseTimeToday(a.start) - parseTimeToday(b.start));

  const nextEvent = upcoming.length > 0 ? upcoming[0] : null;

  return {
    status: 'available',
    occupant: null,
    timeRemaining: null,
    nextEvent: nextEvent
      ? { ...nextEvent, startsIn: differenceInSeconds(parseTimeToday(nextEvent.start), now) }
      : null,
  };
}

/**
 * Format seconds into "Xh Ym" or "Ym Zs" string
 */
export function formatCountdown(totalSeconds) {
  if (totalSeconds <= 0) return '0s';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

/**
 * Format a time string "HH:mm" → "10:20 AM"
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

/**
 * Generate hour slots for a day (8 AM to 6 PM) — LPU timings
 */
export function generateHourSlots() {
  const slots = [];
  for (let h = 8; h <= 17; h++) {
    slots.push({
      hour: h,
      label: formatTime(`${h}:00`),
      start: `${String(h).padStart(2, '0')}:00`,
      end: `${String(h + 1).padStart(2, '0')}:00`,
    });
  }
  return slots;
}

/**
 * Simple UUID v4-like fallback
 */
export function v4Fallback() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Extract building number from room string like "36-502A" → 36
 */
export function getBuildingNumber(roomNumber) {
  const match = roomNumber.match(/^(\d+)-/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Extract floor from room string like "36-502A" → 5
 */
export function getFloor(roomNumber) {
  const match = roomNumber.match(/^\d+-(\d)/);
  return match ? parseInt(match[1]) : 0;
}
