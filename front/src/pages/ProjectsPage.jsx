import { ErrorMessage } from '../components/ErrorMessage';
import { ProjectList } from '../components/ProjectList';
import useProjects from '../hooks/useProjects';
import { Link } from 'react-router-dom';

export const ProjectsPage = () => {
    const { projects, loading, error, removeProject } = useProjects();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-zinc-500 font-medium animate-pulse">Cargando proyectos...</p>
            </div>
        );
    }
    if (error) return <ErrorMessage message={error} />;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Cabecera de proyectos */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-200">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                        Explorar Proyectos
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Descubre creaciones, diseños y aplicaciones desarrolladas por la comunidad.
                    </p>
                </div>
                <Link
                    to="/crear"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#829821] hover:bg-[#96af25] text-white font-bold rounded-xl shadow-sm hover:shadow transition-all text-sm shrink-0 self-start sm:self-auto"
                >
                    <span>➕</span>
                    <span>Publicar Proyecto</span>
                </Link>
            </div>

            <ProjectList projects={projects} removeProject={removeProject} />
        </main>
    );
};
