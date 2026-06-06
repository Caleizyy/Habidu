// "2026-05-17" → "2026-05"
export function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

// Convert a Date object to YYYY-MM-DD string format
function dateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format date range "2026-05-11" to "May 11"
export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format a date range like "May 11 - May 17"
export function formatDateRange(startDate: string, endDate: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${start} - ${end}`;
}

// Normalize dates from ISO format to YYYY-MM-DD
export function normalizeDateString(dateStr: string): string {
  if (!dateStr) return '';
  // Handle ISO format: "2026-05-11T00:00:00.000Z" → "2026-05-11"
  if (dateStr.includes('T')) {
    return dateStr.split('T')[0];
  }
  // Already in YYYY-MM-DD format
  return dateStr;
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return dateToString(new Date());
}

// Get the Monday of the week containing the given date
export function getMondayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(d.setDate(diff));
  return dateToString(monday);
}

// Get the Sunday of the week containing the given date
export function getSundayOfWeek(dateStr: string): string {
  const monday = getMondayOfWeek(dateStr);
  const d = new Date(monday + 'T00:00:00');
  d.setDate(d.getDate() + 6);
  return dateToString(d);
}

// Get an array of dates for the full week (Mon-Sun) containing today
export function getFullWeek(today?: string): string[] {
  const todayDate = today || getTodayDate();
  const monday = getMondayOfWeek(todayDate);
  const dates: string[] = [];
  const d = new Date(monday + 'T00:00:00');

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(d);
    currentDate.setDate(currentDate.getDate() + i);
    dates.push(dateToString(currentDate));
  }

  return dates;
}

// Get an array of dates for the last N days ending today (oldest first)
export function getLast7Days(today?: string): string[] {
  const todayDate = today || getTodayDate();
  const dates: string[] = [];
  const d = new Date(todayDate + 'T00:00:00');

  for (let i = 6; i >= 0; i--) {
    const currentDate = new Date(d);
    currentDate.setDate(currentDate.getDate() - i);
    dates.push(dateToString(currentDate));
  }

  return dates;
}

// Get the last 4 complete weeks (Mon-Sun) before and including today, each as {weekKey, label, sublabel?, dates}
export function getLast4Weeks(today?: string) {
  const todayDate = today || getTodayDate();
  const weeks: Array<{ weekKey: string; label: string; sublabel?: string; dates: string[] }> = [];

  // Get the Monday of this week
  const mondayOfThisWeek = getMondayOfWeek(todayDate);

  // Start from this week and go back 3 weeks
  for (let i = 0; i < 4; i++) {
    const currentMonday = new Date(mondayOfThisWeek + 'T00:00:00');
    currentMonday.setDate(currentMonday.getDate() - i * 7);

    const monday = dateToString(currentMonday);

    const sunday = getSundayOfWeek(monday);

    // Generate dates for this week
    const dates: string[] = [];
    const d = new Date(monday + 'T00:00:00');
    for (let j = 0; j < 7; j++) {
      const dateObj = new Date(d);
      dateObj.setDate(dateObj.getDate() + j);
      dates.push(dateToString(dateObj));
    }

    const weekKey = monday;
    const label = formatDateRange(monday, sunday);
    const sublabel = i === 0 ? 'This week' : undefined;

    weeks.push({ weekKey, label, sublabel, dates });
  }

  return weeks;
}

// Get the last 5 months before and including today, each as {monthKey, label, sublabel?}
export function getLast5Months(today?: string) {
  const todayDate = today || getTodayDate();
  const [year, month] = todayDate.split('-').map(Number);
  const months: Array<{ monthKey: string; label: string; sublabel?: string }> = [];

  for (let i = 0; i < 5; i++) {
    let currentMonth = month - i;
    let currentYear = year;

    if (currentMonth <= 0) {
      currentMonth += 12;
      currentYear -= 1;
    }

    const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const monthDate = new Date(`${monthKey}-01T00:00:00`);
    const label = monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const sublabel = i === 0 ? 'This month' : undefined;

    months.push({ monthKey, label, sublabel });
  }

  return months;
}

// Get labels for the last 7 days, with today labeled as "Today"
export function getDailyRowLabels(today?: string) {
  const todayDate = today || getTodayDate();
  const dates = getLast7Days(todayDate);

  return dates.map((date, index) => ({
    date,
    label: formatDate(date),
    sublabel: index === dates.length - 1 ? 'Today' : undefined,
  }));
}
