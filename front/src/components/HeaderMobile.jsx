import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from './Auth';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { SearchBar } from './SearchComponents/SearchBar';
import { NotificationBell } from './Notifications/NotificationBell';

const HeaderMobile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useContext(AuthContext);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            <NotificationBell />
            <button
                onClick={toggleMenu}
                className="text-white hover:text-[#829821] p-1.5 rounded-lg focus:outline-none transition-colors"
                aria-label="Menú principal"
            >
                {isOpen ? (
                    <AiOutlineClose className="text-2xl text-white" />
                ) : (
                    <AiOutlineMenu className="text-2xl text-white" />
                )}
            </button>

            {isOpen && (
                <div className="bg-zinc-950/98 backdrop-blur-md absolute top-full left-0 right-0 border-b border-zinc-800 shadow-2xl p-5 z-50 animate-fadeIn">
                    <div className="flex flex-col space-y-4">
                        <div className="w-full">
                            <SearchBar />
                        </div>

                        <div className="flex flex-col space-y-2 pt-2 border-t border-zinc-800 text-sm font-semibold">
                            <Link
                                to="/projects"
                                className="text-zinc-200 hover:text-[#829821] py-1.5 transition-colors"
                                onClick={closeMenu}
                            >
                                🎨 Explorar Proyectos
                            </Link>

                            <Link
                                to="/questions"
                                className="text-zinc-200 hover:text-[#829821] py-1.5 transition-colors"
                                onClick={closeMenu}
                            >
                                💬 Preguntas y Dudas
                            </Link>

                            <Link
                                to="/community"
                                className="text-zinc-200 hover:text-[#829821] py-1.5 transition-colors"
                                onClick={closeMenu}
                            >
                                🌐 Explorar Comunidad
                            </Link>

                            {user && (
                                <Link
                                    to="/crear"
                                    className="text-zinc-200 hover:text-[#829821] py-1.5 transition-colors"
                                    onClick={closeMenu}
                                >
                                    ➕ Publicar Proyecto
                                </Link>
                            )}

                            {user && (
                                <Link
                                    to={`/profile/${user.register_id}`}
                                    className="text-zinc-200 hover:text-[#829821] py-1.5 transition-colors"
                                    onClick={closeMenu}
                                >
                                    👤 Mi Cuenta
                                </Link>
                            )}
                        </div>

                        <div className="pt-3 border-t border-zinc-800 flex justify-center">
                            <Auth />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderMobile;

