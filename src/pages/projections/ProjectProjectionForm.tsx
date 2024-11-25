import React, { useState, useEffect } from 'react';
import { ProjectProjection } from '../../types';
import { useProjects } from '../../hooks/useProjects';
import { useDistributors } from '../../hooks/useDistributors';
import { Loader2 } from 'lucide-react';
import SaveButton from '../../components/SaveButton';
import CancelButton from '../../components/CancelButton';

interface ProjectProjectionFormProps {
  projection?: ProjectProjection | null;
  onSubmit: (
    data: Omit<ProjectProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  onCancel: () => void;
}

const ProjectProjectionForm: React.FC<ProjectProjectionFormProps> = ({
  projection,
  onSubmit,
  onCancel,
}) => {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { distributors, isLoading: distributorsLoading } = useDistributors();

  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    projectId: '',
    distributorId: '',
    numberOfTracks: 1,
    period: 365,
    averageDailyPlaysPerTrack: 0,
    averageDailyPlaysPerProject: 0,
    totalPlays: 0,
    averageValuePerMPlays: 1000,
    grossRevenue: 0,
    distributorPercentage: 0,
    distributorProfit: 0,
    participationPercentage: 20,
    artistPercentage: 40,
    companyPercentage: 40,
    proRataUSD: 0,
    proRataBRL: 0,
    netRevenue12Months: 0,
    projectBudget: 0,
    digitalProfitability: 0,
  });

  useEffect(() => {
    if (projection) {
      setFormData({
        year: projection.year,
        projectId: projection.projectId,
        distributorId: projection.distributorId,
        numberOfTracks: projection.numberOfTracks,
        period: projection.period,
        averageDailyPlaysPerTrack: projection.averageDailyPlaysPerTrack,
        averageDailyPlaysPerProject: projection.averageDailyPlaysPerProject,
        totalPlays: projection.totalPlays,
        averageValuePerMPlays: projection.averageValuePerMPlays,
        grossRevenue: projection.grossRevenue,
        distributorPercentage: projection.distributorPercentage,
        distributorProfit: projection.distributorProfit,
        participationPercentage: projection.participationPercentage,
        artistPercentage: projection.artistPercentage,
        companyPercentage: projection.companyPercentage,
        proRataUSD: projection.proRataUSD,
        proRataBRL: projection.proRataBRL,
        netRevenue12Months: projection.netRevenue12Months,
        projectBudget: projection.projectBudget,
        digitalProfitability: projection.digitalProfitability,
      });
    }
  }, [projection]);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;

    if (field === 'artistPercentage') {
      const remaining = Math.max(
        0,
        100 - formData.participationPercentage - numValue
      );
      setFormData((prev) => ({
        ...prev,
        [field]: numValue,
        companyPercentage: remaining,
      }));
    } else if (field === 'participationPercentage') {
      const remaining = Math.max(0, 100 - numValue - formData.artistPercentage);
      setFormData((prev) => ({
        ...prev,
        [field]: numValue,
        companyPercentage: remaining,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (projectsLoading || distributorsLoading) {
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
            Year
          </label>
          <input
            type="number"
            min={new Date().getFullYear()}
            value={formData.year}
            onChange={(e) =>
              handleInputChange('year', parseInt(e.target.value))
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        {/* Project field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Project
          </label>
          <select
            value={formData.projectId}
            onChange={(e) => handleInputChange('projectId', e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        {/* Distributor field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Distributor
          </label>
          <select
            value={formData.distributorId}
            onChange={(e) => handleInputChange('distributorId', e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          >
            <option value="">Select a distributor</option>
            {distributors.map((distributor) => (
              <option key={distributor.id} value={distributor.id}>
                {distributor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Number of Tracks field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Number of Tracks
          </label>
          <input
            type="number"
            min="1"
            value={formData.numberOfTracks}
            onChange={(e) =>
              handleInputChange('numberOfTracks', parseInt(e.target.value))
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        {/* Period field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Period (days)
          </label>
          <input
            type="number"
            min="1"
            value={formData.period}
            onChange={(e) =>
              handleInputChange('period', parseInt(e.target.value))
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        {/* Average Daily Plays Per Track field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Average Daily Plays Per Track
          </label>
          <input
            type="number"
            min="0"
            value={formData.averageDailyPlaysPerTrack}
            onChange={(e) =>
              handleInputChange(
                'averageDailyPlaysPerTrack',
                parseInt(e.target.value)
              )
            }
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        {/* Average Value Per M Plays field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Average Value Per M Plays
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-slate-500 dark:text-slate-400">$</span>
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.averageValuePerMPlays}
              onChange={(e) =>
                handleInputChange(
                  'averageValuePerMPlays',
                  parseFloat(e.target.value)
                )
              }
              className="block w-full rounded-md border border-slate-300 pl-7 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Participation Percentage field */}
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
                handleInputChange(
                  'participationPercentage',
                  parseFloat(e.target.value)
                )
              }
              className="block w-full rounded-md border border-slate-300 pr-12 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
            Artist Percentage
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              max="100"
              value={formData.artistPercentage}
              onChange={(e) =>
                handleInputChange(
                  'artistPercentage',
                  parseFloat(e.target.value)
                )
              }
              className="block w-full rounded-md border border-slate-300 pr-12 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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
              <span className="text-slate-500 dark:text-slate-400">%</span>
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

export default ProjectProjectionForm;
