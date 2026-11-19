import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
    return (
        <main className="flex-grow flex items-center justify-center px-4 py-16">
            <div className="text-center max-w-md mx-auto bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
                <span className="text-6xl block mb-4">🧪</span>
                <span className="text-xs font-bold text-[#829821] tracking-widest uppercase">
                    Error 404
                </span>
                <h1 className="text-2xl font-bold text-zinc-900 mt-1 mb-2">
                    Página no encontrada
                </h1>
                <p className="text-sm text-zinc-500 mb-6">
                    El experimento o ruta que buscas parece haberse perdido en el laboratorio de Frankenstein.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#829821] hover:bg-[#72851d] text-white font-medium rounded-xl shadow-sm transition-all"
                >
                    <span>←</span>
                    <span>Volver a la Página Principal</span>
                </Link>
            </div>
        </main>
    );
};

