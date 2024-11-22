import { useState, useCallback, useEffect } from 'react';
import { SubProjectItem } from '../types';
import { subProjectItemsService } from '../services/api';

interface UseSubProjectItemsResult {
  subProjectItems: SubProjectItem[];
  isLoading: boolean;
  error: Error | null;
  createSubProjectItem: (item: Omit<SubProjectItem, 'id'>) => Promise<void>;
  updateSubProjectItem: (
    id: string,
    item: Partial<SubProjectItem>
  ) => Promise<void>;
  deleteSubProjectItem: (id: string) => Promise<void>;
  refreshSubProjectItems: () => Promise<void>;
}

export function useSubProjectItems(): UseSubProjectItemsResult {
  const [subProjectItems, setSubProjectItems] = useState<SubProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshSubProjectItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await subProjectItemsService.list();
      setSubProjectItems(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSubProjectItem = useCallback(
    async (item: Omit<SubProjectItem, 'id'>) => {
      setIsLoading(true);
      setError(null);
      try {
        await subProjectItemsService.create(item);
        await refreshSubProjectItems();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshSubProjectItems]
  );

  const updateSubProjectItem = useCallback(
    async (id: string, item: Partial<SubProjectItem>) => {
      setIsLoading(true);
      setError(null);
      try {
        await subProjectItemsService.update(id, item);
        await refreshSubProjectItems();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshSubProjectItems]
  );

  const deleteSubProjectItem = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await subProjectItemsService.delete(id);
        await refreshSubProjectItems();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshSubProjectItems]
  );

  useEffect(() => {
    refreshSubProjectItems();
  }, [refreshSubProjectItems]);

  return {
    subProjectItems,
    isLoading,
    error,
    createSubProjectItem,
    updateSubProjectItem,
    deleteSubProjectItem,
    refreshSubProjectItems,
  };
}