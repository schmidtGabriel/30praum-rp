import React from 'react';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import ActionButton from './ActionButton';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
  onAdd: () => void;
  title: string;
  renderActions?: (item: any) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
  onView,
  title,
  renderActions,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
          {title}
        </h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center justify-center rounded-lg bg-purple-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-800 dark:hover:bg-purple-700 dark:focus:ring-offset-slate-800"
          >
            <Plus className="h-4 w-4" />
            <span className="ml-2">Novo</span>
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-200"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-200"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
              >
                {columns.map((column) => (
                  <td
                    key={`${item.id}-${column.key}`}
                    className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300"
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  {renderActions ? (
                    renderActions(item)
                  ) : (
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <ActionButton
                          onClick={() => onView(item)}
                          className="p-1 rounded"
                          variant={'transparent'}
                          title="Editar"
                        >
                          <Eye className="h-4 w-4" />
                        </ActionButton>
                      )}
                      {onEdit && (
                        <ActionButton
                          onClick={() => onEdit(item)}
                          className="p-1 rounded"
                          variant={'transparent'}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </ActionButton>
                      )}
                      {onDelete && (
                        <ActionButton
                          onClick={() => onDelete(item)}
                          className="rounded p-1 text-red-600 bg-transparent transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50 dark:bg-transparent"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </ActionButton>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
