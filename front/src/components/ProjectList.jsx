import PropTypes from 'prop-types';

// import ErrorBoundary from './ErrorBoundaryWithClass';
import { ProjectPost } from './ProjectPost';

//recibe una prop, un array de objetos
export const ProjectList = ({ projects = [], removeProject }) => {
    if (!projects || projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-zinc-200 text-center max-w-md mx-auto my-12">
                <span className="text-5xl mb-3">📁</span>
                <h3 className="text-lg font-bold text-zinc-800 mb-1">No hay proyectos disponibles</h3>
                <p className="text-xs text-zinc-500 mb-6">Sé el primero en compartir tu trabajo con la comunidad.</p>
                <a
                    href="/crear"
                    className="px-5 py-2.5 bg-[#829821] hover:bg-[#96af25] text-white font-semibold rounded-xl text-sm shadow transition-colors"
                >
                    + Publicar nuevo proyecto
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <ProjectPost
                    key={project.project_id}
                    project={project}
                    removeProject={removeProject}
                />
            ))}
        </div>
    );
};

ProjectList.propTypes = {
    projects: PropTypes.array,
    removeProject: PropTypes.func,
};
