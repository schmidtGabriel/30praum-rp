import React, { useState, useEffect } from 'react';
import { SubProject } from '../../types';
import SaveButton from '../../components/SaveButton';
import CancelButton from '../../components/CancelButton';

interface SubProjectFormProps {
  subProject?: SubProject | null;
  onSubmit: (data: Omit<SubProject, 'id'>) => void;
  onCancel: () => void;
  projectId: string;
}

const SubProjectForm: React.FC<SubProjectFormProps> = ({
  subProject,
  onSubmit,
  onCancel,
  projectId,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    cost: 0,
    projectId: projectId,
  });

  useEffect(() => {
    if (subProject) {
      setFormData({
        title: subProject.title,
        type: subProject.type,
        cost: subProject.cost,
        projectId: subProject.projectId,
      });
    } else {
      setFormData({
        title: '',
        type: '',
        cost: 0,
        projectId: projectId,
      });
    }
  }, [subProject, projectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Type</label>
        <input
          type="text"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Cost</label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            value={formData.cost}
            onChange={(e) =>
              setFormData({ ...formData, cost: parseFloat(e.target.value) })
            }
            min="0"
            step="0.01"
            className="block w-full rounded-md border border-slate-300 pl-7 pr-12 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
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

export default SubProjectForm;
