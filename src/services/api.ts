import {
  Artist,
  Catalog,
  User,
  Track,
  Project,
  Distributor,
  SubProject,
} from '../types';

const STORAGE_KEYS = {
  ARTISTS: 'artists',
  CATALOGS: 'catalogs',
  USERS: 'users',
  TRACKS: 'tracks',
  PROJECTS: 'projects',
  DISTRIBUTORS: 'distributors',
  SUBPROJECTS: 'subprojects',
};

// Initialize default admin user if none exists
const initializeDefaultUser = () => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users || JSON.parse(users).length === 0) {
    const defaultUser: User = {
      id: '1',
      name: 'Admin 30praum',
      email: 'admin@30praum.com',
      password: 'admin123', // In a real app, this should be hashed
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([defaultUser]));
  }
};

initializeDefaultUser();

// Generic CRUD service
class BaseService<T extends { id: string }> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  private getAll(): T[] {
    const items = localStorage.getItem(this.storageKey);
    return items ? JSON.parse(items) : [];
  }

  private save(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  async list(): Promise<T[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.getAll();
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newItem = { ...item, id: Date.now().toString() } as T;
    const items = this.getAll();
    items.push(newItem);
    this.save(items);
    return newItem;
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const items = this.getAll();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Item not found');

    const updatedItem = { ...items[index], ...item } as T;
    items[index] = updatedItem;
    this.save(items);
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    this.save(filtered);
  }

  async getById(id: string): Promise<T | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const items = this.getAll();
    return items.find((item) => item.id === id) || null;
  }
}

// Specific services
export const artistsService = new BaseService<Artist>(STORAGE_KEYS.ARTISTS);
export const catalogsService = new BaseService<Catalog>(STORAGE_KEYS.CATALOGS);
export const usersService = new BaseService<User>(STORAGE_KEYS.USERS);
export const tracksService = new BaseService<Track>(STORAGE_KEYS.TRACKS);
export const projectsService = new BaseService<Project>(STORAGE_KEYS.PROJECTS);
export const distributorsService = new BaseService<Distributor>(
  STORAGE_KEYS.DISTRIBUTORS
);
export const subProjectsService = new BaseService<SubProject>(
  STORAGE_KEYS.SUBPROJECTS
);
