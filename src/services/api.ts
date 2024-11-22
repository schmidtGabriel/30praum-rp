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
} from '../types';

const STORAGE_KEYS = {
  ARTISTS: 'artists',
  CATALOGS: 'catalogs',
  USERS: 'users',
  TRACKS: 'tracks',
  PROJECTS: 'projects',
  DISTRIBUTORS: 'distributors',
  SUBPROJECTS: 'subprojects',
  SUBPROJECT_ITEMS: 'subProjectItems',
  CATALOG_PROJECTIONS: 'catalogProjections',
  PROJECT_PROJECTIONS: 'projectProjections',
  CONCERT_PROJECTIONS: 'concertProjections',
};

// Mock data initialization
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
      description: 'A collection of electronic tracks',
      budget: 10000,
      cost: 8500,
    },
    {
      id: '2',
      title: 'Acoustic Sessions',
      artistId: '2',
      releaseDate: '2024-05-15',
      type: 'Album',
      description: 'Live acoustic recordings',
      budget: 15000,
      cost: 12000,
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
      description: 'Professional studio recording session',
      budget: 5000,
      cost: 5000,
    },
    {
      id: '2',
      projectId: '1',
      title: 'Music Video',
      description: 'Music video production',
      budget: 8000,
      cost: 8000,
    },
  ];

  // Mock SubProject Items
  const subProjectItems: SubProjectItem[] = [
    {
      id: '1',
      subprojectId: '1',
      title: 'Studio Time',
      description: 'Recording studio rental - 8 hours',
      cost: 2000,
    },
    {
      id: '2',
      subprojectId: '1',
      title: 'Sound Engineer',
      description: 'Professional sound engineer services',
      cost: 1500,
    },
  ];

  // Mock Catalog Projections
  const catalogProjections: CatalogProjection[] = [
    {
      id: '1',
      artistId: '1',
      catalogId: '1',
      numberOfTracks: 10,
      period: 365,
      dailyPlaysPerTrack: 1000,
      dailyPlaysPerCatalog: 10000,
      totalPlays: 3650000,
      averageValue: 1000,
      participationPercentage: 60,
      artistPercentage: 70,
      companyPercentage: 30,
      proRata: 20000,
      profitability: 100000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Mock Project Projections
  const projectProjections: ProjectProjection[] = [
    {
      id: '1',
      year: 2024,
      projectId: '1',
      distributorId: '1',
      numberOfTracks: 5,
      period: 365,
      averageDailyPlaysPerTrack: 1000,
      averageDailyPlaysPerProject: 5000,
      totalPlays: 1825000,
      averageValuePerMPlays: 1000,
      grossRevenue: 1825,
      distributorPercentage: 15,
      distributorProfit: 1551.25,
      participationPercentage: 20,
      artistPercentage: 40,
      companyPercentage: 40,
      proRataUSD: 620.5,
      proRataBRL: 3412.75,
      netRevenue12Months: 3412.75,
      projectBudget: 10000,
      digitalProfitability: -6587.25,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Mock Concert Projections
  const concertProjections: ConcertProjection[] = [
    {
      id: '1',
      title: 'Summer Tour 2024',
      year: 2024,
      artistId: '1',
      showsPerYear: 48,
      period: 12,
      averageTicketValue: 50,
      crewPercentage: 20,
      artistPercentage: 40,
      companyPercentage: 40,
      totalShows: 48,
      grossRevenue: 120000,
      crewShare: 24000,
      artistShare: 48000,
      companyShare: 48000,
      description: 'Summer tour across major cities',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Initialize storage if empty
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
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
  if (!localStorage.getItem(STORAGE_KEYS.SUBPROJECT_ITEMS)) {
    localStorage.setItem(
      STORAGE_KEYS.SUBPROJECT_ITEMS,
      JSON.stringify(subProjectItems)
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATALOG_PROJECTIONS)) {
    localStorage.setItem(
      STORAGE_KEYS.CATALOG_PROJECTIONS,
      JSON.stringify(catalogProjections)
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECT_PROJECTIONS)) {
    localStorage.setItem(
      STORAGE_KEYS.PROJECT_PROJECTIONS,
      JSON.stringify(projectProjections)
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONCERT_PROJECTIONS)) {
    localStorage.setItem(
      STORAGE_KEYS.CONCERT_PROJECTIONS,
      JSON.stringify(concertProjections)
    );
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

// Export all services
export const usersService = new BaseService<User>(STORAGE_KEYS.USERS);
export const artistsService = new BaseService<Artist>(STORAGE_KEYS.ARTISTS);
export const catalogsService = new BaseService<Catalog>(STORAGE_KEYS.CATALOGS);
export const tracksService = new BaseService<Track>(STORAGE_KEYS.TRACKS);
export const projectsService = new BaseService<Project>(STORAGE_KEYS.PROJECTS);
export const distributorsService = new BaseService<Distributor>(
  STORAGE_KEYS.DISTRIBUTORS
);
export const subProjectsService = new BaseService<SubProject>(
  STORAGE_KEYS.SUBPROJECTS
);
export const subProjectItemsService = new BaseService<SubProjectItem>(
  STORAGE_KEYS.SUBPROJECT_ITEMS
);
export const catalogProjectionsService = new BaseService<CatalogProjection>(
  STORAGE_KEYS.CATALOG_PROJECTIONS
);
export const projectProjectionsService = new BaseService<ProjectProjection>(
  STORAGE_KEYS.PROJECT_PROJECTIONS
);
export const concertProjectionsService = new BaseService<ConcertProjection>(
  STORAGE_KEYS.CONCERT_PROJECTIONS
);