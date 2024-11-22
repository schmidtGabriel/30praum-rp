export interface Artist {
  id: string;
  name: string;
  bio: string;
}

export interface Catalog {
  id: string;
  artistId: string;
  distributorId: string;
  playExpectation: number;
  percentage: number;
  trackIds: string[]; // Add this to track songs in the catalog
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
  password: string;
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
  releaseDate: string;
  type: 'Album' | 'EP' | 'Single';
}

export interface SubProject {
  id: string;
  projectId: string;
  title: string;
  type: string;
  cost: number;
}

export interface Distributor {
  id: string;
  name: string;
  percentage: number;
}
