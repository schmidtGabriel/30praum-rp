import React, { useState, useEffect } from 'react';
import { CatalogProjection } from '../../types';
import { useArtists } from '../../hooks/useArtists';
import { useCatalogs } from '../../hooks/useCatalogs';
import { Loader2 } from 'lucide-react';
import SaveButton from '../../components/SaveButton';
import CancelButton from '../../components/CancelButton';

interface CatalogProjectionFormProps {
  projection?: CatalogProjection | null;
  onSubmit: (
    data: Omit<CatalogProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  onCancel: () => void;
}

const CatalogProjectionForm: React.FC<CatalogProjectionFormProps> = ({
  projection,
  onSubmit,
  onCancel,
}) => {
  const { artists, isLoading: artistsLoading } = useArtists();
  const { catalogs, isLoading: catalogsLoading } = useCatalogs();

  const [formData, setFormData] = useState({
    artistId: '',
    catalogId: '',
    numberOfTracks: 1,
    period: 365,
    dailyPlaysPerTrack: 0,
    dailyPlaysPerCatalog: 0,
    totalPlays: 0,
    averageValue: 1000,
    participationPercentage: 20,
    artistPercentage: 40,
    companyPercentage: 40,
    proRata: 0,
    profitability: 0,
  });

  const [selectedArtistId, setSelectedArtistId] = useState('');

  useEffect(() => {
    if (projection) {
      setFormData({
        artistId: projection.artistId,
        catalogId: projection.catalogId,
        numberOfTracks: projection.numberOfTracks,
        period: projection.period,
        dailyPlaysPerTrack: projection.dailyPlaysPerTrack,
        dailyPlaysPerCatalog: projection.dailyPlaysPerCatalog,
        totalPlays: projection.totalPlays,
        averageValue: projection.averageValue,
        participationPercentage: projection.participationPercentage,
        artistPercentage: projection.artistPercentage,
        companyPercentage: projection.companyPercentage,
        proRata: projection.proRata,
        profitability: projection.profitability,
      });
      setSelectedArtistId(projection.artistId);
    }
  }, [projection]);

  const handleArtistChange = (artistId: string) => {
    setSelectedArtistId(artistId);
    setFormData((prev) => ({
      ...prev,
      artistId,
      catalogId: '',
    }));
  };

  const filteredCatalogs = catalogs.filter((c) => c.artistId === selectedArtistId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (artistsLoading || catalogsLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Artist
          </label>
          <select
            value={selectedArtistId}
            onChange={(e) => handleArtistChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          >
            <option value="">Select an artist</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Catalog
          </label>
          <select
            value={formData.catalogId}
            onChange={(e) =>
              setFormData({ ...formData, catalogId: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          >
            <option value="">Select a catalog</option>
            {filteredCatalogs.map((catalog) => (
              <option key={catalog.id} value={catalog.id}>
                {artists.find((a) => a.id === catalog.artistId)?.name}'s Catalog
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Number of Tracks
          </label>
          <input
            type="number"
            min="1"
            value={formData.numberOfTracks}
            onChange={(e) =>
              setFormData({
                ...formData,
                numberOfTracks: parseInt(e.target.value) || 1,
              })
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Period (Days)
          </label>
          <input
            type="number"
            min="1"
            value={formData.period}
            onChange={(e) =>
              setFormData({
                ...formData,
                period: parseInt(e.target.value) || 365,
              })
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Daily Plays per Track
          </label>
          <input
            type="number"
            min="0"
            value={formData.dailyPlaysPerTrack}
            onChange={(e) =>
              setFormData({
                ...formData,
                dailyPlaysPerTrack: parseInt(e.target.value) || 0,
              })
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Average Value
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
                $
              </span>
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.averageValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  averageValue: parseFloat(e.target.value) || 0,
                })
              }
              className="block w-full rounded-md border border-slate-300 pl-7 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Participation Percentage
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              max="100"
              value={formData.participationPercentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  participationPercentage: parseFloat(e.target.value) || 0,
                })
              }
              className="block w-full rounded-md border border-slate-300 pr-12 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
                %
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Artist Percentage
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              max="100"
              value={formData.artistPercentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  artistPercentage: parseFloat(e.target.value) || 0,
                  companyPercentage: 100 - (parseFloat(e.target.value) || 0),
                })
              }
              className="block w-full rounded-md border border-slate-300 pr-12 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
                %
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Company Percentage
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              value={formData.companyPercentage}
              readOnly
              className="block w-full rounded-md border border-slate-300 bg-slate-50 pr-12 py-2 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <CancelButton onClick={onCancel} />
        <SaveButton />
      </div>
    </form>
  );
};

export default CatalogProjectionForm;