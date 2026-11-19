import { ErrorMessage } from '../components/ErrorMessage';
import { Link, useParams, useNavigate } from 'react-router-dom';
import useProject from '../hooks/useProject';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { deleteProjectService } from '../services';
import { toast } from 'react-hot-toast';
import { LikeButton } from '../components/Likes/LikeButton';

export const ProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { project, loading, error } = useProject(id);
    const { user, token } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-zinc-500 font-medium animate-pulse">Cargando proyecto...</p>
            </div>
        );
    }

    if (error) return <ErrorMessage message={error} />;
    if (!project) return null;

    const handleDelete = async () => {
        if (!window.confirm('¿Seguro que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) return;
        try {
            await deleteProjectService({ id: project.project_id, token });
            toast.success('Proyecto eliminado con éxito');
            navigate('/projects');
        } catch (err) {
            toast.error(err.message || 'Error al eliminar el proyecto');
        }
    };

    return (
        <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Botón Volver */}
                <div className="mb-6">
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-[#829821] transition-colors"
                    >
                        <span>←</span> Volver a Proyectos
                    </Link>
                </div>

                <article className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                    {/* //^ Contenedor de Imagen de Portada con Relación de Aspecto Segura (16:9) */}
                    <div className="relative w-full aspect-video max-h-[500px] bg-zinc-950 flex items-center justify-center overflow-hidden border-b border-zinc-200">
                        {project.project_photo ? (
                            <>
                                {/* Fondo difuminado para rellenar marcos suavemente si la relación difiere */}
                                <img
                                    src={`${import.meta.env.VITE_BASE_URL}/uploads/${project.project_photo}`}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                                />
                                {/* Imagen principal completa sin recortes no deseados */}
                                <img
                                    className="relative z-10 max-h-full max-w-full object-contain"
                                    src={`${import.meta.env.VITE_BASE_URL}/uploads/${project.project_photo}`}
                                    alt={project.project_title}
                                />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-zinc-400">
                                <span className="text-6xl mb-2">🖼️</span>
                                <p className="text-sm font-medium">Sin imagen de portada</p>
                            </div>
                        )}
                    </div>

                    {/* Información del proyecto */}
                    <div className="p-6 sm:p-8">
                        {/* Cabecera del Proyecto: Título + Botón de Visitar */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-zinc-100">
                            <div className="space-y-2">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
                                    {project.project_title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-600">
                                    <span>Por</span>
                                    <Link
                                        to={`/profilepublic/${project.register_id}`}
                                        className="font-semibold text-neutral-900 hover:text-[#829821] underline decoration-[#829821]/40 hover:decoration-[#829821]"
                                    >
                                        {project.usernameOfRegister || project.email?.split('@')[0] || 'Usuario'}
                                    </Link>
                                    <span>•</span>
                                    <span>
                                        {new Date(project.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start">
                                <LikeButton
                                    projectId={project.project_id}
                                    initialLikesCount={project.likes_count}
                                    size="large"
                                    showLabel={true}
                                />
                                {project.project_url && (
                                    <a
                                        href={
                                            project.project_url.startsWith('http')
                                                ? project.project_url
                                                : `https://${project.project_url}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#829821] hover:bg-[#a1bc28] text-white font-bold rounded-xl shadow transition-all text-sm shrink-0"
                                    >
                                        <span>🔗</span> Visitar Proyecto
                                        <span className="text-xs opacity-75">↗</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Descripción del proyecto */}
                        <div className="py-6 space-y-3">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                                Descripción
                            </h2>
                            <div className="text-neutral-700 leading-relaxed whitespace-pre-line text-base bg-zinc-50/70 p-5 rounded-xl border border-zinc-200/60">
                                {project.project_description || 'Sin descripción detallada.'}
                            </div>
                        </div>

                        {/* Botones de acción del propietario */}
                        {user && user.register_id === project.register_id && (
                            <div className="flex items-center gap-3 pt-6 border-t border-zinc-100">
                                <Link
                                    to={`/updateproject/${project.project_id}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                                >
                                    <span>✏️</span> Editar proyecto
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                >
                                    <span>🗑️</span> Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </main>
    );
};

