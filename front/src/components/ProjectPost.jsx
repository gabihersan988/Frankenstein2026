import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { LikeButton } from './Likes/LikeButton';
//import { toast } from 'react-hot-toast';
export const ProjectPost = ({ project }) => {
    const { user } = useContext(AuthContext);

    const isOwner = user && Number(user.register_id) === Number(project.register_id);
    const authorName = project.usernameOfRegister || project.email?.split('@')[0] || 'Usuario';

    return (
        <article className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
            {/* Botón de Like flotante sobre la portada */}
            <div className="absolute top-3 right-3 z-30 bg-white/90 backdrop-blur-md rounded-xl p-0.5 shadow-sm">
                <LikeButton projectId={project.project_id} initialLikesCount={project.likes_count} size="small" />
            </div>
            {/* Imagen del proyecto con relación 16:9 */}
            <Link
                to={`/project/${project.project_id}`}
                className="relative w-full aspect-video overflow-hidden bg-zinc-950 flex items-center justify-center block"
            >
                {project.project_photo ? (
                    <>
                        <img
                            src={`${import.meta.env.VITE_BASE_URL}/uploads/${project.project_photo}`}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110 pointer-events-none"
                        />
                        <img
                            loading="lazy"
                            src={`${import.meta.env.VITE_BASE_URL}/uploads/${project.project_photo}`}
                            alt={project.project_title}
                            className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-500 p-6">
                        <span className="text-4xl mb-1">🖼️</span>
                        <span className="text-xs">Sin portada</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-20">
                    <span className="text-white text-xs font-semibold bg-[#829821] px-3 py-1 rounded-full shadow">
                        Ver proyecto →
                    </span>
                </div>
            </Link>

            {/* Información del proyecto */}
            <div className="p-5 flex flex-col flex-grow">
                <Link to={`/project/${project.project_id}`} className="block">
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-[#829821] transition-colors line-clamp-1">
                        {project.project_title}
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                        {project.project_description || 'Sin descripción disponible.'}
                    </p>
                </Link>

                <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-[10px] uppercase">
                            {authorName[0]}
                        </div>
                        <Link
                            to={`/profilepublic/${project.register_id}`}
                            className="font-medium text-zinc-700 hover:text-[#829821] transition-colors truncate max-w-[110px]"
                        >
                            {authorName}
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        {isOwner && (
                            <Link
                                to={`/updateproject/${project.project_id}`}
                                className="text-amber-600 hover:text-amber-700 font-semibold text-xs ml-1"
                                title="Editar mi proyecto"
                            >
                                ✏️
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

ProjectPost.propTypes = {
    project: PropTypes.object.isRequired,
};
