import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { ProjectProjection } from '../../types';
import { useProjectProjections } from '../../hooks/useProjectProjections';
import { useProjects } from '../../hooks/useProjects';
import { useDistributors } from '../../hooks/useDistributors';
import Modal from '../../components/Modal';
import ProjectProjectionForm from './ProjectProjectionForm';
import Card from '../../components/Card';
import ActionButton from '../../components/ActionButton';

const ProjectProjectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    projectProjections,
    updateProjectProjection,
    isLoading: projectionsLoading,
  } = useProjectProjections();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { distributors, isLoading: distributorsLoading } = useDistributors();

  const [projection, setProjection] = useState<ProjectProjection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!projectionsLoading && id) {
      const currentProjection = projectProjections.find((p) => p.id === id);
      setProjection(currentProjection || null);
    }
  }, [id, projectProjections, projectionsLoading]);

  const project = projects.find((p) => p.id === projection?.projectId);
  const distributor = distributors.find((d) => d.id === projection?.distributorId);

  const calculateDistribution = () => {
    if (!projection) return null;

    const grossRevenue = projection.grossRevenue;
    const distributorAmount = (grossRevenue * projection.distributorPercentage) / 100;
    const netRevenue = grossRevenue - distributorAmount;
    
    const participationAmount = (netRevenue * projection.participationPercentage) / 100;
    const artistAmount = (participationAmount * projection.artistPercentage) / 100;
    const companyAmount = (participationAmount * projection.companyPercentage) / 100;

    return {
      gross: grossRevenue,
      distributor: distributorAmount,
      net: netRevenue,
      participation: participationAmount,
      artist: artistAmount,
      company: companyAmount,
    };
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (
    data: Omit<ProjectProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!projection) return;

    try {
      const averageDailyPlaysPerProject =
        data.numberOfTracks * data.averageDailyPlaysPerTrack;
      const totalPlays = averageDailyPlaysPerProject * data.period;
      const grossRevenue = (totalPlays / 1000000) * data.averageValuePerMPlays;
      const distributorProfit =
        grossRevenue - (grossRevenue * data.distributorPercentage) / 100;
      const proRataUSD = distributorProfit * (data.companyPercentage / 100);
      const proRataBRL = proRataUSD * 5.5;
      const netRevenue12Months = proRataBRL;
      const digitalProfitability = netRevenue12Months - (project?.budget || 0);

      const calculatedData = {
        ...data,
        averageDailyPlaysPerProject,
        totalPlays,
        grossRevenue,
        distributorProfit,
        proRataUSD,
        proRataBRL,
        netRevenue12Months,
        projectBudget: project?.budget || 0,
        digitalProfitability,
      };

      await updateProjectProjection(projection.id, calculatedData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update projection:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  if (projectionsLoading || projectsLoading || distributorsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!projection || !project || !distributor) {
    return null;
  }

  const distribution = calculateDistribution();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Project Projections
        </button>
        <ActionButton
          onClick={handleEdit}
          className="flex items-center"
          leftIcon={<Edit className="h-4 w-4" />}
        >
          Edit Projection
        </ActionButton>
      </div>

      {/* Basic Info Card */}
      <Card>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Project
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {project.title}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Year
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {projection.year}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Distributor
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {distributor.name}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Number of Tracks
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {projection.numberOfTracks}
            </p>
          </div>
        </div>
      </Card>

      {/* Plays Info Card */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Play Statistics
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Daily Plays per Track
            </p>
            <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
              {formatNumber(projection.averageDailyPlaysPerTrack)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Daily Plays per Project
            </p>
            <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
              {formatNumber(projection.averageDailyPlaysPerProject)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Plays
            </p>
            <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
              {formatNumber(projection.totalPlays)}
            </p>
          </div>
        </div>
      </Card>

      {/* Financial Info Card */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Financial Information
        </h2>
        <div className="mt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gross Revenue
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrency(distribution?.gross || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Net Revenue
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrency(distribution?.net || 0)}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="mb-4 font-medium text-slate-900 dark:text-white">
              Revenue Distribution
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Distributor Share ({projection.distributorPercentage}%)
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(distribution?.distributor || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Artist Share ({projection.artistPercentage}%)
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(distribution?.artist || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Company Share ({projection.companyPercentage}%)
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(distribution?.company || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="mb-4 font-medium text-slate-900 dark:text-white">
              Profitability
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Project Budget
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(projection.projectBudget)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Digital Profitability
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(projection.digitalProfitability)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Project Projection"
      >
        <ProjectProjectionForm
          projection={projection}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ProjectProjectionDetail;