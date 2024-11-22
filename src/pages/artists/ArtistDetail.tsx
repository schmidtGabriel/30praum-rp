import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Music2,
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  ArrowLeft,
  Disc3,
  Edit2,
} from 'lucide-react';
import { Artist, Project, Track, Catalog } from '../../types';
import { useArtists } from '../../hooks/useArtists';
import { useProjects } from '../../hooks/useProjects';
import { useTracks } from '../../hooks/useTracks';
import { useCatalogs } from '../../hooks/useCatalogs';
import { useDistributors } from '../../hooks/useDistributors';
import Modal from '../../components/Modal';
import ProjectForm from '../projects/ProjectForm';
import TrackForm from '../tracks/TrackForm';
import CatalogForm from '../catalogs/CatalogForm';
import ArtistForm from './ArtistForm';
import ActionButton from '../../components/ActionButton';
import Card from '../../components/Card';

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { artists, isLoading: artistsLoading, updateArtist } = useArtists();
  const { projects, createProject, updateProject, deleteProject } =
    useProjects();
  const { tracks, createTrack, updateTrack, deleteTrack } = useTracks();
  const { catalogs, createCatalog, updateCatalog, deleteCatalog } =
    useCatalogs();
  const { distributors } = useDistributors();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    'project' | 'track' | 'catalog' | 'artist' | null
  >(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    if (!artistsLoading) {
      const currentArtist = artists.find((a) => a.id === id);
      setArtist(currentArtist || null);
    }
  }, [id, artists, artistsLoading]);

  const artistProjects = projects.filter((p) => p.artistId === id);
  const artistTracks = tracks.filter((s) => s.artistId === id);
  const artistCatalogs = catalogs.filter((c) => c.artistId === id);

  const handleAdd = (type: 'project' | 'track' | 'catalog' | 'artist') => {
    setModalType(type);
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (
    item: any,
    type: 'project' | 'track' | 'catalog' | 'artist'
  ) => {
    setModalType(type);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (
    item: any,
    type: 'project' | 'track' | 'catalog'
  ) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;

    switch (type) {
      case 'project':
        await deleteProject(item.id);
        break;
      case 'track':
        await deleteTrack(item.id);
        break;
      case 'catalog':
        await deleteCatalog(item.id);
        break;
    }
  };

  const handleView = (item: Project | Catalog) => {
    if ('type' in item) {
      navigate(`/projects/${item.id}`);
    } else {
      navigate(`/catalogs/${item.id}`);
    }
  };

  const handleSubmit = async (data: any) => {
    if (!modalType || !artist) return;

    try {
      const itemWithArtistId = { ...data, artistId: artist.id };

      if (selectedItem) {
        switch (modalType) {
          case 'project':
            await updateProject(selectedItem.id, itemWithArtistId);
            break;
          case 'track':
            await updateTrack(selectedItem.id, itemWithArtistId);
            break;
          case 'catalog':
            await updateCatalog(selectedItem.id, itemWithArtistId);
            break;
          case 'artist':
            await updateArtist(artist.id, data);
            break;
        }
      } else {
        switch (modalType) {
          case 'project':
            await createProject(itemWithArtistId);
            break;
          case 'track':
            await createTrack(itemWithArtistId);
            break;
          case 'catalog':
            await createCatalog(itemWithArtistId);
            break;
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Falha ao salvar item:', error);
    }
  };

  if (artistsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!artist) {
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
          onClick={() => handleEdit(artist, 'artist')}
          className="flex items-center rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800"
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </button>
      </div>

      {/* Artist Info */}
      <Card>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-200">
          {artist.name}
        </h1>
        <p className="mt-2 text-slate-600  dark:text-slate-200">{artist.bio}</p>
      </Card>

      {/* Projects */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold text-slate-900  dark:text-slate-200">
            <FolderKanban className="mr-2 h-5 w-5 text-purple-600" />
            Projetos
          </h2>
          <button
            onClick={() => handleAdd('project')}
            className="flex items-center rounded-lg bg-purple-900 px-3 py-2 text-sm font-medium text-white hover:bg-purple-800"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Projeto
          </button>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {artistProjects.map((project) => (
            <div key={project.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-200">
                    {project.title} • {project.type}
                  </h3>
                  <p className="text-sm text-slate-600  dark:text-slate-200">
                    Data de Lançamento:{' '}
                    {new Date(project.releaseDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ActionButton
                    onClick={() => handleView(project)}
                    className="p-1 rounded"
                    variant={'transparent'}
                    title="Editar"
                  >
                    <Eye className="h-4 w-4" />
                  </ActionButton>

                  <ActionButton
                    onClick={() => handleEdit(project, 'project')}
                    className="p-1 rounded"
                    variant={'transparent'}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </ActionButton>

                  <ActionButton
                    onClick={() => handleDelete(project, 'project')}
                    className="rounded p-1 text-red-600 bg-transparent transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 dark:bg-transparent"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </ActionButton>
                </div>
              </div>
            </div>
          ))}
          {artistProjects.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-600  dark:text-slate-200">
              Nenhum projeto encontrado
            </p>
          )}
        </div>
      </Card>

      {/* Tracks */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold text-slate-900  dark:text-slate-200">
            <Music2 className="mr-2 h-5 w-5 text-purple-600" />
            Faixas
          </h2>
          <button
            onClick={() => handleAdd('track')}
            className="flex items-center rounded-lg bg-purple-900 px-3 py-2 text-sm font-medium text-white hover:bg-purple-800"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Faixa
          </button>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {artistTracks.map((track) => (
            <div key={track.id} className="py-4">
              <div className="flex items-center justify-between ">
                <div className="fle flex-col gap-2">
                  <h3 className="font-medium text-slate-900  dark:text-slate-200">
                    {track.title}
                  </h3>
                  <p className="text-sm text-slate-600  dark:text-slate-200">
                    Duração: {track.duration}
                  </p>
                  <div className="text-sm text-slate-600  dark:text-slate-200">
                    Reproduções Diárias Esperadas:{' '}
                    {typeof track.expectationDailyPlays === 'number'
                      ? track.expectationDailyPlays.toLocaleString()
                      : '0'}
                  </div>
                  <div className="text-sm text-slate-600  dark:text-slate-200">
                    Lançamento:{' '}
                    {new Date(track.releaseDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ActionButton
                    onClick={() => handleEdit(track, 'track')}
                    className="rounded p-1"
                    variant={'transparent'}
                    title="Editar Música"
                  >
                    <Edit className="h-4 w-4" />
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleDelete(track, 'track')}
                    className="rounded p-1 text-red-600 bg-transparent transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 dark:bg-transparent"
                    title="Excluir Música"
                  >
                    <Trash2 className="h-4 w-4" />
                  </ActionButton>
                </div>
              </div>
            </div>
          ))}
          {artistTracks.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-600  dark:text-slate-200">
              Nenhuma música encontrada
            </p>
          )}
        </div>
      </Card>

      {/* Catalogs */}
      <Card className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold text-slate-900  dark:text-slate-200">
            <Disc3 className="mr-2 h-5 w-5 text-purple-600" />
            Catálogos
          </h2>
          <button
            onClick={() => handleAdd('catalog')}
            className="flex items-center rounded-lg bg-purple-900 px-3 py-2 text-sm font-medium text-white hover:bg-purple-800"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Catálogo
          </button>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {artistCatalogs.map((catalog) => {
            const distributor = distributors.find(
              (p) => p.id === catalog.distributorId
            );

            return (
              <div key={catalog.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900  dark:text-slate-200">
                      {distributor?.name || 'Provedor Desconhecido'}
                    </h3>
                    <p className="text-sm text-slate-600  dark:text-slate-200">
                      Porcentagem: {distributor?.percentage}%
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-2">
                      <ActionButton
                        onClick={() => handleView(catalog)}
                        className="rounded p-1"
                        variant={'transparent'}
                        title="Ver Catálogo"
                      >
                        <Eye className="h-4 w-4" />
                      </ActionButton>

                      <ActionButton
                        onClick={() => handleEdit(catalog, 'catalog')}
                        className="rounded p-1"
                        variant={'transparent'}
                        title="Editar Catálogo"
                      >
                        <Edit className="h-4 w-4" />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleDelete(catalog, 'catalog')}
                        className="rounded p-1 text-red-600 bg-transparent transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 dark:bg-transparent"
                        title="Excluir Catálogo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </ActionButton>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {artistCatalogs.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-600  dark:text-slate-200">
              Nenhum catálogo encontrado
            </p>
          )}
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType
            ? `${selectedItem ? 'Editar' : 'Adicionar'} ${
                modalType === 'project'
                  ? 'Projeto'
                  : modalType === 'track'
                  ? 'Faixa'
                  : modalType === 'catalog'
                  ? 'Catálogo'
                  : 'Artista'
              }`
            : ''
        }
      >
        {modalType === 'project' && (
          <ProjectForm
            project={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            preselectedArtistId={artist.id}
          />
        )}
        {modalType === 'track' && (
          <TrackForm
            track={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            preselectedArtistId={artist.id}
          />
        )}
        {modalType === 'catalog' && (
          <CatalogForm
            catalog={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            preselectedArtistId={artist.id}
          />
        )}
        {modalType === 'artist' && (
          <ArtistForm
            artist={artist}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ArtistDetail;
