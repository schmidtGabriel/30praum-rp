import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectProjection } from '../../types';
import { useProjectProjections } from '../../hooks/useProjectProjections';
import { useProjects } from '../../hooks/useProjects';
import { useDistributors } from '../../hooks/useDistributors';
import { useArtists } from '../../hooks/useArtists';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ProjectProjectionForm from './ProjectProjectionForm';
import { Loader2 } from 'lucide-react';
import Card from '../../components/Card';

const ProjectProjections = () => {
  const {
    projectProjections,
    isLoading: projectionsLoading,
    error: projectionsError,
    createProjectProjection,
    updateProjectProjection,
    deleteProjectProjection,
  } = useProjectProjections();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { distributors, isLoading: distributorsLoading } = useDistributors();
  const { artists, isLoading: artistsLoading } = useArtists();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjection, setSelectedProjection] =
    useState<ProjectProjection | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const navigate = useNavigate();

  const columns = [
    { key: 'year', label: 'Year' },
    {
      key: 'projectId',
      label: 'Project',
      render: (value: string) =>
        projects.find((p) => p.id === value)?.title || 'Unknown',
    },
    {
      key: 'distributorId',
      label: 'Distributor',
      render: (value: string) =>
        distributors.find((d) => d.id === value)?.name || 'Unknown',
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
      key: 'digitalProfitability',
      label: 'Digital Profitability',
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

  const handleEdit = (projection: ProjectProjection) => {
    setSelectedProjection(projection);
    setIsModalOpen(true);
  };

  const handleView = (projection: ProjectProjection) => {
    navigate(`/project-projections/${projection.id}`);
  };

  const handleDelete = async (projection: ProjectProjection) => {
    if (window.confirm('Are you sure you want to delete this projection?')) {
      await deleteProjectProjection(projection.id);
    }
  };

  const calculateProjectionValues = (
    data: Partial<ProjectProjection>
  ): Partial<ProjectProjection> => {
    const averageDailyPlaysPerProject =
      (data.numberOfTracks || 0) * (data.averageDailyPlaysPerTrack || 0);
    const totalPlays = averageDailyPlaysPerProject * (data.period || 365);
    const grossRevenue =
      ((totalPlays / 1000000) * (data.averageValuePerMPlays || 0));
    const distributor = distributors.find((d) => d.id === data.distributorId);
    const distributorPercentage = distributor?.percentage || 0;
    const distributorProfit =
      grossRevenue - (grossRevenue * distributorPercentage) / 100;
    const proRataUSD = distributorProfit * ((data.companyPercentage || 0) / 100);
    const proRataBRL = proRataUSD * 5.5;
    const project = projects.find((p) => p.id === data.projectId);
    const projectBudget = project?.budget || 0;
    const digitalProfitability = proRataBRL - projectBudget;

    return {
      ...data,
      averageDailyPlaysPerProject,
      totalPlays,
      grossRevenue,
      distributorPercentage,
      distributorProfit,
      proRataUSD,
      proRataBRL,
      netRevenue12Months: proRataBRL,
      projectBudget,
      digitalProfitability,
    };
  };

  const handleSubmit = async (
    data: Omit<ProjectProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const calculatedData = calculateProjectionValues(data);
      if (selectedProjection) {
        await updateProjectProjection(selectedProjection.id, calculatedData);
      } else {
        await createProjectProjection(
          calculatedData as Omit<ProjectProjection, 'id' | 'createdAt' | 'updatedAt'>
        );
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save project projection:', error);
    }
  };

  if (projectionsError) {
    return <div className="text-red-600">Error: {projectionsError.message}</div>;
  }

  const isLoading = projectionsLoading || projectsLoading || distributorsLoading || artistsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const years = Array.from(
    new Set(projectProjections.map((p) => p.year))
  ).sort((a, b) => b - a);

  const filteredProjections = projectProjections.filter((projection) => {
    const yearMatch = !selectedYear || projection.year === selectedYear;
    const project = projects.find((p) => p.id === projection.projectId);
    const artistMatch = !selectedArtistId || project?.artistId === selectedArtistId;
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
        title="Project Projections"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedProjection ? 'Edit Project Projection' : 'Add Project Projection'
        }
      >
        <ProjectProjectionForm
          projection={selectedProjection}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ProjectProjections;