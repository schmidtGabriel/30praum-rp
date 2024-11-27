import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Loader2,
  DollarSign,
} from 'lucide-react';
import { SubProject, SubProjectItem } from '../../types';
import { useSubProjects } from '../../hooks/useSubProjects';
import { useSubProjectItems } from '../../hooks/useSubProjectItems';
import Modal from '../../components/Modal';
import SubProjectForm from './SubProjectForm';
import SubProjectItemForm from './SubProjectItemForm';
import Card from '../../components/Card';
import ActionButton from '../../components/ActionButton';
import formatCurrency from '../../helpers/formatCurrency';

const SubProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    subProjects,
    updateSubProject,
    isLoading: subProjectsLoading,
  } = useSubProjects();
  const {
    subProjectItems,
    createSubProjectItem,
    updateSubProjectItem,
    deleteSubProjectItem,
    isLoading: itemsLoading,
  } = useSubProjectItems();

  const [subProject, setSubProject] = useState<SubProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SubProjectItem | null>(null);
  const [modalType, setModalType] = useState<'item' | 'subproject'>('item');

  // Calculate total cost from items
  const calculateTotalCost = (subprojectId: string) => {
    return subProjectItems
      .filter((item) => item.subprojectId === subprojectId)
      .reduce((sum, item) => sum + (item.cost || 0), 0);
  };

  // Update subproject cost when items change
  useEffect(() => {
    const updateSubProjectCost = async () => {
      if (subProject && id) {
        const totalCost = calculateTotalCost(id);
        if (totalCost !== subProject.cost) {
          await updateSubProject(id, { ...subProject, cost: totalCost });
        }
      }
    };
    updateSubProjectCost();
  }, [subProjectItems, subProject, id]);

  useEffect(() => {
    if (!subProjectsLoading && id) {
      const currentSubProject = subProjects.find((sp) => sp.id === id);
      setSubProject(currentSubProject || null);
    }
  }, [id, subProjects, subProjectsLoading]);

  const projectSubProjectItems = subProjectItems.filter(
    (item) => item.subprojectId === id
  );

  const handleEditSubProject = () => {
    setModalType('subproject');
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setModalType('item');
    setIsModalOpen(true);
  };

  const handleEditItem = (item: SubProjectItem) => {
    setSelectedItem(item);
    setModalType('item');
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (item: SubProjectItem) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteSubProjectItem(item.id);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (modalType === 'item') {
        if (selectedItem) {
          await updateSubProjectItem(selectedItem.id, data);
        } else {
          await createSubProjectItem(data);
        }
      } else if (modalType === 'subproject' && subProject) {
        // Preserve the current cost when updating subproject
        await updateSubProject(subProject.id, {
          ...data,
          cost: subProject.cost,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  if (subProjectsLoading || itemsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!subProject) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Project
        </button>
        <ActionButton
          onClick={handleEditSubProject}
          className="flex items-center"
          leftIcon={<Edit className="h-4 w-4" />}
        >
          Edit Sub-Project
        </ActionButton>
      </div>

      {/* Sub-Project Info */}
      <Card>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{subProject.title}</h1>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-900 dark:bg-purple-900/20 dark:text-purple-400">
            {subProject.type}
          </span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Cost (from Items)
            </p>
            <p className="mt-1 font-medium">
              {formatCurrency(subProject.cost)}
            </p>
          </div>
          {subProject.budget && (
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Budget
              </p>
              <p className="mt-1 font-medium">
                {formatCurrency(subProject.budget)}
              </p>
            </div>
          )}
        </div>
        {subProject.description && (
          <div className="mt-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Description
            </p>
            <p className="mt-1">{subProject.description}</p>
          </div>
        )}
      </Card>

      {/* Items */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold">
            <DollarSign className="mr-2 h-5 w-5 text-purple-600" />
            Custo
          </h2>
          <button
            onClick={handleAddItem}
            className="flex items-center rounded-lg bg-purple-900 px-3 py-2 text-sm font-medium text-white hover:bg-purple-800"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Custo
          </button>
        </div>
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
          {projectSubProjectItems.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Custo: {formatCurrency(item.cost)}
                  </p>
                  {item.description && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="rounded p-1 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                    title="Edit Item"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    title="Delete Item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {projectSubProjectItems.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-600 dark:text-slate-400">
              No items found
            </p>
          )}
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === 'item'
            ? `${selectedItem ? 'Edit' : 'Add'} Item`
            : 'Edit Sub-Project'
        }
      >
        {modalType === 'item' ? (
          <SubProjectItemForm
            item={selectedItem}
            subprojectId={id!}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <SubProjectForm
            subProject={subProject}
            projectId={subProject.projectId}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default SubProjectDetail;
