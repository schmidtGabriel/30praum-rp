import React, { useState, useEffect } from 'react';
import { SubProjectItem } from '../../types';
import SaveButton from '../../components/SaveButton';
import CancelButton from '../../components/CancelButton';

interface SubProjectItemFormProps {
  item?: SubProjectItem | null;
  subprojectId: string;
  onSubmit: (data: Omit<SubProjectItem, 'id'>) => void;
  onCancel: () => void;
}

const SubProjectItemForm: React.FC<SubProjectItemFormProps> = ({
  item,
  subprojectId,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cost: 0,
    subprojectId: subprojectId,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        cost: item.cost,
        subprojectId: item.subprojectId,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        cost: 0,
        subprojectId: subprojectId,
      });
    }
  }, [item, subprojectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Cost
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
              $
            </span>
          </div>
          <input
            type="number"
            value={formData.cost}
            onChange={(e) =>
              setFormData({ ...formData, cost: parseFloat(e.target.value) })
            }
            min="0"
            step="0.01"
            className="block w-full rounded-md border border-slate-300 pl-7 pr-12 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <CancelButton onClick={onCancel} />
        <SaveButton />
      </div>
    </form>
  );
};

export default SubProjectItemForm;