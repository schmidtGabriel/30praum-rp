import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Boxes,
  Home,
  Users,
  Music2,
  DollarSign,
  LineChart,
  Library,
  Mic2,
  FolderKanban,
  CalendarClock,
  Wallet,
  Settings,
  Music,
  Disc3,
  Percent,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface MenuItem {
  icon: any;
  text: string;
  path: string;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

const DashboardLayout = () => {
  const { logout, currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuSections: MenuSection[] = [
    {
      items: [
        { icon: Home, text: 'Início', path: '/' },
        { icon: Users, text: 'Usuários', path: '/users' },
        { icon: Music2, text: 'Artistas', path: '/artists' },
      ],
    },
    {
      title: 'Projeções',
      items: [
        { icon: DollarSign, text: 'Faturamento', path: '/revenue-projections' },
        { icon: LineChart, text: 'Custos', path: '#' },
        { icon: Library, text: 'Catálogo', path: '/catalog-projections' },
        { icon: Mic2, text: 'Shows', path: '/concert-projections' },
        { icon: FolderKanban, text: 'Projetos', path: '/project-projections' },
      ],
    },
    {
      title: 'Orçamentos',
      items: [
        { icon: CalendarClock, text: 'Anual', path: '#' },
        { icon: Wallet, text: 'Projetos', path: '#' },
      ],
    },
    {
      title: 'Configurações',
      items: [
        { icon: FolderKanban, text: 'Projetos', path: '/projects' },
        { icon: Disc3, text: 'Catálogos', path: '/catalogs' },
        { icon: Music, text: 'Faixas', path: '/tracks' },
        { icon: Percent, text: 'Distribuidoras', path: '/distributors' },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg dark:bg-slate-800">
        <div className="flex h-16 items-center justify-center border-b border-slate-100 dark:border-slate-700">
          <Boxes className="h-8 w-8 text-purple-900 dark:text-purple-400" />
          <span className="ml-2 text-xl font-bold text-slate-800 dark:text-white">
            30praum
          </span>
        </div>
        <div className="flex h-[calc(100%-4rem)] flex-col">
          {/* Scrollable Menu */}
          <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      className={`flex items-center rounded-lg px-4 py-2 text-sm transition-colors ${
                        location.pathname === item.path
                          ? 'bg-purple-50 text-purple-900 dark:bg-purple-900/20 dark:text-purple-400'
                          : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900 dark:text-slate-300 dark:hover:bg-purple-900/20 dark:hover:text-purple-400'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="ml-3">{item.text}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Fixed User Profile Section */}
          <div className="border-t border-slate-100 bg-white px-4 py-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center space-x-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-white">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentUser?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center rounded-lg px-4 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6 dark:border-slate-700 dark:bg-slate-800">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">
            {menuSections
              .flatMap((section) => section.items)
              .find((item) => item.path === location.pathname)?.text ||
              'Início'}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-full bg-slate-100 p-2 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
              title={
                theme === 'dark'
                  ? 'Mudar para Modo Claro'
                  : 'Mudar para Modo Escuro'
              }
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              )}
            </button>
            <button className="rounded-full bg-slate-100 p-2 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">
              <Settings className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;