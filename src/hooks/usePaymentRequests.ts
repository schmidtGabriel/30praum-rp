import { useState, useCallback, useEffect } from 'react';
import { PaymentRequest, PaymentRequestStatus } from '../types';
import { paymentRequestService } from '../services/api';

interface UsePaymentRequestsResult {
  paymentRequests: PaymentRequest[];
  isLoading: boolean;
  error: Error | null;
  createPaymentRequest: (
    request: Omit<PaymentRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => Promise<void>;
  updatePaymentRequest: (
    id: string,
    request: Partial<PaymentRequest>
  ) => Promise<void>;
  updateStatus: (
    id: string,
    status: PaymentRequestStatus,
    justification?: string
  ) => Promise<void>;
  deletePaymentRequest: (id: string) => Promise<void>;
  refreshPaymentRequests: () => Promise<void>;
}

export function usePaymentRequests(): UsePaymentRequestsResult {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshPaymentRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await paymentRequestService.list();
      setPaymentRequests(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPaymentRequest = useCallback(
    async (
      request: Omit<PaymentRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        await paymentRequestService.create(request);
        await refreshPaymentRequests();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshPaymentRequests]
  );

  const updatePaymentRequest = useCallback(
    async (id: string, request: PaymentRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        await paymentRequestService.update(id, request);
        await refreshPaymentRequests();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshPaymentRequests]
  );

  const updateStatus = useCallback(
    async (
      id: string,
      status: PaymentRequestStatus,
      justification?: string
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        await paymentRequestService.updateStatus(id, status, justification);
        await refreshPaymentRequests();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshPaymentRequests]
  );

  const deletePaymentRequest = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await paymentRequestService.delete(id);
        await refreshPaymentRequests();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshPaymentRequests]
  );

  useEffect(() => {
    refreshPaymentRequests();
  }, [refreshPaymentRequests]);

  return {
    paymentRequests,
    isLoading,
    error,
    createPaymentRequest,
    updatePaymentRequest,
    updateStatus,
    deletePaymentRequest,
    refreshPaymentRequests,
  };
}
