import { useState, useCallback, useEffect } from 'react';
import { User } from '../types';
import { usersService } from '../services/api';

interface UseUsersResult {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  createUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usersService.list();
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (user: Omit<User, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await usersService.create(user);
      await refreshUsers();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUsers]);

  const updateUser = useCallback(async (id: string, user: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      await usersService.update(id, user);
      await refreshUsers();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUsers]);

  const deleteUser = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await usersService.delete(id);
      await refreshUsers();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An error occurred'));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUsers]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers,
  };
}