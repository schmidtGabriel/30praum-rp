import React, { useState, useEffect } from 'react';
import { Distributor } from '../../types';
import CancelButton from '../../components/CancelButton';
import SaveButton from '../../components/SaveButton';

interface DistributorFormProps {
  distributor?: Distributor | null;
  onSubmit: (data: Omit<Distributor, 'id'>) => void;
  onCancel: () => void;
}

const DistributorForm: React.FC<DistributorFormProps> = ({
  distributor,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    percentage: 0,
  });

  useEffect(() => {
    if (distributor) {
      setFormData({
        name: distributor.name,
        percentage: distributor.percentage,
      });
    } else {
      // Reset form when adding new distributor
      setFormData({
        name: '',
        percentage: 0,
      });
    }
  }, [distributor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Percentage
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="number"
            value={formData.percentage}
            onChange={(e) =>
              setFormData({
                ...formData,
                percentage: parseFloat(e.target.value),
              })
            }
            min="0"
            max="100"
            step="0.01"
            className="block w-full rounded-md border border-slate-300 pl-3 pr-12 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            required
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-slate-500 sm:text-sm">%</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <CancelButton onClick={onCancel} />
        <SaveButton />
      </div>
    </form>
  );
};

export default DistributorForm;
