import { BaseService } from './base';
import { STORAGE_KEYS } from './storage-keys';
import {
  Artist,
  Catalog,
  User,
  Track,
  Project,
  Distributor,
  SubProject,
  SubProjectItem,
  CatalogProjection,
  ProjectProjection,
  ConcertProjection,
  Beneficiary,
  PaymentRequest,
  PaymentRequestStatus,
} from '../types';

// Initialize mock data
const initializeMockData = () => {
  // Mock Users
  const users: User[] = [
    {
      id: '1',
      name: 'Admin 30praum',
      email: 'admin@30praum.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'John Manager',
      email: 'john@30praum.com',
      password: 'john123',
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString(),
    },
  ];

  // Mock Artists
  const artists: Artist[] = [
    {
      id: '1',
      name: 'John Doe',
      bio: 'Electronic music producer from São Paulo',
    },
    {
      id: '2',
      name: 'Maria Silva',
      bio: 'Singer-songwriter with a unique voice',
    },
    {
      id: '3',
      name: 'The Groove Band',
      bio: 'Alternative rock band from Rio de Janeiro',
    },
  ];

  // Initialize storage if empty
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ARTISTS)) {
    localStorage.setItem(STORAGE_KEYS.ARTISTS, JSON.stringify(artists));
  }
  // ... other mock data initialization
};

// Initialize mock data
initializeMockData();

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
}

// Export all services
export const usersService = new BaseService<User>(STORAGE_KEYS.USERS);
export const artistsService = new BaseService<Artist>(STORAGE_KEYS.ARTISTS);
export const catalogsService = new BaseService<Catalog>(STORAGE_KEYS.CATALOGS);
export const tracksService = new BaseService<Track>(STORAGE_KEYS.TRACKS);
export const projectsService = new BaseService<Project>(STORAGE_KEYS.PROJECTS);
export const distributorsService = new BaseService<Distributor>(STORAGE_KEYS.DISTRIBUTORS);
export const subProjectsService = new BaseService<SubProject>(STORAGE_KEYS.SUBPROJECTS);
export const subProjectItemsService = new BaseService<SubProjectItem>(STORAGE_KEYS.SUBPROJECT_ITEMS);
export const catalogProjectionsService = new BaseService<CatalogProjection>(STORAGE_KEYS.CATALOG_PROJECTIONS);
export const projectProjectionsService = new BaseService<ProjectProjection>(STORAGE_KEYS.PROJECT_PROJECTIONS);
export const concertProjectionsService = new BaseService<ConcertProjection>(STORAGE_KEYS.CONCERT_PROJECTIONS);
export const beneficiaryService = new BaseService<Beneficiary>(STORAGE_KEYS.BENEFICIARIES);
export const paymentRequestService = new PaymentRequestService();