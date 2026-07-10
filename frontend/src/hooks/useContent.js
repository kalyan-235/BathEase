// useContent — fetches live content from backend.
// Falls back to staticDefault if API returns empty or fails.
// This means the website always works even before admin saves anything.

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function useContent(type, staticDefault) {
  const [data,    setData]    = useState(staticDefault);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await api.getContent(type);
        if (!cancelled) {
          setData(result?.length ? result : staticDefault);
        }
      } catch {
        // API unavailable — silently use static defaults
        if (!cancelled) setData(staticDefault);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [type]);

  return { data, loading };
}
