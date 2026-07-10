// useContent — fetches live content from backend.
// Falls back to staticDefault if API returns empty or fails.
// Stores result in localStorage as a cache so pages show
// admin-saved data immediately on next load without waiting for the API.

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const CACHE_PREFIX = 'bathease:content:';

function readCache(type) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + type);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function writeCache(type, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + type, JSON.stringify(data));
  } catch {}
}

export function useContent(type, staticDefault) {
  // Start with cached data if available, otherwise static default
  const [data, setData] = useState(() => readCache(type) || staticDefault);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await api.getContent(type);
        if (!cancelled) {
          if (result?.length) {
            writeCache(type, result);   // update cache
            setData(result);
          } else {
            // Nothing saved yet — use static default, clear stale cache
            localStorage.removeItem(CACHE_PREFIX + type);
            setData(staticDefault);
          }
        }
      } catch {
        // API unavailable — use cached or static
        if (!cancelled) setData(readCache(type) || staticDefault);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [type]);

  return { data, loading };
}
