import React, { useState } from 'react';
import { Distributor } from '../../types';
import { useDistributors } from '../../hooks/useDistributors';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import DistributorForm from './DistributorForm';
import { Loader2 } from 'lucide-react';

const Distributors = () => {
  const {
    distributors,
    isLoading,
    error,
    createDistributor,
    updateDistributor,
    deleteDistributor,
  } = useDistributors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] =
    useState<Distributor | null>(null);

  const columns = [
    { key: 'name', label: 'Name' },
    {
      key: 'percentage',
      label: 'Percentage',
      render: (value: number) => `${value}%`,
    },
  ];

  const handleAdd = () => {
    setSelectedDistributor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (distributor: Distributor) => {
    setSelectedDistributor(distributor);
    setIsModalOpen(true);
  };

  const handleDelete = async (distributor: Distributor) => {
    if (window.confirm('Tem certeza que deseja deletar esse provedor?')) {
      await deleteDistributor(distributor.id);
    }
  };

  const handleSubmit = async (data: Omit<Distributor, 'id'>) => {
    try {
      if (selectedDistributor) {
        await updateDistributor(selectedDistributor.id, data);
      } else {
        await createDistributor(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save distributor:', error);
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
        data={distributors}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Distribuidora"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDistributor ? 'Edit Distribuidora' : 'Add Distribuidora'}
      >
        <DistributorForm
          distributor={selectedDistributor}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default Distributors;
