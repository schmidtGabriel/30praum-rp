import React, { useState } from 'react';
import { Track } from '../../types';
import { useTracks } from '../../hooks/useTracks';
import { useArtists } from '../../hooks/useArtists';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import TrackForm from './TrackForm';
import { Loader2 } from 'lucide-react';

const Tracks = () => {
  const {
    tracks,
    isLoading: tracksLoading,
    error: tracksError,
    createTrack,
    updateTrack,
    deleteTrack,
  } = useTracks();
  const { artists, isLoading: artistsLoading } = useArtists();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'artistId',
      label: 'Artist',
      render: (value: string) =>
        artists.find((a) => a.id === value)?.name || 'Unknown',
    },
    { key: 'releaseDate', label: 'Release Date' },
    { key: 'duration', label: 'Duration' },
    {
      key: 'expectationDailyPlays',
      label: 'Expected Daily Plays',
      render: (value: number) => value.toLocaleString(),
    },
  ];

  const handleAdd = () => {
    setSelectedTrack(null);
    setIsModalOpen(true);
  };

  const handleEdit = (track: Track) => {
    setSelectedTrack(track);
    setIsModalOpen(true);
  };

  const handleDelete = async (track: Track) => {
    if (window.confirm('Tem certeza que deseja deletar esse faixa?')) {
      await deleteTrack(track.id);
    }
  };

  const handleSubmit = async (data: Omit<Track, 'id'>) => {
    try {
      if (selectedTrack) {
        await updateTrack(selectedTrack.id, data);
      } else {
        await createTrack(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save track:', error);
    }
  };

  if (tracksError) {
    return <div className="text-red-600">Error: {tracksError.message}</div>;
  }

  const isLoading = tracksLoading || artistsLoading;

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
        data={tracks}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Faixas"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTrack ? 'Edit Track' : 'Add Track'}
      >
        <TrackForm
          track={selectedTrack}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default Tracks;
