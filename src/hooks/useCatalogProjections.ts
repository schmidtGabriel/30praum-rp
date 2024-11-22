import { useState, useCallback, useEffect } from 'react';
import { CatalogProjection } from '../types';
import { catalogProjectionsService } from '../services/api';

interface UseCatalogProjectionsResult {
  catalogProjections: CatalogProjection[];
  isLoading: boolean;
  error: Error | null;
  createCatalogProjection: (
    projection: Omit<CatalogProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateCatalogProjection: (
    id: string,
    projection: Partial<CatalogProjection>
  ) => Promise<void>;
  deleteCatalogProjection: (id: string) => Promise<void>;
  refreshCatalogProjections: () => Promise<void>;
}

export function useCatalogProjections(): UseCatalogProjectionsResult {
  const [catalogProjections, setCatalogProjections] = useState<
    CatalogProjection[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshCatalogProjections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await catalogProjectionsService.list();
      setCatalogProjections(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCatalogProjection = useCallback(
    async (
      projection: Omit<CatalogProjection, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const now = new Date().toISOString();
        await catalogProjectionsService.create({
          ...projection,
          createdAt: now,
          updatedAt: now,
        });
        await refreshCatalogProjections();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshCatalogProjections]
  );

  const updateCatalogProjection = useCallback(
    async (id: string, projection: Partial<CatalogProjection>) => {
      setIsLoading(true);
      setError(null);
      try {
        await catalogProjectionsService.update(id, {
          ...projection,
          updatedAt: new Date().toISOString(),
        });
        await refreshCatalogProjections();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshCatalogProjections]
  );

  const deleteCatalogProjection = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await catalogProjectionsService.delete(id);
        await refreshCatalogProjections();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshCatalogProjections]
  );

  useEffect(() => {
    refreshCatalogProjections();
  }, [refreshCatalogProjections]);

  return {
    catalogProjections,
    isLoading,
    error,
    createCatalogProjection,
    updateCatalogProjection,
    deleteCatalogProjection,
    refreshCatalogProjections,
  };
}