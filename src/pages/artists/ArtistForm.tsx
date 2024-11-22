import React, { useState, useEffect } from 'react';
import { Artist } from '../../types';
import CancelButton from '../../components/CancelButton';
import SaveButton from '../../components/SaveButton';

interface ArtistFormProps {
  artist?: Artist | null;
  onSubmit: (data: Omit<Artist, 'id'>) => void;
  onCancel: () => void;
}

const ArtistForm: React.FC<ArtistFormProps> = ({
  artist,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name,
        bio: artist.bio,
      });
    }
  }, [artist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nome</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      <div className="flex justify-end gap-3">
        <CancelButton onClick={onCancel} />
        <SaveButton />
      </div>
    </form>
  );
};

export default ArtistForm;
