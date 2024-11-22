import { useState, useCallback, useEffect } from 'react';
import { ProjectProjection } from '../types';
import { projectProjectionsService } from '../services/api';

interface UseProjectProjectionsResult {
  projectProjections: ProjectProjection[];
  isLoading: boolean;
  error: Error | null;
  createProjectProjection: (
    projection: Omit<ProjectProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateProjectProjection: (
    id: string,
    projection: Partial<ProjectProjection>
  ) => Promise<void>;
  deleteProjectProjection: (id: string) => Promise<void>;
  refreshProjectProjections: () => Promise<void>;
}

export function useProjectProjections(): UseProjectProjectionsResult {
  const [projectProjections, setProjectProjections] = useState<ProjectProjection[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshProjectProjections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectProjectionsService.list();
      setProjectProjections(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProjectProjection = useCallback(
    async (
      projection: Omit<ProjectProjection, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const now = new Date().toISOString();
        await projectProjectionsService.create({
          ...projection,
          createdAt: now,
          updatedAt: now,
        });
        await refreshProjectProjections();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshProjectProjections]
  );

  const updateProjectProjection = useCallback(
    async (id: string, projection: Partial<ProjectProjection>) => {
      setIsLoading(true);
      setError(null);
      try {
        await projectProjectionsService.update(id, {
          ...projection,
          updatedAt: new Date().toISOString(),
        });
        await refreshProjectProjections();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshProjectProjections]
  );

  const deleteProjectProjection = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await projectProjectionsService.delete(id);
        await refreshProjectProjections();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshProjectProjections]
  );

  useEffect(() => {
    refreshProjectProjections();
  }, [refreshProjectProjections]);

  return {
    projectProjections,
    isLoading,
    error,
    createProjectProjection,
    updateProjectProjection,
    deleteProjectProjection,
    refreshProjectProjections,
  };
}