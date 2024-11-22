import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { useArtists } from '../../hooks/useArtists';
import { Loader2 } from 'lucide-react';
import CancelButton from '../../components/CancelButton';
import SaveButton from '../../components/SaveButton';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: Omit<Project, 'id'>) => void;
  onCancel: () => void;
  preselectedArtistId?: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSubmit,
  onCancel,
  preselectedArtistId,
}) => {
  const { artists, isLoading: artistsLoading } = useArtists();
  const [formData, setFormData] = useState({
    title: '',
    artistId: '',
    type: 'Album' as const,
    releaseDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        artistId: project.artistId,
        type: project.type,
        releaseDate: project.releaseDate,
      });
    } else {
      setFormData({
        title: '',
        artistId: preselectedArtistId || '',
        type: 'Album',
        releaseDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [project, preselectedArtistId]);

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
        <label className="block text-sm font-medium text-slate-700">Tipo</label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as 'Album' | 'EP' | 'Single',
            })
          }
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        >
          <option value="Album">Álbum</option>
          <option value="EP">EP</option>
          <option value="Single">Single</option>
        </select>
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

      <div className="flex justify-end gap-3">
        <CancelButton onClick={onCancel} />
        <SaveButton />
      </div>
    </form>
  );
};

export default ProjectForm;
