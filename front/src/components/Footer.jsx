import { Link } from 'react-router-dom';
import {
    FaHome,
    FaUserAlt,
    FaProjectDiagram,
    FaQuestion,
    FaPlus,
} from 'react-icons/fa';

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const Footer = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            {/* Barra de navegación inferior SOLO en móviles (< 768px) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 px-4 py-2 flex items-center justify-around shadow-2xl">
                <Link
                    to="/"
                    className="flex flex-col items-center text-zinc-400 hover:text-[#829821] transition-colors py-1 px-2"
                >
                    <FaHome size={18} />
                    <span className="text-[10px] mt-1 font-medium">Inicio</span>
                </Link>
                <Link
                    to="/projects"
                    className="flex flex-col items-center text-zinc-400 hover:text-[#829821] transition-colors py-1 px-2"
                >
                    <FaProjectDiagram size={18} />
                    <span className="text-[10px] mt-1 font-medium">Proyectos</span>
                </Link>
                <Link
                    to={user ? "/crear" : "/login"}
                    className="flex flex-col items-center text-zinc-400 hover:text-[#829821] transition-colors py-1 px-2 -mt-4"
                >
                    <div className="w-10 h-10 rounded-full bg-[#829821] text-white flex items-center justify-center shadow-lg hover:bg-[#96af25] transition-all">
                        <FaPlus size={16} />
                    </div>
                    <span className="text-[10px] mt-1 font-medium text-white">Crear</span>
                </Link>
                <Link
                    to="/questions"
                    className="flex flex-col items-center text-zinc-400 hover:text-[#829821] transition-colors py-1 px-2"
                >
                    <FaQuestion size={18} />
                    <span className="text-[10px] mt-1 font-medium">Preguntas</span>
                </Link>
                <Link
                    to={user ? `/profile/${user.register_id}` : '/login'}
                    className="flex flex-col items-center text-zinc-400 hover:text-[#829821] transition-colors py-1 px-2"
                >
                    <FaUserAlt size={18} />
                    <span className="text-[10px] mt-1 font-medium">
                        {user ? 'Cuenta' : 'Entrar'}
                    </span>
                </Link>
            </nav>

            {/* Footer completo y elegante SOLO en escritorio (>= 768px) */}
            <footer className="hidden md:block bg-zinc-950 text-zinc-400 border-t border-zinc-800/80 mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/franki-icono.png"
                            alt="Logo Frankenstein"
                            className="w-8 h-8 object-contain"
                        />
                        <div>
                            <span className="text-white font-bold text-lg tracking-tight">
                                Frankenstein
                            </span>
                            <p className="text-xs text-zinc-500">
                                Plataforma social para programadores y diseñadores
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <Link to="/" className="hover:text-white transition-colors">
                            Inicio
                        </Link>
                        <Link to="/projects" className="hover:text-white transition-colors">
                            Proyectos
                        </Link>
                        <Link to="/questions" className="hover:text-white transition-colors">
                            Preguntas
                        </Link>
                        {user ? (
                            <Link to="/crear" className="text-[#829821] hover:underline font-semibold">
                                + Publicar Proyecto
                            </Link>
                        ) : (
                            <Link to="/register" className="text-[#829821] hover:underline font-semibold">
                                Registrarme
                            </Link>
                        )}
                    </div>

                    <div className="text-xs text-zinc-500 text-center sm:text-right">
                        <p>© {new Date().getFullYear()} Frankenstein. Todos los derechos reservados.</p>
                        <p className="mt-0.5">Diseñado con dedicación para la comunidad tecnológica.</p>
                    </div>
                </div>
            </footer>
        </>
    );
};
