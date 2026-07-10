// useAdminNotifications — polls backend every 30s and tracks unseen counts
// Seen state stored in localStorage so it persists across page refreshes.
// When admin clicks a sidebar section, that section's notifications clear.

import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from '@/lib/api';

const STORAGE_KEY = 'bathease:admin:seen';
const POLL_MS     = 30_000; // 30 seconds

function getSeenTimes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveSeenTimes(times) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(times));
}

// Count items created AFTER the last-seen timestamp for that category
function countUnseen(items, lastSeenISO, dateField = 'createdAt') {
  if (!items?.length) return 0;
  const since = lastSeenISO ? new Date(lastSeenISO).getTime() : 0;
  return items.filter((item) => {
    const t = new Date(item[dateField] || item.createdAt).getTime();
    return t > since;
  }).length;
}

export function useAdminNotifications() {
  const [counts, setCounts] = useState({ bookings: 0, users: 0, chat: 0 });
  const timerRef = useRef(null);

  const computeCounts = useCallback(async () => {
    try {
      const seen = getSeenTimes();
      const [bookings, users] = await Promise.all([
        api.allBookings(),
        api.allUsers(),
      ]);
      setCounts({
        bookings: countUnseen(bookings, seen.bookings),
        users:    countUnseen(users,    seen.users),
        chat:     0, // chat is local/mock — no backend yet
      });
    } catch {
      // silently ignore — don't break the admin page
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    computeCounts();
    timerRef.current = setInterval(computeCounts, POLL_MS);
    return () => clearInterval(timerRef.current);
  }, [computeCounts]);

  // Call this when admin clicks a sidebar tab — marks that section as "seen now"
  const markSeen = useCallback((section) => {
    const seen = getSeenTimes();
    seen[section] = new Date().toISOString();
    saveSeenTimes(seen);
    setCounts((prev) => ({ ...prev, [section]: 0 }));
  }, []);

  const total = counts.bookings + counts.users + counts.chat;

  return { counts, total, markSeen };
}
