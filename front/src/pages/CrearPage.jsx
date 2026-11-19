import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import useProjects from '../hooks/useProjects';
import { NewProject2 } from '../components/NewProject';
import { Link } from 'react-router-dom';

export const Crear = () => {
    const { user } = useContext(AuthContext);
    const { addProject } = useProjects();

    return (
        <div className="flex-grow">
            {user ? (
                <NewProject2 addProject={addProject} />
            ) : (
                <main className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-zinc-200 text-center shadow-sm">
                    <span className="text-4xl block mb-3">🎨</span>
                    <h2 className="text-xl font-bold text-zinc-900 mb-2">
                        Publica tu nuevo proyecto
                    </h2>
                    <p className="text-sm text-zinc-500 mb-6">
                        Inicia sesión para subir capturas, descripciones y compartir tus creaciones con toda la comunidad.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#829821] hover:bg-[#72851d] text-white font-medium rounded-xl shadow-sm transition-all"
                    >
                        <span>Iniciar Sesión</span>
                        <span>→</span>
                    </Link>
                </main>
            )}
        </div>
    );
};

