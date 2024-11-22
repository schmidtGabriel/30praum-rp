{
  // Update ConcertProjection interface
  const updatedContent = `export interface ConcertProjection {
  id: string;
  title: string;
  year: number;
  artistId: string;
  showsPerYear: number;
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
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}`;
}