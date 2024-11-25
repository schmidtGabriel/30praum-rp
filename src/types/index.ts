export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  releaseDate: string;
  duration: string;
  expectationDailyPlays: number;
}

export interface Project {
  id: string;
  title: string;
  artistId: string;
  type: 'Album' | 'EP' | 'Single';
  releaseDate: string;
  description?: string;
  budget?: number;
  cost?: number;
}

export interface SubProject {
  id: string;
  projectId: string;
  title: string;
  description: string;
  budget?: number;
  cost: number;
}

export interface SubProjectItem {
  id: string;
  subprojectId: string;
  title: string;
  description: string;
  cost: number;
}

export interface Distributor {
  id: string;
  name: string;
  percentage: number;
}

export interface Catalog {
  id: string;
  artistId: string;
  distributorId: string;
  playExpectation: number;
  percentage: number;
  trackIds: string[];
}

export interface CatalogProjection {
  id: string;
  artistId: string;
  catalogId: string;
  numberOfTracks: number;
  period: number;
  dailyPlaysPerTrack: number;
  dailyPlaysPerCatalog: number;
  totalPlays: number;
  averageValue: number;
  participationPercentage: number;
  artistPercentage: number;
  companyPercentage: number;
  proRata: number;
  profitability: number;
  grossRevenue: number;
  grossProfit: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectProjection {
  id: string;
  year: number;
  projectId: string;
  distributorId: string;
  numberOfTracks: number;
  period: number;
  averageDailyPlaysPerTrack: number;
  averageDailyPlaysPerProject: number;
  totalPlays: number;
  averageValuePerMPlays: number;
  grossRevenue: number;
  distributorPercentage: number;
  distributorProfit: number;
  participationPercentage: number;
  artistPercentage: number;
  companyPercentage: number;
  proRataUSD: number;
  proRataBRL: number;
  netRevenue12Months: number;
  projectBudget: number;
  digitalProfitability: number;
  status?: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface ConcertProjection {
  id: string;
  title: string;
  year: number;
  artistId: string;
  showsPerMonth: number;
  period: number;
  averageTicketValue: number;
  crewPercentage: number;
  artistPercentage: number;
  companyPercentage: number;
  totalShows: number;
  grossRevenue: number;
  crewShare: number;
  artistShare: number;
  companyShare: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}
