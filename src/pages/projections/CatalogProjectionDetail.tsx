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
import { useDistributors } from '../../hooks/useDistributors';
import formatCurrency from '../../helpers/formatCurrency';

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
  const { distributors, isLoading: distributorsLoading } = useDistributors();

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
  const distributor = distributors.find((d) => d.id === catalog?.distributorId);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (
    data: Omit<CatalogProjection, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!projection) return;

    try {
      const dailyPlaysPerCatalog =
        data.numberOfTracks * data.dailyPlaysPerTrack;
      const totalPlays = dailyPlaysPerCatalog * data.period;
      const grossRevenue = (totalPlays / 1000000) * data.averageValue;
      const grossProfit = distributor
        ? grossRevenue - (grossRevenue / 100) * distributor?.percentage
        : 0;

      const proRata = (grossProfit * projection.companyPercentage) / 100;
      const profitability = proRata * 5;

      const calculatedData = {
        ...data,
        dailyPlaysPerCatalog,
        totalPlays,
        grossProfit,
        grossRevenue,
        proRata,
        profitability,
      };

      await updateCatalogProjection(projection.id, calculatedData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Falha ao atualizar projeção:', error);
    }
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  if (
    projectionsLoading ||
    artistsLoading ||
    catalogsLoading ||
    distributorsLoading
  ) {
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
          Voltar para Projeções de Catálogo
        </button>
        <ActionButton
          onClick={handleEdit}
          className="flex items-center"
          leftIcon={<Edit className="h-4 w-4" />}
        >
          Editar Projeção
        </ActionButton>
      </div>

      {/* Basic Info Card */}
      <Card>
        <div className="grid gap-6 pb-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Artista
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {artist.name}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Distribuidor
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {distributor?.name}
            </p>
          </div>
        </div>
        <div className="border-t">
          <div className="grid gap-6 pt-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Número de Faixas
              </h3>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {projection.numberOfTracks}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Período
              </h3>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {projection.period} dias
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Valor Médio por Milhões Reproduções
              </h3>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {formatCurrency(projection.averageValue, 'Dolar')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Plays Info Card */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Estatísticas de Reprodução
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Reproduções Diárias por Faixa
            </p>
            <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
              {formatNumber(projection.dailyPlaysPerTrack)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Reproduções Diárias por Catálogo
            </p>
            <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
              {formatNumber(projection.dailyPlaysPerCatalog)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total de Reproduções
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
          Informações Financeiras
        </h2>
        <div className="mt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Faturamento Bruto
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrency(projection.grossRevenue, 'Dolar')}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Lucro Bruto
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrency(projection.grossProfit, 'Dolar')}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pro-rata
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrency(projection.proRata, 'Dolar')}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="mb-4 font-medium text-slate-900 dark:text-white">
              Distribuição de Receita
            </h3>
            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Distribuidor ({distributor?.percentage ?? 0}%)
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(
                    (projection.grossRevenue *
                      projection.participationPercentage) /
                      100,
                    'Dolar'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Participação ({projection.participationPercentage}%)
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(
                    (projection.grossProfit *
                      projection.participationPercentage) /
                      100,
                    'Dolar'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Parte do Artista ({projection.artistPercentage}%)
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(
                    (projection.grossProfit * projection.artistPercentage) /
                      100,
                    'Dolar'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Parte da Empresa ({projection.companyPercentage}%)
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                  {formatCurrency(
                    (projection.grossProfit * projection.companyPercentage) /
                      100,
                    'Dolar'
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="mb-4 font-medium text-slate-900 dark:text-white">
              Rentabilidade
            </h3>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Rentabilidade Total
              </p>
              <p className="mt-1 text-lg font-medium text-slate-900 dark:text-white">
                {formatCurrency(projection.profitability, 'Dolar')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Projeção de Catálogo"
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
