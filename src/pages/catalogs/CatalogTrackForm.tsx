import React, { useState } from 'react';
import { Track } from '../../types';

interface CatalogTrackFormProps {
  availableTracks: Track[];
  onSubmit: (data: { trackId: string }) => void;
  onCancel: () => void;
}

const CatalogTrackForm: React.FC<CatalogTrackFormProps> = ({
  availableTracks,
  onSubmit,
  onCancel,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ trackId: selectedTrackId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Selecionar Música
        </label>
        <select
          value={selectedTrackId}
          onChange={(e) => setSelectedTrackId(e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        >
          <option value="">Selecione uma música</option>
          {availableTracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title} ({track.duration})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Adicionar Música
        </button>
      </div>
    </form>
  );
};

export default CatalogTrackForm;
