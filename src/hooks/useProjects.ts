import { useState, useCallback, useEffect } from 'react';
import { Project } from '../types';
import { projectsService } from '../services/api';

interface UseProjectsResult {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  createProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectsService.list();
      setProjects(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (project: Omit<Project, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await projectsService.create(project);
      await refreshProjects();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshProjects]);

  const updateProject = useCallback(async (id: string, project: Partial<Project>) => {
    setIsLoading(true);
    setError(null);
    try {
      await projectsService.update(id, project);
      await refreshProjects();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshProjects]);

  const deleteProject = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await projectsService.delete(id);
      await refreshProjects();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshProjects]);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
  };
}