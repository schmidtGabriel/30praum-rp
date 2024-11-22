import { useState, useCallback, useEffect } from 'react';
import { Catalog } from '../types';
import { catalogsService } from '../services/api';

interface UseCatalogsResult {
  catalogs: Catalog[];
  isLoading: boolean;
  error: Error | null;
  createCatalog: (catalog: Omit<Catalog, 'id'>) => Promise<void>;
  updateCatalog: (id: string, catalog: Partial<Catalog>) => Promise<void>;
  deleteCatalog: (id: string) => Promise<void>;
  refreshCatalogs: () => Promise<void>;
}

export function useCatalogs(): UseCatalogsResult {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshCatalogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await catalogsService.list();
      setCatalogs(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCatalog = useCallback(async (catalog: Omit<Catalog, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await catalogsService.create(catalog);
      await refreshCatalogs();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCatalogs]);

  const updateCatalog = useCallback(async (id: string, catalog: Partial<Catalog>) => {
    setIsLoading(true);
    setError(null);
    try {
      await catalogsService.update(id, catalog);
      await refreshCatalogs();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCatalogs]);

  const deleteCatalog = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await catalogsService.delete(id);
      await refreshCatalogs();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshCatalogs]);

  useEffect(() => {
    refreshCatalogs();
  }, [refreshCatalogs]);

  return {
    catalogs,
    isLoading,
    error,
    createCatalog,
    updateCatalog,
    deleteCatalog,
    refreshCatalogs,
  };
}