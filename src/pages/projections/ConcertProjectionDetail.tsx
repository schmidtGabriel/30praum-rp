import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { ConcertProjection } from '../../types';
import { useConcertProjections } from '../../hooks/useConcertProjections';
import { useArtists } from '../../hooks/useArtists';
import Modal from '../../components/Modal';
import ConcertProjectionForm from './ConcertProjectionForm';
import Card from '../../components/Card';
import ActionButton from '../../components/ActionButton';

const ConcertProjectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    concertProjections,
    updateConcertProjection,
    isLoading: projectionsLoading,
  } = useConcertProjections();
  const { artists, isLoading: artistsLoading } = useArtists();

  const [projection, setProjection] = useState<ConcertProjection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!projectionsLoading && id) {
      const currentProjection = concertProjections.find((p) => p.id === id);
      setProjection(currentProjection || null);
    }
  }, [id, concertProjections, projectionsLoading]);

  const artist = artists.find((a) => a.id === projection?.artistId);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (
    data: Omit<ConcertProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!projection) return;

    try {
      const totalShows = (data.showsPerYear * data.period) / 12;
      const grossRevenue = totalShows * data.averageTicketValue;
      const crewShare = (grossRevenue * data.crewPercentage) / 100;
      const artistShare = (grossRevenue * data.artistPercentage) / 100;
      const companyShare = (grossRevenue * data.companyPercentage) / 100;

      const calculatedData = {
        ...data,
        totalShows,
        grossRevenue,
        crewShare,
        artistShare,
        companyShare,
      };

      await updateConcertProjection(projection.id, calculatedData);
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

  if (projectionsLoading || artistsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!projection || !artist) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Concert Projections
        </button>
        <ActionButton
          onClick={handleEdit}
          className="flex items-center"
          leftIcon={<Edit className="h-4 w-4" />}
        >
          Edit Projection
        </ActionButton>
      </div>

      {/* Header Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {projection.title}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Artist: {artist.name}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Year: {projection.year}
            </p>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              projection.status === 'active'
                ? 'bg-green-100 text-green-800'
                : projection.status === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {projection.status.charAt(0).toUpperCase() + projection.status.slice(1)}
          </span>
        </div>
        {projection.description && (
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            {projection.description}
          </p>
        )}
      </Card>

      {/* Concert Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Concert Information
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Shows per Year
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {projection.showsPerYear}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Period
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {projection.period} months
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Shows
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatNumber(projection.totalShows)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Average Ticket Value
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrency(projection.averageTicketValue)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Financial Information
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gross Revenue
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrency(projection.grossRevenue)}
              </p>
            </div>
            <div className="border-t pt-4">
              <h3 className="mb-4 font-medium text-slate-900 dark:text-white">
                Revenue Distribution
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Crew Share ({projection.crewPercentage}%)
                  </p>
                  <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                    {formatCurrency(projection.crewShare)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Artist Share ({projection.artistPercentage}%)
                  </p>
                  <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                    {formatCurrency(projection.artistShare)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Company Share ({projection.companyPercentage}%)
                  </p>
                  <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                    {formatCurrency(projection.companyShare)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Concert Projection"
      >
        <ConcertProjectionForm
          projection={projection}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ConcertProjectionDetail;