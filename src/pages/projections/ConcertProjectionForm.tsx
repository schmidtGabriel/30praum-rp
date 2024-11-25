import React, { useState, useEffect } from 'react';
import { ConcertProjection } from '../../types';
import { useArtists } from '../../hooks/useArtists';
import { Loader2 } from 'lucide-react';
import SaveButton from '../../components/SaveButton';
import CancelButton from '../../components/CancelButton';

interface ConcertProjectionFormProps {
  projection?: ConcertProjection | null;
  onSubmit: (
    data: Omit<ConcertProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  onCancel: () => void;
}

const ConcertProjectionForm: React.FC<ConcertProjectionFormProps> = ({
  projection,
  onSubmit,
  onCancel,
}) => {
  const { artists, isLoading: artistsLoading } = useArtists();
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    artistId: '',
    showsPerMonth: 0,
    period: 12,
    averageTicketValue: 0,
    crewPercentage: 20,
    artistPercentage: 40,
    companyPercentage: 40,
    totalShows: 0,
    grossRevenue: 0,
    crewShare: 0,
    artistShare: 0,
    companyShare: 0,
    description: '',
  });

  useEffect(() => {
    if (projection) {
      setFormData({
        title: projection.title || '',
        year: projection.year || new Date().getFullYear(),
        artistId: projection.artistId || '',
        showsPerMonth: projection.showsPerMonth || 0,
        period: projection.period || 12,
        averageTicketValue: projection.averageTicketValue || 0,
        crewPercentage: projection.crewPercentage || 20,
        artistPercentage: projection.artistPercentage || 40,
        companyPercentage: projection.companyPercentage || 40,
        totalShows: projection.totalShows || 0,
        grossRevenue: projection.grossRevenue || 0,
        crewShare: projection.crewShare || 0,
        artistShare: projection.artistShare || 0,
        companyShare: projection.companyShare || 0,
        description: projection.description || '',
      });
    }
  }, [projection]);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    let numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) numValue = 0;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (artistsLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Year field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Ano
          </label>
          <input
            type="number"
            min={new Date().getFullYear()}
            value={formData.year}
            onChange={(e) =>
              handleInputChange(
                'year',
                parseInt(e.target.value) || new Date().getFullYear()
              )
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        {/* Artist field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Artista
          </label>
          <select
            value={formData.artistId}
            onChange={(e) => handleInputChange('artistId', e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          >
            <option value="">Selecione um artista</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>

        {/* Shows per Month field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Shows por Mês
          </label>
          <input
            type="number"
            min="0"
            value={formData.showsPerMonth}
            onChange={(e) =>
              handleInputChange('showsPerMonth', parseInt(e.target.value) || 0)
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        {/* Period field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Periodo (meses)
          </label>
          <input
            type="number"
            min="1"
            max="12"
            value={formData.period}
            onChange={(e) =>
              handleInputChange('period', parseInt(e.target.value) || 12)
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        {/* Average Ticket Value field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Valor Médio do Show
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-slate-500 dark:text-slate-400">$</span>
            </div>
            <input
              type="number"
              min="0"
              value={formData.averageTicketValue}
              onChange={(e) =>
                handleInputChange(
                  'averageTicketValue',
                  parseFloat(e.target.value) || 0
                )
              }
              className="block w-full rounded-md border border-slate-300 pl-7 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Crew Percentage field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Porcentagem da Equipe
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={formData.crewPercentage}
              onChange={(e) =>
                handleInputChange(
                  'crewPercentage',
                  parseFloat(e.target.value) || 0
                )
              }
              className="block w-full rounded-md border border-slate-300 pl-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-500 dark:text-slate-400">%</span>
            </div>
          </div>
        </div>

        {/* Artist Percentage field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Porcentagem do Artista
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={formData.artistPercentage}
              onChange={(e) =>
                handleInputChange(
                  'artistPercentage',
                  parseFloat(e.target.value) || 0
                )
              }
              className="block w-full rounded-md border border-slate-300 pl-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-500 dark:text-slate-400">%</span>
            </div>
          </div>
        </div>

        {/* Company Percentage field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Porcentagem da Empresa
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={formData.companyPercentage}
              onChange={(e) =>
                handleInputChange(
                  'companyPercentage',
                  parseFloat(e.target.value) || 0
                )
              }
              className="block w-full rounded-md border border-slate-300 bg-slate-50 pl-4 py-2 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-500 dark:text-slate-400">%</span>
            </div>
          </div>
        </div>

        {/* Description field */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <CancelButton onClick={onCancel} />
        <SaveButton />
      </div>
    </form>
  );
};

export default ConcertProjectionForm;
