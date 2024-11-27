import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[90%] overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="[&_input]:border-slate-200 [&_input]:bg-white [&_input]:text-slate-900 [&_input]:placeholder-slate-400 [&_input]:transition-colors [&_input]:focus:border-purple-500 [&_input]:dark:border-slate-600 [&_input]:dark:bg-slate-700 [&_input]:dark:text-white [&_input]:dark:placeholder-slate-400 [&_label]:text-slate-700 [&_label]:dark:text-slate-200 [&_select]:border-slate-200 [&_select]:bg-white [&_select]:text-slate-900 [&_select]:transition-colors [&_select]:focus:border-purple-500 [&_select]:dark:border-slate-600 [&_select]:dark:bg-slate-700 [&_select]:dark:text-white [&_textarea]:border-slate-200 [&_textarea]:bg-white [&_textarea]:text-slate-900 [&_textarea]:placeholder-slate-400 [&_textarea]:transition-colors [&_textarea]:focus:border-purple-500 [&_textarea]:dark:border-slate-600 [&_textarea]:dark:bg-slate-700 [&_textarea]:dark:text-white [&_textarea]:dark:placeholder-slate-400">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
