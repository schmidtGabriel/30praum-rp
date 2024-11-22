import React, { useState } from 'react';
import { Artist } from '../../types';
import { useArtists } from '../../hooks/useArtists';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ArtistForm from './ArtistForm';
import { Loader2, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Artists = () => {
  const {
    artists,
    isLoading,
    error,
    createArtist,
    updateArtist,
    deleteArtist,
  } = useArtists();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const navigate = useNavigate();

  const columns = [{ key: 'name', label: 'Name' }];

  const handleAdd = () => {
    setSelectedArtist(null);
    setIsModalOpen(true);
  };

  const handleEdit = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
  };

  const handleDelete = async (artist: Artist) => {
    if (window.confirm('Tem certeza que deseja deletar esse artista?')) {
      await deleteArtist(artist.id);
    }
  };

  const handleView = (artist: Artist) => {
    navigate(`/artists/${artist.id}`);
  };

  const handleSubmit = async (data: Omit<Artist, 'id'>) => {
    try {
      if (selectedArtist) {
        await updateArtist(selectedArtist.id, data);
      } else {
        await createArtist(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save artist:', error);
    }
  };

  if (error) {
    return <div className="text-red-600">Error: {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={artists}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        title="Artistas"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedArtist ? 'Editar Artista' : 'Criar Artista'}
      >
        <ArtistForm
          artist={selectedArtist}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default Artists;
