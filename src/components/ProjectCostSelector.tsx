import React from 'react';
import { SubProjectItem } from '../types';

interface ProjectCostSelectorProps {
  items: SubProjectItem[];
  selectedItems: string[];
  onItemSelect: (itemIds: string[]) => void;
}

const ProjectCostSelector: React.FC<ProjectCostSelectorProps> = ({
  items,
  selectedItems,
  onItemSelect,
}) => {
  const handleItemToggle = (itemId: string) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    onItemSelect(newSelection);
  };

  const calculateTotal = () => {
    return items
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.cost, 0);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-5 gap-4 border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="col-span-2 font-medium">Item</div>
          <div className="text-right font-medium">Unit Cost</div>
          <div className="text-right font-medium">Total</div>
          <div className="text-center font-medium">Select</div>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {items.map(item => (
            <div key={item.id} className="grid grid-cols-5 gap-4 p-4">
              <div className="col-span-2">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {item.description}
                </div>
              </div>
              <div className="text-right">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(item.cost)}
              </div>
              <div className="text-right">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(item.cost)}
              </div>
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleItemToggle(item.id)}
                  className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 dark:border-slate-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <div className="text-lg font-semibold">
          Total:{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(calculateTotal())}
        </div>
      </div>
    </div>
  );
};

export default ProjectCostSelector;