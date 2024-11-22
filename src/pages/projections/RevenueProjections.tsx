import React, { useState } from 'react';
import { useProjectProjections } from '../../hooks/useProjectProjections';
import { useCatalogProjections } from '../../hooks/useCatalogProjections';
import { useConcertProjections } from '../../hooks/useConcertProjections';
import { useArtists } from '../../hooks/useArtists';
import { Loader2, Music2, Disc3, Mic2, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Card from '../../components/Card';

const COLORS = ['#6366f1', '#22c55e', '#eab308'];

const RevenueProjections = () => {
  const { projectProjections, isLoading: projectsLoading } = useProjectProjections();
  const { catalogProjections, isLoading: catalogsLoading } = useCatalogProjections();
  const { concertProjections, isLoading: concertsLoading } = useConcertProjections();
  const { artists, isLoading: artistsLoading } = useArtists();

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedArtistId, setSelectedArtistId] = useState<string>('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const filterProjections = () => {
    const filteredProjects = projectProjections.filter((proj) => {
      const yearMatch = !selectedYear || proj.year === selectedYear;
      const artistMatch = !selectedArtistId || proj.projectId === selectedArtistId;
      return yearMatch && artistMatch;
    });

    const filteredCatalogs = catalogProjections.filter((proj) => {
      const yearMatch = true; // Catalogs don't have year
      const artistMatch = !selectedArtistId || proj.artistId === selectedArtistId;
      return yearMatch && artistMatch;
    });

    const filteredConcerts = concertProjections.filter((proj) => {
      const yearMatch = !selectedYear || proj.year === selectedYear;
      const artistMatch = !selectedArtistId || proj.artistId === selectedArtistId;
      return yearMatch && artistMatch;
    });

    return {
      projects: filteredProjects,
      catalogs: filteredCatalogs,
      concerts: filteredConcerts,
    };
  };

  const calculateTotalRevenue = () => {
    const filtered = filterProjections();
    const projectRevenue = filtered.projects.reduce(
      (sum, proj) => sum + proj.grossRevenue,
      0
    );
    const catalogRevenue = filtered.catalogs.reduce(
      (sum, proj) => sum + proj.grossProfit,
      0
    );
    const concertRevenue = filtered.concerts.reduce(
      (sum, proj) => sum + proj.grossRevenue,
      0
    );

    return {
      projectRevenue,
      catalogRevenue,
      concertRevenue,
      total: projectRevenue + catalogRevenue + concertRevenue,
    };
  };

  const calculateRevenueByArtist = () => {
    const filtered = filterProjections();
    const artistRevenue = new Map<string, number>();

    // Add project revenue
    filtered.projects.forEach((proj) => {
      const current = artistRevenue.get(proj.projectId) || 0;
      artistRevenue.set(proj.projectId, current + proj.grossRevenue);
    });

    // Add catalog revenue
    filtered.catalogs.forEach((proj) => {
      const current = artistRevenue.get(proj.artistId) || 0;
      artistRevenue.set(proj.artistId, current + proj.grossProfit);
    });

    // Add concert revenue
    filtered.concerts.forEach((proj) => {
      const current = artistRevenue.get(proj.artistId) || 0;
      artistRevenue.set(proj.artistId, current + proj.grossRevenue);
    });

    return Array.from(artistRevenue.entries())
      .map(([artistId, revenue]) => ({
        artist: artists.find((a) => a.id === artistId),
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  const prepareChartData = () => {
    const revenue = calculateTotalRevenue();
    const pieData = [
      { name: 'Projects', value: revenue.projectRevenue },
      { name: 'Catalogs', value: revenue.catalogRevenue },
      { name: 'Concerts', value: revenue.concertRevenue },
    ];

    const artistData = calculateRevenueByArtist()
      .slice(0, 5)
      .map((item) => ({
        name: item.artist?.name || 'Unknown',
        revenue: item.revenue,
      }));

    return { pieData, artistData };
  };

  const years = Array.from(
    new Set([
      ...projectProjections.map((p) => p.year),
      ...concertProjections.map((p) => p.year),
    ])
  ).sort((a, b) => b - a);

  if (projectsLoading || catalogsLoading || concertsLoading || artistsLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const revenue = calculateTotalRevenue();
  const artistRevenue = calculateRevenueByArtist();
  const { pieData, artistData } = prepareChartData();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <div className="w-48">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="w-48">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Artist
            </label>
            <select
              value={selectedArtistId}
              onChange={(e) => setSelectedArtistId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">All Artists</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Total Revenue Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Revenue
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(revenue.total)}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Project Revenue
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(revenue.projectRevenue)}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <Music2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Catalog Revenue
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(revenue.catalogRevenue)}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <Disc3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Concert Revenue
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(revenue.concertRevenue)}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
              <Mic2 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Revenue Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    name,
                  }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="currentColor"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="text-sm fill-slate-900 dark:fill-white"
                      >
                        {name} ({(percent * 100).toFixed(0)}%)
                      </text>
                    );
                  }}
                  outerRadius={120}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Top 5 Artists by Revenue
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={artistData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'currentColor' }}
                  className="text-slate-900 dark:text-white"
                />
                <YAxis
                  tick={{ fill: 'currentColor' }}
                  className="text-slate-900 dark:text-white"
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short',
                      style: 'currency',
                      currency: 'USD',
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Revenue by Artist Table */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Revenue by Artist
        </h2>
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Artist
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                    Total Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {artistRevenue.map(({ artist, revenue }) => (
                  <tr
                    key={artist?.id}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {artist?.name || 'Unknown Artist'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">
                      {formatCurrency(revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RevenueProjections;