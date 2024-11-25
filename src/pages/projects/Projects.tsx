import React, { useState } from 'react';
import { Project } from '../../types';
import { useProjects } from '../../hooks/useProjects';
import { useArtists } from '../../hooks/useArtists';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ProjectForm from './ProjectForm';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const {
    projects,
    isLoading: projectsLoading,
    error: projectsError,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();
  const { artists, isLoading: artistsLoading } = useArtists();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  const columns = [
    { key: 'title', label: 'Título' },
    {
      key: 'artistId',
      label: 'Artista',
      render: (value: string) =>
        artists.find((a) => a.id === value)?.name || 'Unknown',
    },
    { key: 'type', label: 'Tipo' },
    { key: 'releaseDate', label: 'Data Lançamento' },
  ];

  const handleAdd = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (window.confirm('Tem certeza que deseja deletar esse projeto?')) {
      await deleteProject(project.id);
    }
  };

  const handleView = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  const handleSubmit = async (data: Omit<Project, 'id'>) => {
    try {
      if (selectedProject) {
        await updateProject(selectedProject.id, data);
      } else {
        await createProject(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  if (projectsError) {
    return <div className="text-red-600">Error: {projectsError.message}</div>;
  }

  const isLoading = projectsLoading || artistsLoading;

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
        data={projects}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        title="Projetos"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProject ? 'Editar Projeto' : 'Criar Projeto'}
      >
        <ProjectForm
          project={selectedProject}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default Projects;
