import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConcertProjection } from '../../types';
import { useConcertProjections } from '../../hooks/useConcertProjections';
import { useArtists } from '../../hooks/useArtists';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConcertProjectionForm from './ConcertProjectionForm';
import { Loader2 } from 'lucide-react';
import Card from '../../components/Card';

const ConcertProjections = () => {
  const {
    concertProjections,
    isLoading: projectionsLoading,
    error: projectionsError,
    createConcertProjection,
    updateConcertProjection,
    deleteConcertProjection,
  } = useConcertProjections();
  const { artists, isLoading: artistsLoading } = useArtists();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjection, setSelectedProjection] =
    useState<ConcertProjection | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const navigate = useNavigate();

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'year', label: 'Year' },
    {
      key: 'artistId',
      label: 'Artist',
      render: (value: string) =>
        artists.find((a) => a.id === value)?.name || 'Unknown',
    },
    {
      key: 'totalShows',
      label: 'Total Shows',
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'grossRevenue',
      label: 'Gross Revenue',
      render: (value: number) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : value === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedProjection(null);
    setIsModalOpen(true);
  };

  const handleEdit = (projection: ConcertProjection) => {
    setSelectedProjection(projection);
    setIsModalOpen(true);
  };

  const handleView = (projection: ConcertProjection) => {
    navigate(`/concert-projections/${projection.id}`);
  };

  const handleDelete = async (projection: ConcertProjection) => {
    if (window.confirm('Are you sure you want to delete this projection?')) {
      await deleteConcertProjection(projection.id);
    }
  };

  const calculateProjectionValues = (
    data: Partial<ConcertProjection>
  ): Partial<ConcertProjection> => {
    const totalShows = (data.showsPerYear || 0) * ((data.period || 12) / 12);
    const grossRevenue = totalShows * (data.averageTicketValue || 0);
    const crewShare = (grossRevenue * (data.crewPercentage || 0)) / 100;
    const artistShare = (grossRevenue * (data.artistPercentage || 0)) / 100;
    const companyShare = (grossRevenue * (data.companyPercentage || 0)) / 100;

    return {
      ...data,
      totalShows,
      grossRevenue,
      crewShare,
      artistShare,
      companyShare,
    };
  };

  const handleSubmit = async (
    data: Omit<ConcertProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const calculatedData = calculateProjectionValues(data);
      if (selectedProjection) {
        await updateConcertProjection(selectedProjection.id, calculatedData);
      } else {
        await createConcertProjection(
          calculatedData as Omit<ConcertProjection, 'id' | 'createdAt' | 'updatedAt'>
        );
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save concert projection:', error);
    }
  };

  if (projectionsError) {
    return <div className="text-red-600">Error: {projectionsError.message}</div>;
  }

  const isLoading = projectionsLoading || artistsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const years = Array.from(
    new Set(concertProjections.map((p) => p.year))
  ).sort((a, b) => b - a);

  const filteredProjections = concertProjections.filter((projection) => {
    const yearMatch = !selectedYear || projection.year === selectedYear;
    const artistMatch = !selectedArtistId || projection.artistId === selectedArtistId;
    return yearMatch && artistMatch;
  });

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

      <DataTable
        columns={columns}
        data={filteredProjections}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        title="Concert Projections"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedProjection ? 'Edit Concert Projection' : 'Add Concert Projection'
        }
      >
        <ConcertProjectionForm
          projection={selectedProjection}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ConcertProjections;