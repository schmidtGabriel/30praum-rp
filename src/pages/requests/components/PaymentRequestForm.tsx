import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useArtists } from '../../../hooks/useArtists';
import { useProjects } from '../../../hooks/useProjects';
import { useSubProjectItems } from '../../../hooks/useSubProjectItems';
import { useBeneficiary } from '../../../hooks/useBeneficiary';
import { PaymentRequest } from '../../../types';
import BeneficiaryDialog from '../../../components/BeneficiaryDialog';
import ProjectCostSelector from '../../../components/ProjectCostSelector';
import SaveButton from '../../../components/SaveButton';
import CancelButton from '../../../components/CancelButton';

interface PaymentRequestFormProps {
  initialData?: PaymentRequest;
  onSubmit: (data: Partial<PaymentRequest>) => Promise<void>;
  onCancel: () => void;
}

const PaymentRequestForm: React.FC<PaymentRequestFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { artists } = useArtists();
  const { projects } = useProjects();
  const { subProjectItems } = useSubProjectItems();
  const { beneficiaries, createBeneficiary, isLoading: beneficiariesLoading } = useBeneficiary();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedItems, setSelectedItems] = useState<string[]>(
    initialData?.subProjectItemId ? [initialData.subProjectItemId] : []
  );

  const [formData, setFormData] = useState({
    beneficiaryId: '',
    description: '',
    paymentDate: new Date().toISOString().split('T')[0],
    competenceDate: new Date().toISOString().split('T')[0],
    artistId: '',
    projectId: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        beneficiaryId: initialData.beneficiaryId,
        description: initialData.description,
        paymentDate: initialData.paymentDate.split('T')[0],
        competenceDate: initialData.competenceDate.split('T')[0],
        artistId: initialData.artistId,
        projectId: initialData.projectId,
      });
      if (initialData.subProjectItemId) {
        setSelectedItems([initialData.subProjectItemId]);
      }
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.artistId) newErrors.artistId = 'Selecione um artista';
    if (!formData.projectId) newErrors.projectId = 'Selecione um projeto';
    if (!formData.beneficiaryId) newErrors.beneficiaryId = 'Selecione um beneficiário';
    if (!formData.description) newErrors.description = 'Descrição é obrigatória';
    if (!formData.paymentDate) newErrors.paymentDate = 'Data de pagamento é obrigatória';
    if (!formData.competenceDate) newErrors.competenceDate = 'Data de competência é obrigatória';
    if (selectedItems.length === 0) newErrors.items = 'Selecione pelo menos um item';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddBeneficiary = async (
    beneficiary: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await createBeneficiary(beneficiary);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to add beneficiary:', error);
    }
  };

  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = subProjectItems.find((i) => i.id === itemId);
      return total + (item?.cost || 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const totalAmount = calculateTotalAmount();

      await onSubmit({
        ...formData,
        amount: totalAmount,
        subProjectItemId: selectedItems[0],
      });
    } catch (error) {
      console.error('Failed to submit payment request:', error);
      setErrors({ submit: 'Falha ao salvar a solicitação. Tente novamente.' });
    }
  };

  const artistProjects = projects.filter(
    (project) => project.artistId === formData.artistId
  );

  const projectItems = subProjectItems.filter((item) => {
    const subproject = item.subprojectId;
    return subproject && projects.some((p) => p.id === formData.projectId);
  });

  const handleArtistChange = (artistId: string) => {
    setFormData((prev) => ({
      ...prev,
      artistId,
      projectId: '',
    }));
    setSelectedItems([]);
    setErrors((prev) => ({ ...prev, artistId: '', projectId: '' }));
  };

  const handleProjectChange = (projectId: string) => {
    setFormData((prev) => ({
      ...prev,
      projectId,
    }));
    setSelectedItems([]);
    setErrors((prev) => ({ ...prev, projectId: '', items: '' }));
  };

  if (beneficiariesLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Artist Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Artista
          </label>
          <select
            value={formData.artistId}
            onChange={(e) => handleArtistChange(e.target.value)}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.artistId
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300 focus:border-purple-500 focus:ring-purple-500'
            } dark:border-slate-600 dark:bg-slate-700 dark:text-white`}
            required
          >
            <option value="">Selecione um artista</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
          {errors.artistId && (
            <p className="mt-1 text-sm text-red-600">{errors.artistId}</p>
          )}
        </div>

        {/* Project Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Projeto
          </label>
          <select
            value={formData.projectId}
            onChange={(e) => handleProjectChange(e.target.value)}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.projectId
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300 focus:border-purple-500 focus:ring-purple-500'
            } dark:border-slate-600 dark:bg-slate-700 dark:text-white`}
            required
            disabled={!formData.artistId}
          >
            <option value="">Selecione um projeto</option>
            {artistProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>
          )}
        </div>

        {/* Cost Selection */}
        {formData.projectId && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Custos
            </label>
            <div className="mt-2">
              <ProjectCostSelector
                items={projectItems}
                selectedItems={selectedItems}
                onItemSelect={setSelectedItems}
              />
            </div>
            {errors.items && (
              <p className="mt-1 text-sm text-red-600">{errors.items}</p>
            )}
          </div>
        )}

        {/* Beneficiary Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Beneficiário
            </label>
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center rounded-lg bg-purple-900 px-2 py-1 text-sm font-medium text-white hover:bg-purple-800"
            >
              <Plus className="mr-1 h-4 w-4" />
              Adicionar Novo
            </button>
          </div>
          <select
            value={formData.beneficiaryId}
            onChange={(e) =>
              setFormData({ ...formData, beneficiaryId: e.target.value })
            }
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.beneficiaryId
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300 focus:border-purple-500 focus:ring-purple-500'
            } dark:border-slate-600 dark:bg-slate-700 dark:text-white`}
            required
          >
            <option value="">Selecione um beneficiário</option>
            {beneficiaries.map((beneficiary) => (
              <option key={beneficiary.id} value={beneficiary.id}>
                {beneficiary.fullName}
              </option>
            ))}
          </select>
          {errors.beneficiaryId && (
            <p className="mt-1 text-sm text-red-600">{errors.beneficiaryId}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors.description
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300 focus:border-purple-500 focus:ring-purple-500'
            } dark:border-slate-600 dark:bg-slate-700 dark:text-white`}
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Dates */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Data de Pagamento
            </label>
            <input
              type="date"
              value={formData.paymentDate}
              onChange={(e) =>
                setFormData({ ...formData, paymentDate: e.target.value })
              }
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.paymentDate
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-purple-500 focus:ring-purple-500'
              } dark:border-slate-600 dark:bg-slate-700 dark:text-white`}
              required
            />
            {errors.paymentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Data de Competência
            </label>
            <input
              type="date"
              value={formData.competenceDate}
              onChange={(e) =>
                setFormData({ ...formData, competenceDate: e.target.value })
              }
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.competenceDate
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-purple-500 focus:ring-purple-500'
              } dark:border-slate-600 dark:bg-slate-700 dark:text-white`}
              required
            />
            {errors.competenceDate && (
              <p className="mt-1 text-sm text-red-600">{errors.competenceDate}</p>
            )}
          </div>
        </div>

        {errors.submit && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <CancelButton onClick={onCancel} />
          <SaveButton disabled={selectedItems.length === 0} />
        </div>
      </form>

      <BeneficiaryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleAddBeneficiary}
      />
    </div>
  );
};

export default PaymentRequestForm;