import { Link, useLocation } from 'react-router-dom';
import { Auth } from './Auth';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import HeaderMobile from './HeaderMobile';
import { SearchBar } from './UI/SearchBar';
import { NotificationBell } from './Notifications/NotificationBell';

export const Header = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/90 px-4 sm:px-6 lg:px-8 py-3 top-0 flex items-center justify-between shadow-sm sticky z-50">
            {/* Logo */}
            <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <img
                        src="/frankenstein.png"
                        className="h-8 sm:h-9 object-contain transition-transform group-hover:scale-105"
                        alt="Frankenstein Logo"
                    />
                </Link>
            </div>

            {/* Menú Desktop (a partir de md) */}
            <nav className="hidden md:flex md:items-center md:space-x-8 text-sm font-medium">
                <Link
                    to="/projects"
                    className={`transition-colors py-1 ${
                        isActive('/projects')
                            ? 'text-[#829821] font-semibold'
                            : 'text-zinc-300 hover:text-white'
                    }`}
                >
                    Proyectos
                </Link>

                <Link
                    to="/questions"
                    className={`transition-colors py-1 ${
                        isActive('/questions')
                            ? 'text-[#829821] font-semibold'
                            : 'text-zinc-300 hover:text-white'
                    }`}
                >
                    Preguntas
                </Link>

                <Link
                    to="/community"
                    className={`transition-colors py-1 ${
                        isActive('/community')
                            ? 'text-[#829821] font-semibold'
                            : 'text-zinc-300 hover:text-white'
                    }`}
                >
                    Comunidad
                </Link>

                {user && (
                    <Link
                        to="/crear"
                        className={`transition-colors py-1 ${
                            isActive('/crear')
                                ? 'text-[#829821] font-semibold'
                                : 'text-zinc-300 hover:text-white'
                        }`}
                    >
                        + Crear Proyecto
                    </Link>
                )}

                {user && (
                    <Link
                        to={`/profile/${user.register_id}`}
                        className={`transition-colors py-1 ${
                            location.pathname.startsWith('/profile')
                                ? 'text-[#829821] font-semibold'
                                : 'text-zinc-300 hover:text-white'
                        }`}
                    >
                        Mi Cuenta
                    </Link>
                )}

                <div>
                    <SearchBar />
                </div>
            </nav>

            {/* Auth en Desktop */}
            <div className="hidden md:flex md:items-center md:gap-3">
                <NotificationBell />
                <Auth />
            </div>

            {/* Menú móvil (hasta md) */}
            <div className="md:hidden flex items-center">
                <HeaderMobile />
            </div>
        </header>
    );
};

