import { ErrorMessage } from '../components/ErrorMessage';
import useProjects from '../hooks/useProjects';
import useQuestions from '../hooks/QuestionsHook/useQuestions.js';
import { ProjectPost } from '../components/ProjectPost.jsx';
import { QuestionCard } from '../components/QuestionsComponents/QuestionCard.jsx';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


export const HomePage = () => {
    const { projects, loading, error } = useProjects();
    const { questions } = useQuestions();
    const { user } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-zinc-500 font-medium animate-pulse">Cargando comunidad Frankenstein...</p>
            </div>
        );
    }
    if (error) return <ErrorMessage message={error} />;

    return (
        <main className="flex-grow flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#829821]/20 border border-[#829821]/40 text-[#a5c229] text-xs font-bold tracking-wider uppercase">
                        ⚡ La red social para creativos & desarrolladores
                    </span>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
                        Conecta, Construye y Comparte tus <span className="text-[#829821]">Proyectos</span>
                    </h1>

                    <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                        Muestra tus aplicaciones, recibe retroalimentación de la comunidad y resuelve dudas técnicas junto a otros apasionados por el código y el diseño.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <Link
                            to="/projects"
                            className="px-6 py-3 bg-[#829821] hover:bg-[#96af25] text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 text-sm"
                        >
                            Explorar Proyectos
                        </Link>
                        {user ? (
                            <Link
                                to="/crear"
                                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl border border-zinc-700 transition-all text-sm"
                            >
                                + Publicar Proyecto
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl border border-zinc-700 transition-all text-sm"
                            >
                                Únete Gratis
                            </Link>
                        )}
                        <Link
                            to="/questions"
                            className="px-6 py-3 text-zinc-400 hover:text-white font-medium text-sm transition-colors"
                        >
                            Preguntas de la comunidad →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Proyectos Destacados */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                            Proyectos Recientes
                        </h2>
                        <p className="text-sm text-zinc-500 mt-1">
                            Las últimas creaciones publicadas por nuestros miembros.
                        </p>
                    </div>
                    <Link
                        to="/projects"
                        className="text-sm font-bold text-[#829821] hover:underline whitespace-nowrap"
                    >
                        Ver todos ({projects?.length || 0}) →
                    </Link>
                </div>

                {projects && projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.slice(0, 6).map((project) => (
                            <ProjectPost key={project.project_id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200 p-8 max-w-md mx-auto">
                        <span className="text-4xl mb-2 block">💡</span>
                        <p className="text-zinc-700 font-bold mb-1">Aún no hay proyectos</p>
                        <p className="text-xs text-zinc-500 mb-4">Sé el primero en publicar tu trabajo.</p>
                        <Link
                            to="/crear"
                            className="inline-block px-4 py-2 bg-[#829821] text-white rounded-lg text-xs font-semibold"
                        >
                            Crear proyecto
                        </Link>
                    </div>
                )}
            </section>

            {/* Preguntas de la Comunidad */}
            <section className="bg-zinc-100/70 border-t border-zinc-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-200">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                                Preguntas & Discusiones
                            </h2>
                            <p className="text-sm text-zinc-500 mt-1">
                                Dudas resueltas y debates abiertos por la comunidad.
                            </p>
                        </div>
                        <Link
                            to="/questions"
                            className="text-sm font-bold text-[#829821] hover:underline whitespace-nowrap"
                        >
                            Ver foro de dudas →
                        </Link>
                    </div>

                    {questions && questions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {questions.slice(0, 4).map((question) => (
                                <QuestionCard key={question.question_id} question={question} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-zinc-500 py-8">No hay preguntas registradas todavía.</p>
                    )}
                </div>
            </section>
        </main>
    );
};
