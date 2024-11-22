import React, { useState } from 'react';
import { User } from '../../types';
import { useUsers } from '../../hooks/useUsers';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import UserForm from './UserForm';
import { Loader2 } from 'lucide-react';

const Users = () => {
  const { users, isLoading, error, createUser, updateUser, deleteUser } =
    useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'lastLogin', label: 'Last Login' },
  ];

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm('Tem certeza que deseja deletar esse usuário?')) {
      await deleteUser(user.id);
    }
  };

  const handleSubmit = async (data: Omit<User, 'id'>) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, data);
      } else {
        await createUser(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save user:', error);
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
        data={users}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Usuários"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Add User'}
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default Users;
