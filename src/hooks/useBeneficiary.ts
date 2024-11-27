import { useState, useCallback, useEffect } from 'react';
import { Beneficiary } from '../types';
import { beneficiaryService } from '../services/api';

interface UseBeneficiaryResult {
  beneficiary: Beneficiary | null;
  beneficiaries: Beneficiary[];
  isLoading: boolean;
  error: Error | null;
  createBeneficiary: (data: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBeneficiary: (id: string, data: Partial<Beneficiary>) => Promise<void>;
  deleteBeneficiary: (id: string) => Promise<void>;
  fetchBeneficiary: (id: string) => Promise<void>;
  resetBeneficiary: () => void;
  refreshBeneficiaries: () => Promise<void>;
}

export function useBeneficiary(initialBeneficiaryId?: string): UseBeneficiaryResult {
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshBeneficiaries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await beneficiaryService.list();
      setBeneficiaries(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBeneficiary = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await beneficiaryService.getById(id);
      setBeneficiary(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      setBeneficiary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBeneficiary = useCallback(async (data: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const now = new Date().toISOString();
      const newBeneficiary = await beneficiaryService.create({
        ...data,
        createdAt: now,
        updatedAt: now,
      });
      await refreshBeneficiaries();
      setBeneficiary(newBeneficiary);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshBeneficiaries]);

  const updateBeneficiary = useCallback(async (id: string, data: Partial<Beneficiary>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedBeneficiary = await beneficiaryService.update(id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      await refreshBeneficiaries();
      setBeneficiary(updatedBeneficiary);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshBeneficiaries]);

  const deleteBeneficiary = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await beneficiaryService.delete(id);
      await refreshBeneficiaries();
      setBeneficiary(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshBeneficiaries]);

  const resetBeneficiary = useCallback(() => {
    setBeneficiary(null);
    setError(null);
  }, []);

  // Load initial beneficiary if ID is provided
  useEffect(() => {
    if (initialBeneficiaryId) {
      fetchBeneficiary(initialBeneficiaryId);
    }
  }, [initialBeneficiaryId, fetchBeneficiary]);

  // Load beneficiaries list on mount
  useEffect(() => {
    refreshBeneficiaries();
  }, [refreshBeneficiaries]);

  return {
    beneficiary,
    beneficiaries,
    isLoading,
    error,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    fetchBeneficiary,
    resetBeneficiary,
    refreshBeneficiaries,
  };
}