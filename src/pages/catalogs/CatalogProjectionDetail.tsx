import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { CatalogProjection } from '../../types';
import { useCatalogProjections } from '../../hooks/useCatalogProjections';
import { useArtists } from '../../hooks/useArtists';
import { useCatalogs } from '../../hooks/useCatalogs';
import Modal from '../../components/Modal';
import CatalogProjectionForm from './CatalogProjectionForm';
import Card from '../../components/Card';
import ActionButton from '../../components/ActionButton';

const CatalogProjectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    catalogProjections,
    updateCatalogProjection,
    isLoading: projectionsLoading,
  } = useCatalogProjections();
  const { artists, isLoading: artistsLoading } = useArtists();
  const { catalogs, isLoading: catalogsLoading } = useCatalogs();

  const [projection, setProjection] = useState<CatalogProjection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!projectionsLoading && id) {
      const currentProjection = catalogProjections.find((p) => p.id === id);
      setProjection(currentProjection || null);
    }
  }, [id, catalogProjections, projectionsLoading]);

  const artist = artists.find((a) => a.id === projection?.artistId);
  const catalog = catalogs.find((c) => c.id === projection?.catalogId);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (
    data: Omit<CatalogProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!projection) return;

    try {
      const dailyPlaysPerCatalog = data.numberOfTracks * data.dailyPlaysPerTrack;
      const totalPlays = dailyPlaysPerCatalog * data.period;
      const grossProfit = (totalPlays / 1000000) * data.averageValue;
      const proRata = grossProfit * 0.4;
      const profitability = proRata * 5;

      const calculatedData = {
        ...data,
        dailyPlaysPerCatalog,
        totalPlays,
        grossProfit,
        proRata,
        profitability,
      };

      await updateCatalogProjection(projection.id, calculatedData);
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

  if (projectionsLoading || artistsLoading || catalogsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!projection || !artist || !catalog) {
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
          Back to Catalog Projections
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
              Artist
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {artist.name}
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
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Period
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {projection.period} days
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Average Value per M Plays
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {formatCurrency(projection.averageValue)}
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
              {formatNumber(projection.dailyPlaysPerTrack)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Daily Plays per Catalog
            </p>
            <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
              {formatNumber(projection.dailyPlaysPerCatalog)}
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
                Gross Profit
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrency(projection.grossProfit)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pro-rata
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrency(projection.proRata)}
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
                  Participation ({projection.participationPercentage}%)
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(
                    (projection.grossProfit * projection.participationPercentage) /
                      100
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Artist Share ({projection.artistPercentage}%)
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(
                    (projection.grossProfit *
                      projection.participationPercentage *
                      projection.artistPercentage) /
                      10000
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Company Share ({projection.companyPercentage}%)
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(
                    (projection.grossProfit *
                      projection.participationPercentage *
                      projection.companyPercentage) /
                      10000
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="mb-4 font-medium text-slate-900 dark:text-white">
              Profitability
            </h3>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Profitability
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrency(projection.profitability)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Catalog Projection"
      >
        <CatalogProjectionForm
          projection={projection}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default CatalogProjectionDetail;