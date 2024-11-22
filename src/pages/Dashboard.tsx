import React from 'react';
import { useArtists } from '../hooks/useArtists';
import { useTracks } from '../hooks/useTracks';
import { useProjects } from '../hooks/useProjects';
import { useCatalogs } from '../hooks/useCatalogs';
import { useDistributors } from '../hooks/useDistributors';
import {
  Users,
  Music2,
  FolderKanban,
  Disc3,
  ArrowUp,
  ArrowDown,
  Loader2,
  Percent,
} from 'lucide-react';

const Dashboard = () => {
  const { artists, isLoading: artistsLoading } = useArtists();
  const { tracks, isLoading: tracksLoading } = useTracks();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { catalogs, isLoading: catalogsLoading } = useCatalogs();
  const { distributors, isLoading: distributorsLoading } = useDistributors();

  const isLoading =
    artistsLoading ||
    tracksLoading ||
    projectsLoading ||
    catalogsLoading ||
    distributorsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
      </div>
    );
  }

  // Calculate total expected plays across all tracks
  const totalExpectedPlays = tracks.reduce(
    (sum, track) => sum + (track.expectationDailyPlays || 0),
    0
  );

  // Calculate average percentage across all distributors
  const averageDistributorPercentage =
    distributors.reduce((sum, distributor) => sum + distributor.percentage, 0) /
    (distributors.length || 1);

  const stats = [
    {
      title: 'Total de Artistas',
      value: artists.length.toString(),
      change: '+12.3%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Total de Músicas',
      value: tracks.length.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: Music2,
    },
    {
      title: 'Projetos Ativos',
      value: projects.length.toString(),
      change: '+23.1%',
      trend: 'up',
      icon: FolderKanban,
    },
    {
      title: 'Catálogos Ativos',
      value: catalogs.length.toString(),
      change: '+15.4%',
      trend: 'up',
      icon: Disc3,
    },
  ];

  const insights = [
    {
      title: 'Reproduções Diárias Esperadas',
      value: totalExpectedPlays.toLocaleString(),
      icon: Music2,
      description: 'Total de reproduções diárias esperadas em todas as músicas',
    },
    {
      title: 'Média de Participação dos Provedores',
      value: `${averageDistributorPercentage.toFixed(1)}%`,
      icon: Percent,
      description: 'Porcentagem média entre todos os provedores',
    },
    {
      title: 'Músicas por Artista',
      value: (tracks.length / (artists.length || 1)).toFixed(1),
      icon: Users,
      description: 'Média de músicas por artista',
    },
    {
      title: 'Projetos por Artista',
      value: (projects.length / (artists.length || 1)).toFixed(1),
      icon: FolderKanban,
      description: 'Média de projetos por artista',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                <stat.icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.trend === 'up' ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`ml-2 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.change}
              </span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                em relação ao mês anterior
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {insight.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {insight.description}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                <insight.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {insight.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Atividades Recentes
        </h3>
        <div className="mt-6 space-y-4">
          {[
            {
              title: 'Novo Artista Adicionado',
              description: 'Um novo artista foi adicionado ao sistema',
              time: '2 horas atrás',
              icon: Users,
            },
            {
              title: 'Projeto Atualizado',
              description: 'Detalhes do projeto foram modificados',
              time: '4 horas atrás',
              icon: FolderKanban,
            },
            {
              title: 'Novas Músicas Adicionadas',
              description: 'Várias músicas foram adicionadas a um catálogo',
              time: '6 horas atrás',
              icon: Music2,
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                  <activity.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {activity.description}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
