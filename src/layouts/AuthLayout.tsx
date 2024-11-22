import React from 'react';
import { Outlet } from 'react-router-dom';
import { Boxes, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      <div className="absolute right-4 top-4">
        <button
          onClick={toggleTheme}
          className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-white/10 p-3 shadow-lg backdrop-blur-sm">
              <Boxes className="h-8 w-8 text-white" />
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;