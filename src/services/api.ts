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

// Mock data initialization
const initializeMockData = () => {
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

  // Mock Tracks
  const tracks: Track[] = [
    {
      id: '1',
      title: 'Summer Nights',
      artistId: '1',
      releaseDate: '2024-03-15',
      duration: '3:45',
      expectationDailyPlays: 5000,
    },
    {
      id: '2',
      title: 'Midnight Dreams',
      artistId: '1',
      releaseDate: '2024-03-20',
      duration: '4:12',
      expectationDailyPlays: 3500,
    },
    {
      id: '3',
      title: 'Amor e Paz',
      artistId: '2',
      releaseDate: '2024-02-28',
      duration: '3:30',
      expectationDailyPlays: 7500,
    },
  ];

  // Mock Projects
  const projects: Project[] = [
    {
      id: '1',
      title: 'Electronic Dreams EP',
      artistId: '1',
      releaseDate: '2024-04-01',
      type: 'EP',
    },
    {
      id: '2',
      title: 'Acoustic Sessions',
      artistId: '2',
      releaseDate: '2024-05-15',
      type: 'Album',
    },
  ];

  // Mock Distributors
  const distributors: Distributor[] = [
    {
      id: '1',
      name: 'Global Music',
      percentage: 15,
    },
    {
      id: '2',
      name: 'Digital Streams',
      percentage: 12,
    },
    {
      id: '3',
      name: 'Music Plus',
      percentage: 18,
    },
  ];

  // Mock Catalogs
  const catalogs: Catalog[] = [
    {
      id: '1',
      artistId: '1',
      distributorId: '1',
      playExpectation: 8500,
      percentage: 15,
      trackIds: ['1', '2'],
    },
    {
      id: '2',
      artistId: '2',
      distributorId: '2',
      playExpectation: 7500,
      percentage: 12,
      trackIds: ['3'],
    },
  ];

  // Mock SubProjects
  const subProjects: SubProject[] = [
    {
      id: '1',
      projectId: '1',
      title: 'Studio Recording',
      type: 'Recording',
      cost: 5000,
    },
    {
      id: '2',
      projectId: '1',
      title: 'Music Video',
      type: 'Video',
      cost: 8000,
    },
    {
      id: '3',
      projectId: '2',
      title: 'Marketing Campaign',
      type: 'Marketing',
      cost: 3500,
    },
  ];

  // Initialize default admin user if none exists
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

  // Only initialize if data doesn't exist
  if (!localStorage.getItem(STORAGE_KEYS.ARTISTS)) {
    localStorage.setItem(STORAGE_KEYS.ARTISTS, JSON.stringify(artists));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRACKS)) {
    localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(tracks));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DISTRIBUTORS)) {
    localStorage.setItem(STORAGE_KEYS.DISTRIBUTORS, JSON.stringify(distributors));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATALOGS)) {
    localStorage.setItem(STORAGE_KEYS.CATALOGS, JSON.stringify(catalogs));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBPROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.SUBPROJECTS, JSON.stringify(subProjects));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

// Initialize mock data
initializeMockData();

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