import React from 'react';
import { cn } from '../utils/cn';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'paid';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
    paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
  };

  const labels = {
    pending: 'Pendente',
    approved: 'Aprovado',
    rejected: 'Negado',
    paid: 'Pago',
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      styles[status]
    )}>
      {labels[status]}
    </span>
  );
};

export default StatusBadge;