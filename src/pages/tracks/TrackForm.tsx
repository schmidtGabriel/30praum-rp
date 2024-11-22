import React, { useState, useEffect } from 'react';
import { Track } from '../../types';
import { useArtists } from '../../hooks/useArtists';
import { Loader2 } from 'lucide-react';
import SaveButton from '../../components/SaveButton';
import CancelButton from '../../components/CancelButton';

interface TrackFormProps {
  track?: Track | null;
  onSubmit: (data: Omit<Track, 'id'>) => void;
  onCancel: () => void;
  preselectedArtistId?: string;
}

const TrackForm: React.FC<TrackFormProps> = ({
  track,
  onSubmit,
  onCancel,
  preselectedArtistId,
}) => {
  const { artists, isLoading: artistsLoading } = useArtists();
  const [formData, setFormData] = useState({
    title: '',
    artistId: '',
    releaseDate: new Date().toISOString().split('T')[0],
    duration: '',
    expectationDailyPlays: 0,
  });

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title,
        artistId: track.artistId,
        releaseDate: track.releaseDate,
        duration: track.duration,
        expectationDailyPlays: track.expectationDailyPlays,
      });
    } else {
      setFormData({
        title: '',
        artistId: preselectedArtistId || '',
        releaseDate: new Date().toISOString().split('T')[0],
        duration: '',
        expectationDailyPlays: 0,
      });
    }
  }, [track, preselectedArtistId]);

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
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Título
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        />
      </div>

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
          Data de Lançamento
        </label>
        <input
          type="date"
          value={formData.releaseDate}
          onChange={(e) =>
            setFormData({ ...formData, releaseDate: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Duração (mm:ss)
        </label>
        <input
          type="text"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
          pattern="^([0-9]{1,2}):([0-5][0-9])$"
          placeholder="03:45"
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Reproduções Diárias Esperadas
        </label>
        <input
          type="number"
          value={formData.expectationDailyPlays}
          onChange={(e) =>
            setFormData({
              ...formData,
              expectationDailyPlays: parseInt(e.target.value) || 0,
            })
          }
          min="0"
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <CancelButton onClick={onCancel} />
        <SaveButton />
      </div>
    </form>
  );
};

export default TrackForm;
