import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Auth = () => {
    const { user, logout } = useContext(AuthContext);

    return user ? (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => logout()}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
            >
                <span>🚪</span>
                <span>Cerrar Sesión</span>
            </button>
        </div>
    ) : (
        <div className="flex items-center gap-3">
            <Link
                to="/login"
                className="text-zinc-300 hover:text-white text-sm font-medium px-2 py-1 transition-colors"
            >
                Iniciar Sesión
            </Link>
            <Link
                to="/register"
                className="bg-[#829821] hover:bg-[#72851d] text-white px-4 py-1.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
                Registrarme
            </Link>
        </div>
    );
};

