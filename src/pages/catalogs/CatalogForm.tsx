import React, { useState, useEffect } from 'react';
import { Catalog } from '../../types';
import { useArtists } from '../../hooks/useArtists';
import { useDistributors } from '../../hooks/useDistributors';
import { Loader2 } from 'lucide-react';
import CancelButton from '../../components/CancelButton';
import SaveButton from '../../components/SaveButton';

interface CatalogFormProps {
  catalog?: Catalog | null;
  onSubmit: (data: Omit<Catalog, 'id'>) => void;
  onCancel: () => void;
  preselectedArtistId?: string;
}

const CatalogForm: React.FC<CatalogFormProps> = ({
  catalog,
  onSubmit,
  onCancel,
  preselectedArtistId,
}) => {
  const { artists, isLoading: artistsLoading } = useArtists();
  const { distributors, isLoading: distributorsLoading } = useDistributors();

  const [formData, setFormData] = useState<Omit<Catalog, 'id'>>({
    artistId: '',
    distributorId: '',
    playExpectation: 0,
    percentage: 0,
    trackIds: [],
  });

  useEffect(() => {
    if (catalog) {
      setFormData({
        artistId: catalog.artistId,
        distributorId: catalog.distributorId,
        playExpectation: catalog.playExpectation,
        percentage: catalog.percentage,
        trackIds: catalog.trackIds || [],
      });
    } else {
      setFormData({
        artistId: preselectedArtistId || '',
        distributorId: '',
        playExpectation: 0,
        percentage: 0,
        trackIds: [],
      });
    }
  }, [catalog, preselectedArtistId]);

  useEffect(() => {
    if (formData.distributorId) {
      const distributor = distributors.find(
        (p) => p.id === formData.distributorId
      );
      if (distributor) {
        setFormData((prev) => ({
          ...prev,
          percentage: distributor.percentage,
        }));
      }
    }
  }, [formData.distributorId, distributors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (artistsLoading || distributorsLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Artista
        </label>
        <select
          value={formData.artistId}
          onChange={(e) =>
            setFormData({ ...formData, artistId: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
          required
          disabled={!!preselectedArtistId}
        >
          <option value="">Selecione um artista</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Distribuidora
        </label>
        <select
          value={formData.distributorId}
          onChange={(e) =>
            setFormData({ ...formData, distributorId: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        >
          <option value="">Selecione uma distribuidora</option>
          {distributors.map((distributor) => (
            <option key={distributor.id} value={distributor.id}>
              {distributor.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Porcentagem
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="number"
            value={formData.percentage}
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-slate-50 text-slate-500"
            disabled
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-slate-500 sm:text-sm">%</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Definido automaticamente com base no provedor
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <CancelButton onClick={onCancel} />
        <SaveButton />
      </div>
    </form>
  );
};

export default CatalogForm;
