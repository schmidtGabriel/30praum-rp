import { useState, useCallback, useEffect } from 'react';
import { ConcertProjection } from '../types';
import { concertProjectionsService } from '../services/api';

interface UseConcertProjectionsResult {
  concertProjections: ConcertProjection[];
  isLoading: boolean;
  error: Error | null;
  createConcertProjection: (projection: Omit<ConcertProjection, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateConcertProjection: (id: string, projection: Partial<ConcertProjection>) => Promise<void>;
  deleteConcertProjection: (id: string) => Promise<void>;
  refreshConcertProjections: () => Promise<void>;
}

export function useConcertProjections(): UseConcertProjectionsResult {
  const [concertProjections, setConcertProjections] = useState<ConcertProjection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshConcertProjections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await concertProjectionsService.list();
      setConcertProjections(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createConcertProjection = useCallback(
    async (projection: Omit<ConcertProjection, 'id' | 'createdAt' | 'updatedAt'>) => {
      setIsLoading(true);
      setError(null);
      try {
        const now = new Date().toISOString();
        await concertProjectionsService.create({
          ...projection,
          createdAt: now,
          updatedAt: now,
        });
        await refreshConcertProjections();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshConcertProjections]
  );

  const updateConcertProjection = useCallback(
    async (id: string, projection: Partial<ConcertProjection>) => {
      setIsLoading(true);
      setError(null);
      try {
        await concertProjectionsService.update(id, {
          ...projection,
          updatedAt: new Date().toISOString(),
        });
        await refreshConcertProjections();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshConcertProjections]
  );

  const deleteConcertProjection = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await concertProjectionsService.delete(id);
        await refreshConcertProjections();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshConcertProjections]
  );

  useEffect(() => {
    refreshConcertProjections();
  }, [refreshConcertProjections]);

  return {
    concertProjections,
    isLoading,
    error,
    createConcertProjection,
    updateConcertProjection,
    deleteConcertProjection,
    refreshConcertProjections,
  };
}