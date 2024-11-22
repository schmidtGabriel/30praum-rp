import { useState, useCallback, useEffect } from 'react';
import { Track } from '../types';
import { tracksService } from '../services/api';

interface UseTracksResult {
  tracks: Track[];
  isLoading: boolean;
  error: Error | null;
  createTrack: (track: Omit<Track, 'id'>) => Promise<void>;
  updateTrack: (id: string, track: Partial<Track>) => Promise<void>;
  deleteTrack: (id: string) => Promise<void>;
  refreshTracks: () => Promise<void>;
}

export function useTracks(): UseTracksResult {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshTracks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tracksService.list();
      setTracks(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTrack = useCallback(
    async (track: Omit<Track, 'id'>) => {
      setIsLoading(true);
      setError(null);
      try {
        await tracksService.create(track);
        await refreshTracks();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshTracks]
  );

  const updateTrack = useCallback(
    async (id: string, track: Partial<Track>) => {
      setIsLoading(true);
      setError(null);
      try {
        await tracksService.update(id, track);
        await refreshTracks();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshTracks]
  );

  const deleteTrack = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await tracksService.delete(id);
        await refreshTracks();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshTracks]
  );

  useEffect(() => {
    refreshTracks();
  }, [refreshTracks]);

  return {
    tracks,
    isLoading,
    error,
    createTrack,
    updateTrack,
    deleteTrack,
    refreshTracks,
  };
}
