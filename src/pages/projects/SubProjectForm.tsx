import React, { useEffect, useState } from "react";
import CancelButton from "../../components/CancelButton";
import SaveButton from "../../components/SaveButton";
import { SubProject } from "../../types";

interface SubProjectFormProps {
  subProject?: SubProject | null;
  onSubmit: (data: Omit<SubProject, "id">) => void;
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
    title: "",
    description: "",
    budget: "",
    cost: "0",
    projectId: projectId,
  });

  useEffect(() => {
    if (subProject) {
      setFormData({
        title: subProject.title,
        description: subProject.description || "",
        budget: subProject.budget?.toString() || "",
        cost: subProject.cost?.toString() || "0",
        projectId: subProject.projectId,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        budget: "",
        cost: "0",
        projectId: projectId,
      });
    }
  }, [subProject, projectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      budget: parseFloat(formData.budget) || undefined,
      cost: parseFloat(formData.cost) || 0,
    });
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
          Budget (Optional)
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
              $
            </span>
          </div>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
            min="0"
            step="0.01"
            className="block w-full rounded-md border border-slate-300 pl-7 pr-12 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>

      {/* <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Cost (Calculated from Items)
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
            disabled
            className="block w-full rounded-md border border-slate-300 bg-slate-50 pl-7 pr-12 py-2 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400"
          />
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          This value is automatically calculated from the sum of all items
        </p>
      </div> */}

      <div className="flex justify-end gap-3">
        <CancelButton onClick={onCancel} />
        <SaveButton />
      </div>
    </form>
  );
};

export default SubProjectForm;
