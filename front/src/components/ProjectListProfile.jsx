import PropTypes from 'prop-types';
import { ProjectPost } from './ProjectPost';
import { useProfile } from '../hooks/profilehook/useProfile';
import { useParams } from 'react-router-dom';

export const ProjectListProfile = ({ projects = [], removeProject }) => {
    const { id } = useParams();
    const { profile } = useProfile(id);

    const targetId = profile?.register_id ? Number(profile.register_id) : Number(id);
    const userProjects = (projects || []).filter(
        (project) => Number(project.register_id) === targetId
    );

    return userProjects.length ? (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects.map((project) => (
                    <div key={project.project_id}>
                        <ProjectPost
                            project={project}
                            removeProject={removeProject}
                        />
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <div className="text-zinc-500 text-sm py-8 text-center bg-white rounded-2xl border border-zinc-200">
            No hay proyectos publicados por este usuario todavía.
        </div>
    );
};

ProjectListProfile.propTypes = {
    projects: PropTypes.array,
    removeProject: PropTypes.func,
};

