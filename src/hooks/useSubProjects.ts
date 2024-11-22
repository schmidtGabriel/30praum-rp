import { useState, useCallback, useEffect } from 'react';
import { SubProject } from '../types';
import { subProjectsService } from '../services/api';

interface UseSubProjectsResult {
  subProjects: SubProject[];
  isLoading: boolean;
  error: Error | null;
  createSubProject: (subProject: Omit<SubProject, 'id'>) => Promise<void>;
  updateSubProject: (id: string, subProject: Partial<SubProject>) => Promise<void>;
  deleteSubProject: (id: string) => Promise<void>;
  refreshSubProjects: () => Promise<void>;
}

export function useSubProjects(): UseSubProjectsResult {
  const [subProjects, setSubProjects] = useState<SubProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshSubProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await subProjectsService.list();
      setSubProjects(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSubProject = useCallback(async (subProject: Omit<SubProject, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await subProjectsService.create(subProject);
      await refreshSubProjects();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshSubProjects]);

  const updateSubProject = useCallback(async (id: string, subProject: Partial<SubProject>) => {
    setIsLoading(true);
    setError(null);
    try {
      await subProjectsService.update(id, subProject);
      await refreshSubProjects();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshSubProjects]);

  const deleteSubProject = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await subProjectsService.delete(id);
      await refreshSubProjects();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshSubProjects]);

  useEffect(() => {
    refreshSubProjects();
  }, [refreshSubProjects]);

  return {
    subProjects,
    isLoading,
    error,
    createSubProject,
    updateSubProject,
    deleteSubProject,
    refreshSubProjects,
  };
}