import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Edit, ArrowLeft, Music, Plus, Trash2 } from 'lucide-react';
import { Catalog, Track } from '../../types';
import { useCatalogs } from '../../hooks/useCatalogs';
import { useArtists } from '../../hooks/useArtists';
import { useDistributors } from '../../hooks/useDistributors';
import { useTracks } from '../../hooks/useTracks';
import Modal from '../../components/Modal';
import CatalogForm from './CatalogForm';
import CatalogTrackForm from './CatalogTrackForm';
import Card from '../../components/Card';

const calculateAveragePlayExpectation = (tracks: Track[]): number => {
  if (tracks.length === 0) return 0;
  const total = tracks.reduce(
    (sum, track) => sum + track.expectationDailyPlays,
    0
  );
  return Math.round(total / tracks.length);
};

const CatalogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { catalogs, updateCatalog, isLoading: catalogsLoading } = useCatalogs();
  const { artists, isLoading: artistsLoading } = useArtists();
  const { distributors, isLoading: distributorsLoading } = useDistributors();
  const { tracks, isLoading: tracksLoading } = useTracks();

  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'catalog' | 'track'>('catalog');

  useEffect(() => {
    if (!catalogsLoading) {
      const currentCatalog = catalogs.find((c) => c.id === id);
      setCatalog(currentCatalog || null);
    }
  }, [id, catalogs, catalogsLoading]);

  const artist = artists.find((a) => a.id === catalog?.artistId);
  const distributor = distributors.find((p) => p.id === catalog?.distributorId);

  const artistTracks = tracks.filter((s) => s.artistId === catalog?.artistId);
  const catalogTracks = tracks.filter((s) => catalog?.trackIds?.includes(s.id));
  const availableTracks = artistTracks.filter(
    (s) => !catalog?.trackIds?.includes(s.id)
  );

  const handleEdit = () => {
    setModalType('catalog');
    setIsModalOpen(true);
  };

  const handleAddTrack = () => {
    setModalType('track');
    setIsModalOpen(true);
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (
      !catalog ||
      !window.confirm('Tem certeza que deseja remover esta música do catálogo?')
    ) {
      return;
    }

    try {
      const updatedTrackIds = catalog.trackIds.filter((id) => id !== trackId);
      const updatedCatalogTracks = tracks.filter((s) =>
        updatedTrackIds.includes(s.id)
      );
      const newPlayExpectation =
        calculateAveragePlayExpectation(updatedCatalogTracks);

      await updateCatalog(catalog.id, {
        ...catalog,
        trackIds: updatedTrackIds,
        playExpectation: newPlayExpectation,
      });
    } catch (error) {
      console.error('Falha ao remover música:', error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (modalType === 'catalog' && catalog) {
        await updateCatalog(catalog.id, data);
      } else if (modalType === 'track' && catalog) {
        const trackId = data.trackId;
        const updatedTrackIds = [...(catalog.trackIds || []), trackId];
        const updatedCatalogTracks = tracks.filter((s) =>
          updatedTrackIds.includes(s.id)
        );
        const newPlayExpectation =
          calculateAveragePlayExpectation(updatedCatalogTracks);

        await updateCatalog(catalog.id, {
          ...catalog,
          trackIds: updatedTrackIds,
          playExpectation: newPlayExpectation,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Falha ao atualizar catálogo:', error);
    }
  };

  if (
    catalogsLoading ||
    artistsLoading ||
    distributorsLoading ||
    tracksLoading
  ) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!catalog || !artist || !distributor) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-slate-900  dark:text-slate-200 dark:hover:text-slate-500"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </button>
        <button
          onClick={handleEdit}
          className="flex items-center rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800"
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar Catálogo
        </button>
      </div>

      {/* Catalog Info */}
      <Card>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-200">
              Artista
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-200">
              {artist.name}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-200">
              Distribuidora
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-200">
              {distributor.name}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-200">
              Porcentagem
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-200">
              {distributor.percentage}%
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-200">
              Média de Reproduções Diárias Esperadas
            </h3>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-200">
              {catalog.playExpectation.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Tracks */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold text-slate-900 dark:text-slate-200">
            <Music className="mr-2 h-5 w-5 text-purple-600" />
            Faixas
          </h2>
          <button
            onClick={handleAddTrack}
            className="flex items-center rounded-lg bg-purple-900 px-3 py-2 text-sm font-medium text-white hover:bg-purple-800"
            disabled={availableTracks.length === 0}
          >
            <Plus className="mr-1 h-4 w-4" />
            Adicionar Faixa
          </button>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {catalogTracks.map((track) => (
            <div key={track.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-200">
                    {track.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-200">
                    Duração: {track.duration}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-200">
                    Lançamento:
                    {new Date(track.releaseDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-200">
                    Reproduções Diárias Esperadas:{' '}
                    {track.expectationDailyPlays.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteTrack(track.id)}
                    className="rounded p-1 text-red-600 hover:bg-red-50"
                    title="Remover Música"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {catalogTracks.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-600 dark:text-slate-200">
              Nenhuma faixa neste catálogo
            </p>
          )}
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'catalog' ? 'Editar Catálogo' : 'Adicionar Música'}
      >
        {modalType === 'catalog' ? (
          <CatalogForm
            catalog={catalog}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <CatalogTrackForm
            availableTracks={availableTracks}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default CatalogDetail;
