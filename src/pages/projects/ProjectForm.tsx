import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { useArtists } from '../../hooks/useArtists';
import { Loader2 } from 'lucide-react';
import CancelButton from '../../components/CancelButton';
import SaveButton from '../../components/SaveButton';
import { ProjectTypeEnum } from '../../enums/ProjectTypeEnum';

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
    type: ProjectTypeEnum.Single,
    releaseDate: new Date().toISOString().split('T')[0],
    description: '',
    budget: '0',
    cost: '0',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        artistId: project.artistId,
        type: project.type,
        releaseDate: project.releaseDate,
        description: project.description || '',
        budget: project.budget?.toString() || '0',
        cost: project.cost?.toString() || '0',
      });
    } else {
      setFormData({
        title: '',
        artistId: preselectedArtistId || '',
        type: ProjectTypeEnum.Single,
        releaseDate: new Date().toISOString().split('T')[0],
        description: '',
        budget: '0',
        cost: '0',
      });
    }
  }, [project, preselectedArtistId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      budget: parseFloat(formData.budget) || 0,
      cost: parseFloat(formData.cost) || 0,
    });
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
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Título
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Tipo
        </label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as ProjectTypeEnum,
            })
          }
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          required
        >
          {Object.entries(ProjectTypeEnum).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Artist
        </label>
        <select
          value={formData.artistId}
          onChange={(e) =>
            setFormData({ ...formData, artistId: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          required
          disabled={!!preselectedArtistId}
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
          Budget
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
              $
            </span>
          </div>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
            min="0"
            step="0.01"
            className="block w-full rounded-md border border-slate-300 pl-7 pr-12 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Release Date
        </label>
        <input
          type="date"
          value={formData.releaseDate}
          onChange={(e) =>
            setFormData({ ...formData, releaseDate: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
