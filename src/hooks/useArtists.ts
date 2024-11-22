import { useState, useCallback, useEffect } from 'react';
import { Artist } from '../types';
import { artistsService } from '../services/api';

interface UseArtistsResult {
  artists: Artist[];
  isLoading: boolean;
  error: Error | null;
  createArtist: (artist: Omit<Artist, 'id'>) => Promise<void>;
  updateArtist: (id: string, artist: Partial<Artist>) => Promise<void>;
  deleteArtist: (id: string) => Promise<void>;
  refreshArtists: () => Promise<void>;
}

export function useArtists(): UseArtistsResult {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshArtists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await artistsService.list();
      setArtists(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createArtist = useCallback(async (artist: Omit<Artist, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await artistsService.create(artist);
      await refreshArtists();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshArtists]);

  const updateArtist = useCallback(async (id: string, artist: Partial<Artist>) => {
    setIsLoading(true);
    setError(null);
    try {
      await artistsService.update(id, artist);
      await refreshArtists();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshArtists]);

  const deleteArtist = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await artistsService.delete(id);
      await refreshArtists();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshArtists]);

  useEffect(() => {
    refreshArtists();
  }, [refreshArtists]);

  return {
    artists,
    isLoading,
    error,
    createArtist,
    updateArtist,
    deleteArtist,
    refreshArtists,
  };
}