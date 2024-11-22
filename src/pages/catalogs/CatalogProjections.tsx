import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CatalogProjection } from '../../types';
import { useCatalogProjections } from '../../hooks/useCatalogProjections';
import { useArtists } from '../../hooks/useArtists';
import { useCatalogs } from '../../hooks/useCatalogs';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import CatalogProjectionForm from './CatalogProjectionForm';
import { Loader2 } from 'lucide-react';
import Card from '../../components/Card';

const CatalogProjections = () => {
  const {
    catalogProjections,
    isLoading: projectionsLoading,
    error: projectionsError,
    createCatalogProjection,
    updateCatalogProjection,
    deleteCatalogProjection,
  } = useCatalogProjections();
  const { artists, isLoading: artistsLoading } = useArtists();
  const { catalogs, isLoading: catalogsLoading } = useCatalogs();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjection, setSelectedProjection] =
    useState<CatalogProjection | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const navigate = useNavigate();

  const columns = [
    {
      key: 'artistId',
      label: 'Artist',
      render: (value: string) =>
        artists.find((a) => a.id === value)?.name || 'Unknown',
    },
    {
      key: 'catalogId',
      label: 'Catalog',
      render: (value: string) => {
        const catalog = catalogs.find((c) => c.id === value);
        const artist = artists.find((a) => a.id === catalog?.artistId);
        return `${artist?.name || 'Unknown'}'s Catalog`;
      },
    },
    {
      key: 'numberOfTracks',
      label: 'Tracks',
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'dailyPlaysPerCatalog',
      label: 'Daily Plays',
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'grossProfit',
      label: 'Gross Profit',
      render: (value: number) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value),
    },
    {
      key: 'profitability',
      label: 'Profitability',
      render: (value: number) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value),
    },
  ];

  const handleAdd = () => {
    setSelectedProjection(null);
    setIsModalOpen(true);
  };

  const handleEdit = (projection: CatalogProjection) => {
    setSelectedProjection(projection);
    setIsModalOpen(true);
  };

  const handleView = (projection: CatalogProjection) => {
    navigate(`/catalog-projections/${projection.id}`);
  };

  const handleDelete = async (projection: CatalogProjection) => {
    if (window.confirm('Are you sure you want to delete this projection?')) {
      await deleteCatalogProjection(projection.id);
    }
  };

  const calculateProjectionValues = (
    data: Partial<CatalogProjection>
  ): Partial<CatalogProjection> => {
    const dailyPlaysPerCatalog = (data.numberOfTracks || 0) * (data.dailyPlaysPerTrack || 0);
    const totalPlays = dailyPlaysPerCatalog * (data.period || 365);
    const grossProfit = (totalPlays / 1000000) * (data.averageValue || 1000);
    const proRata = grossProfit * 0.4;
    const profitability = proRata * 5;

    return {
      ...data,
      dailyPlaysPerCatalog,
      totalPlays,
      grossProfit,
      proRata,
      profitability,
    };
  };

  const handleSubmit = async (
    data: Omit<CatalogProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const calculatedData = calculateProjectionValues(data);
      if (selectedProjection) {
        await updateCatalogProjection(selectedProjection.id, calculatedData);
      } else {
        await createCatalogProjection(
          calculatedData as Omit<CatalogProjection, 'id' | 'createdAt' | 'updatedAt'>
        );
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save catalog projection:', error);
    }
  };

  if (projectionsError) {
    return <div className="text-red-600">Error: {projectionsError.message}</div>;
  }

  const isLoading = projectionsLoading || artistsLoading || catalogsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const years = Array.from(
    new Set(catalogProjections.map((p) => new Date(p.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  const filteredProjections = catalogProjections.filter((projection) => {
    const yearMatch = !selectedYear || new Date(projection.createdAt).getFullYear() === selectedYear;
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
        title="Catalog Projections"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedProjection ? 'Edit Catalog Projection' : 'Add Catalog Projection'
        }
      >
        <CatalogProjectionForm
          projection={selectedProjection}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default CatalogProjections;