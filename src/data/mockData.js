// Mock data for DeskGuard prototype

export const FLOORS = ['Ground Floor', 'First Floor', 'Second Floor'];

export const SECTIONS = ['Reading Hall', 'Quiet Zone', 'Group Study', 'Computer Lab'];

const STUDENT_NAMES = [
  'Aarav Sharma', 'Priya Patel', 'Rohan Mehta', 'Ananya Iyer', 'Vikram Rao',
  'Sneha Gupta', 'Karan Malhotra', 'Ishita Singh', 'Aditya Kumar', 'Neha Reddy',
  'Arjun Nair', 'Diya Verma', 'Siddharth Joshi', 'Pooja Desai', 'Rahul Kapoor',
];

// Deterministic pseudo-random generator so the layout is stable across renders
function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const rand = seededRandom(42);

function buildDesks() {
  const desks = [];
  let counter = 1;

  FLOORS.forEach((floor) => {
    SECTIONS.forEach((section) => {
      const deskCount = 6;
      for (let i = 0; i < deskCount; i += 1) {
        const id = `D${String(counter).padStart(2, '0')}`;
        const roll = rand();
        let status = 'available';
        if (roll < 0.4) status = 'occupied';
        else if (roll < 0.55) status = 'away';

        const desk = {
          id,
          floor,
          section,
          status,
          hasPower: rand() > 0.3,
          hasMonitor: rand() > 0.7,
        };

        if (status === 'occupied' || status === 'away') {
          const studentIdx = Math.floor(rand() * STUDENT_NAMES.length);
          const hoursAgo = Math.floor(rand() * 3);
          const minsAgo = Math.floor(rand() * 60);
          const checkIn = new Date();
          checkIn.setHours(checkIn.getHours() - hoursAgo);
          checkIn.setMinutes(checkIn.getMinutes() - minsAgo);

          desk.occupant = {
            name: STUDENT_NAMES[studentIdx],
            studentId: `STU${1000 + counter}`,
            email: `${STUDENT_NAMES[studentIdx].split(' ')[0].toLowerCase()}@university.edu`,
          };
          desk.checkInTime = checkIn.toISOString();
        }

        if (status === 'away') {
          desk.awaySince = new Date(Date.now() - Math.floor(rand() * 18) * 60000).toISOString();
        }

        desks.push(desk);
        counter += 1;
      }
    });
  });

  return desks;
}

export const DESKS = buildDesks();

export function getDeskStats(desks = DESKS) {
  return {
    total: desks.length,
    available: desks.filter((d) => d.status === 'available').length,
    occupied: desks.filter((d) => d.status === 'occupied').length,
    away: desks.filter((d) => d.status === 'away').length,
  };
}

export const NOTIFICATIONS = [
  {
    id: 1,
    type: 'released',
    title: 'Seat D14 released',
    message: 'Desk D14 in Quiet Zone is now available — you were on the waitlist.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Session expiring soon',
    message: 'Your session at desk D08 will expire in 10 minutes. Tap to extend.',
    time: '8 min ago',
    unread: true,
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Still away?',
    message: 'You marked desk D22 as away 18 minutes ago. It may be auto-released soon.',
    time: '20 min ago',
    unread: true,
  },
  {
    id: 4,
    type: 'released',
    title: 'Seat D03 released',
    message: 'A desk in Reading Hall, Ground Floor was just released.',
    time: '1 hour ago',
    unread: false,
  },
  {
    id: 5,
    type: 'reminder',
    title: 'Booking confirmed',
    message: 'You successfully checked in to desk D11, First Floor — Computer Lab.',
    time: '3 hours ago',
    unread: false,
  },
];

export const ACTIVITY_LOG = [
  { id: 1, user: 'Aarav Sharma', action: 'Checked in', desk: 'D04', time: '09:12 AM' },
  { id: 2, user: 'Priya Patel', action: 'Marked away', desk: 'D11', time: '09:25 AM' },
  { id: 3, user: 'System', action: 'Auto-released', desk: 'D11', time: '09:55 AM' },
  { id: 4, user: 'Rohan Mehta', action: 'Checked in', desk: 'D18', time: '10:02 AM' },
  { id: 5, user: 'Admin (Ms. Rao)', action: 'Manually reset', desk: 'D07', time: '10:14 AM' },
  { id: 6, user: 'Ananya Iyer', action: 'Ended session', desk: 'D22', time: '10:30 AM' },
  { id: 7, user: 'Karan Malhotra', action: 'Checked in', desk: 'D29', time: '10:41 AM' },
  { id: 8, user: 'Ishita Singh', action: 'Marked away', desk: 'D33', time: '10:48 AM' },
];

export const USAGE_TREND = [
  { time: '8AM', occupied: 12, available: 60 },
  { time: '9AM', occupied: 28, available: 44 },
  { time: '10AM', occupied: 45, available: 27 },
  { time: '11AM', occupied: 52, available: 20 },
  { time: '12PM', occupied: 48, available: 24 },
  { time: '1PM', occupied: 39, available: 33 },
  { time: '2PM', occupied: 41, available: 31 },
  { time: '3PM', occupied: 50, available: 22 },
  { time: '4PM', occupied: 44, available: 28 },
  { time: '5PM', occupied: 30, available: 42 },
];

export const SECTION_USAGE = [
  { section: 'Reading Hall', usage: 78 },
  { section: 'Quiet Zone', usage: 64 },
  { section: 'Group Study', usage: 52 },
  { section: 'Computer Lab', usage: 85 },
];

export const CURRENT_USER = {
  name: 'Sneha Gupta',
  studentId: 'STU2031',
  email: 'sneha.gupta@university.edu',
  avatar: 'SG',
};
