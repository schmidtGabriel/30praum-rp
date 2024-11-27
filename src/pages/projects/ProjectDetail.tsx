import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Loader2,
  DollarSign,
  Eye,
  Music,
} from 'lucide-react';
import { Project, ProjectProjection, SubProject, Track } from '../../types';
import { useProjects } from '../../hooks/useProjects';
import { useArtists } from '../../hooks/useArtists';
import { useSubProjects } from '../../hooks/useSubProjects';
import Modal from '../../components/Modal';
import ProjectForm from './ProjectForm';
import SubProjectForm from './SubProjectForm';
import { useTracks } from '../../hooks/useTracks';
import ProjectTrackForm from './ProjectTrackForm';
import Card from '../../components/Card';
import ActionButton from '../../components/ActionButton';
import { useProjectProjections } from '../../hooks/useProjectProjections';
import formatCurrency from '../../helpers/formatCurrency';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, updateProject, isLoading: projectsLoading } = useProjects();
  const { artists, isLoading: artistsLoading } = useArtists();
  const { tracks, isLoading: tracksLoading } = useTracks();
  const { projectProjections } = useProjectProjections();
  const {
    subProjects,
    createSubProject,
    updateSubProject,
    deleteSubProject,
    isLoading: subProjectsLoading,
  } = useSubProjects();

  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projections, setProjections] = useState<ProjectProjection[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedSubProject, setSelectedSubProject] =
    useState<SubProject | null>(null);
  const [modalType, setModalType] = useState<
    'track' | 'subproject' | 'project'
  >('track');

  // Calculate total cost from subprojects
  const calculateTotalCost = (projectId: string) => {
    return subProjects
      .filter((sp) => sp.projectId === projectId)
      .reduce((sum, sp) => sum + (sp.cost || 0), 0);
  };

  // Update project cost when subprojects change
  useEffect(() => {
    const updateProjectCost = async () => {
      if (project && id) {
        const totalCost = calculateTotalCost(id);
        if (totalCost !== project.cost) {
          await updateProject(id, { ...project, cost: totalCost });
        }
      }
    };
    updateProjectCost();
  }, [subProjects, project, id]);

  useEffect(() => {
    const loadProject = async () => {
      if (projectsLoading || artistsLoading) return;

      const currentProject = projects.find((p) => p.id === id);
      const projectProjection = projectProjections.filter(
        (it) => it.projectId === project?.id
      );
      console.log(projections, projectProjection);
      setProjections(projectProjection || []);
      setProject(currentProject || null);
    };

    loadProject();
  }, [id, projects, projectsLoading, artistsLoading]);

  const artist = artists.find((a) => a.id === project?.artistId);
  const artistTracks = tracks.filter((s) => s.artistId === project?.artistId);
  const projectSubProjects = subProjects.filter((sp) => sp.projectId === id);

  const projectTracks = tracks.filter((s) => project?.trackIds?.includes(s.id));
  const availableTracks = artistTracks.filter(
    (s) => !project?.trackIds?.includes(s.id)
  );

  const handleEditProject = () => {
    setModalType('project');
    setIsModalOpen(true);
  };

  const handleAddTrack = () => {
    setSelectedTrack(null);
    setModalType('track');
    setIsModalOpen(true);
  };

  const handleAddSubProject = () => {
    setSelectedSubProject(null);
    setModalType('subproject');
    setIsModalOpen(true);
  };

  const handleEditSubProject = (subProject: SubProject) => {
    setSelectedSubProject(subProject);
    setModalType('subproject');
    setIsModalOpen(true);
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (
      !project ||
      !window.confirm('Tem certeza que deseja remover esta música do catálogo?')
    ) {
      return;
    }

    try {
      const updatedTrackIds = project.trackIds.filter((id) => id !== trackId);

      await updateProject(project.id, {
        ...project,
        trackIds: updatedTrackIds,
      });
    } catch (error) {
      console.error('Falha ao remover música:', error);
    }
  };

  const handleDeleteSubProject = async (subProject: SubProject) => {
    if (window.confirm('Are you sure you want to delete this sub-project?')) {
      await deleteSubProject(subProject.id);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (!project) return;

      if (modalType === 'track') {
        const trackId = data.trackId;
        const updatedTrackIds = [...(project?.trackIds || []), trackId];

        await updateProject(project?.id, {
          ...project,
          trackIds: updatedTrackIds,
        });
      } else if (modalType === 'project' && project) {
        // Preserve the current cost when updating project
        await updateProject(project.id, { ...data, cost: project.cost });
      } else {
        if (selectedSubProject) {
          await updateSubProject(selectedSubProject.id, data);
        } else {
          await createSubProject(data);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  if (
    projectsLoading ||
    artistsLoading ||
    subProjectsLoading ||
    tracksLoading
  ) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!project || !artist) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </button>
        <ActionButton
          onClick={handleEditProject}
          className="flex items-center"
          leftIcon={<Edit className="h-4 w-4" />}
        >
          Editar Projeto
        </ActionButton>
      </div>

      {/* Project Info */}
      <Card>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-900 dark:bg-purple-900/20 dark:text-purple-400">
            {project.type}
          </span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Artist</p>
            <p className="mt-1 font-medium">{artist.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Release Date
            </p>
            <p className="mt-1 font-medium">
              {new Date(project.releaseDate).toLocaleDateString()}
            </p>
          </div>
          {projections.length > 0 && (
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Budget
              </p>
              {projections.map((pr) => (
                <p className="mt-1 font-medium">
                  {pr.year} - {formatCurrency(pr.budget)}
                </p>
              ))}
            </div>
          )}

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Cost (from Sub-Projects)
            </p>
            <p className="mt-1 font-medium">
              {formatCurrency(project.cost || 0)}
            </p>
          </div>
        </div>
        {project.description && (
          <div className="mt-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Description
            </p>
            <p className="mt-1">{project.description}</p>
          </div>
        )}
      </Card>

      {/* Sub-Projects */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold">
            <DollarSign className="mr-2 h-5 w-5 text-purple-600" />
            Sub-Projects
          </h2>
          <button
            onClick={handleAddSubProject}
            className="flex items-center rounded-lg bg-purple-900 px-3 py-2 text-sm font-medium text-white hover:bg-purple-800"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Sub-Project
          </button>
        </div>
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
          {projectSubProjects.map((subProject) => (
            <div key={subProject.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{subProject.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Budget: {formatCurrency(subProject.budget || 0)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Custo: {formatCurrency(subProject.cost)}
                  </p>
                  {subProject.description && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {subProject.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/subprojects/${subProject.id}`)}
                    className="rounded p-1 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                    title="View Sub-Project"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditSubProject(subProject)}
                    className="rounded p-1 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                    title="Edit Sub-Project"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubProject(subProject)}
                    className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    title="Delete Sub-Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {projectSubProjects.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-600 dark:text-slate-400">
              No sub-projects found
            </p>
          )}
        </div>
      </Card>

      {/* Tracks */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold">
            <Music className="mr-2 h-5 w-5 text-purple-600" />
            Tracks
          </h2>
          <button
            onClick={handleAddTrack}
            className="flex items-center rounded-lg bg-purple-900 px-3 py-2 text-sm font-medium text-white hover:bg-purple-800"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Track
          </button>
        </div>
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
          {projectTracks.map((track) => (
            <div key={track.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{track.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Duration: {track.duration} • Released:{' '}
                    {new Date(track.releaseDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteTrack(track.id)}
                    className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    title="Delete Track"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {projectTracks.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-600 dark:text-slate-400">
              No tracks found
            </p>
          )}
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === 'track'
            ? `${selectedTrack ? 'Edit' : 'Add'} Track`
            : modalType === 'project'
            ? 'Edit Project'
            : `${selectedSubProject ? 'Edit' : 'Add'} Sub-Project`
        }
      >
        {modalType === 'track' ? (
          <ProjectTrackForm
            availableTracks={availableTracks}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : modalType === 'project' ? (
          <ProjectForm
            project={project}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <SubProjectForm
            subProject={selectedSubProject}
            projectId={project.id}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetail;
