import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Music,
  Plus,
  Edit,
  Trash2,
  Loader2,
  DollarSign,
  ArrowLeft,
} from 'lucide-react';
import { Project, Track, SubProject } from '../../types';
import { useProjects } from '../../hooks/useProjects';
import { useArtists } from '../../hooks/useArtists';
import { useSubProjects } from '../../hooks/useSubProjects';
import Modal from '../../components/Modal';
import SubProjectForm from './SubProjectForm';
import { useTracks } from '../../hooks/useTracks';
import ProjectTrackForm from './ProjectTrackForm';
import Card from '../../components/Card';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { artists, isLoading: artistsLoading } = useArtists();
  const { tracks, isLoading: tracksLoading } = useTracks();
  const {
    subProjects,
    createSubProject,
    updateSubProject,
    deleteSubProject,
    isLoading: subProjectsLoading,
  } = useSubProjects();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedSubProject, setSelectedSubProject] =
    useState<SubProject | null>(null);
  const [modalType, setModalType] = useState<'track' | 'subproject'>('track');

  useEffect(() => {
    const loadProject = async () => {
      if (projectsLoading || artistsLoading) return;

      const currentProject = projects.find((p) => p.id === id);
      setProject(currentProject || null);
    };

    loadProject();
  }, [id, projects, projectsLoading, artistsLoading]);

  const artist = artists.find((a) => a.id === project?.artistId);
  const artistTracks = tracks.filter((s) => s.artistId === project?.artistId);
  const projectTracks = tracks.filter((s) => s.artistId === project?.artistId);
  const projectSubProjects = subProjects.filter((sp) => sp.projectId === id);

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

  const handleEditTrack = (track: Track) => {
    setSelectedTrack(track);
    setModalType('track');
    setIsModalOpen(true);
  };

  const handleEditSubProject = (subProject: SubProject) => {
    setSelectedSubProject(subProject);
    setModalType('subproject');
    setIsModalOpen(true);
  };

  const handleDeleteTrack = async (track: Track) => {
    if (window.confirm('Are you sure you want to delete this track?')) {
      await deleteTrack(track.id);
    }
  };

  const handleDeleteSubProject = async (subProject: SubProject) => {
    if (window.confirm('Are you sure you want to delete this sub-project?')) {
      await deleteSubProject(subProject.id);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (modalType === 'track') {
        // Handle track selection
        const selectedTrackId = data.trackId;
        // Here you would update the project-track relationship
        console.log('Selected track:', selectedTrackId);
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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-600 hover:text-slate-900  dark:text-slate-200 dark:hover:text-slate-500"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Voltar
      </button>
      {/* Project Info */}
      <Card>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold ">{project.title}</h1>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-900">
            {project.type}
          </span>
        </div>
        <div className="mt-2 space-y-2 ">
          <p>Artist: {artist.name}</p>
          <p>
            Release Date: {new Date(project.releaseDate).toLocaleDateString()}
          </p>
        </div>
      </Card>

      {/* Sub-Projects */}
      <Card className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold ">
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
        <div className="mt-4 divide-y divide-slate-100">
          {projectSubProjects.map((subProject) => (
            <div key={subProject.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium ">{subProject.title}</h3>
                  <p className="text-sm ">
                    Type: {subProject.type} • Cost: $
                    {subProject.cost.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditSubProject(subProject)}
                    className="rounded p-1 text-purple-600 hover:bg-purple-50"
                    title="Edit Sub-Project"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubProject(subProject)}
                    className="rounded p-1 text-red-600 hover:bg-red-50"
                    title="Delete Sub-Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {projectSubProjects.length === 0 && (
            <p className="py-4 text-center text-sm ">No sub-projects found</p>
          )}
        </div>
      </Card>

      {/* Tracks */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold ">
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
        <div className="mt-4 divide-y divide-slate-100">
          {projectTracks.map((track) => (
            <div key={track.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium ">{track.title}</h3>
                  <p className="text-sm">
                    Duration: {track.duration} • Released:{' '}
                    {new Date(track.releaseDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditTrack(track)}
                    className="rounded p-1 text-purple-600 hover:bg-purple-50"
                    title="Edit Track"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTrack(track)}
                    className="rounded p-1 text-red-600 hover:bg-red-50"
                    title="Delete Track"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {projectTracks.length === 0 && (
            <p className="py-4 text-center text-sm ">No tracks found</p>
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
            : `${selectedSubProject ? 'Edit' : 'Add'} Sub-Project`
        }
      >
        {modalType === 'track' ? (
          <ProjectTrackForm
            availableTracks={artistTracks}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <SubProjectForm
            subProject={selectedSubProject}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            projectId={project.id}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetail;
