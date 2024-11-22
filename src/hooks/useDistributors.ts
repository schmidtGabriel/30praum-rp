import { useState, useCallback, useEffect } from 'react';
import { Distributor } from '../types';
import { distributorsService } from '../services/api';

interface UseDistributorsResult {
  distributors: Distributor[];
  isLoading: boolean;
  error: Error | null;
  createDistributor: (distributor: Omit<Distributor, 'id'>) => Promise<void>;
  updateDistributor: (
    id: string,
    distributor: Partial<Distributor>
  ) => Promise<void>;
  deleteDistributor: (id: string) => Promise<void>;
  refreshDistributors: () => Promise<void>;
}

export function useDistributors(): UseDistributorsResult {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshDistributors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await distributorsService.list();
      setDistributors(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDistributor = useCallback(
    async (distributor: Omit<Distributor, 'id'>) => {
      setIsLoading(true);
      setError(null);
      try {
        await distributorsService.create(distributor);
        await refreshDistributors();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshDistributors]
  );

  const updateDistributor = useCallback(
    async (id: string, distributor: Partial<Distributor>) => {
      setIsLoading(true);
      setError(null);
      try {
        await distributorsService.update(id, distributor);
        await refreshDistributors();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshDistributors]
  );

  const deleteDistributor = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await distributorsService.delete(id);
        await refreshDistributors();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshDistributors]
  );

  useEffect(() => {
    refreshDistributors();
  }, [refreshDistributors]);

  return {
    distributors,
    isLoading,
    error,
    createDistributor,
    updateDistributor,
    deleteDistributor,
    refreshDistributors,
  };
}
