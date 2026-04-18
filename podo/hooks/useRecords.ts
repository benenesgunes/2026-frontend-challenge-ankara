'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AnyRecord, Person } from '@/store/types';
import { fetchAllRecords } from '@/lib/api';
import { linkRecordsToPeople } from '@/lib/recordLinker';

interface UseRecordsReturn {
  /** All fetched records */
  records: AnyRecord[];
  /** People computed from records */
  people: Person[];
  /** Whether data is currently being fetched */
  isLoading: boolean;
  /** Error message if the fetch failed */
  error: string | null;
  /** Re-fetch all data */
  refetch: () => void;
}

export function useRecords(): UseRecordsReturn {
  const [records, setRecords] = useState<AnyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAllRecords();
      setRecords(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      console.error('[useRecords]', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Compute people from records
  const people = useMemo(() => {
    if (records.length === 0) return [];
    return linkRecordsToPeople(records);
  }, [records]);

  return {
    records,
    people,
    isLoading,
    error,
    refetch: fetchData,
  };
}
