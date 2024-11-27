import { BaseService } from './base';
import { STORAGE_KEYS } from './storage-keys';
import { PaymentRequest, PaymentRequestStatus } from '../types';

class PaymentRequestService extends BaseService<PaymentRequest> {
  constructor() {
    super(STORAGE_KEYS.PAYMENT_REQUESTS);
  }

  async create(request: Omit<PaymentRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<PaymentRequest> {
    const now = new Date().toISOString();
    return super.create({
      ...request,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });
  }

  async update(id: string, request: Partial<PaymentRequest>): Promise<PaymentRequest> {
    return super.update(id, {
      ...request,
      updatedAt: new Date().toISOString(),
    });
  }

  async updateStatus(id: string, status: PaymentRequestStatus, justification?: string): Promise<PaymentRequest> {
    const request = await this.getById(id);
    if (!request) {
      throw new Error('Payment request not found');
    }

    // Validate status transitions
    if (!this.isValidStatusTransition(request.status, status)) {
      throw new Error(`Invalid status transition from ${request.status} to ${status}`);
    }

    // Require justification for rejection
    if (status === 'rejected' && !justification) {
      throw new Error('Justification is required when rejecting a payment request');
    }

    return this.update(id, {
      status,
      justification: status === 'rejected' ? justification : undefined,
      updatedAt: new Date().toISOString(),
    });
  }

  private isValidStatusTransition(currentStatus: PaymentRequestStatus, newStatus: PaymentRequestStatus): boolean {
    const transitions: Record<PaymentRequestStatus, PaymentRequestStatus[]> = {
      pending: ['approved', 'rejected'],
      approved: ['paid', 'rejected'],
      rejected: ['pending'],
      paid: [], // Terminal state
    };

    return transitions[currentStatus]?.includes(newStatus) ?? false;
  }

  async list(): Promise<PaymentRequest[]> {
    const requests = await super.list();
    return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getByStatus(status: PaymentRequestStatus): Promise<PaymentRequest[]> {
    const requests = await this.list();
    return requests.filter(request => request.status === status);
  }

  async getPendingRequests(): Promise<PaymentRequest[]> {
    return this.getByStatus('pending');
  }

  async getApprovedRequests(): Promise<PaymentRequest[]> {
    return this.getByStatus('approved');
  }

  async getRejectedRequests(): Promise<PaymentRequest[]> {
    return this.getByStatus('rejected');
  }

  async getPaidRequests(): Promise<PaymentRequest[]> {
    return this.getByStatus('paid');
  }
}

export const paymentRequestService = new PaymentRequestService();