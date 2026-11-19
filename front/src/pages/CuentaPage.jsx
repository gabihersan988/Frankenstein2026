import { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProfile } from '../hooks/profilehook/useProfile';
import { Profile } from '../components/ProfileComponents/Profile';
import { AuthContext } from '../context/AuthContext';
import { ProjectPost } from '../components/ProjectPost';
import { QuestionCard } from '../components/QuestionsComponents/QuestionCard';
import { ConnectionsList } from '../components/Social/ConnectionsList';
import useProjects from '../hooks/useProjects';
import useQuestions from '../hooks/QuestionsHook/useQuestions';
import Loading from '../components/loading';

export const CuentaPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'questions'

    const { profile, loading: profileLoading, error: profileError, updateProfile } = useProfile(id);
    const { projects = [], loading: projectsLoading, removeProject } = useProjects();
    const { questions = [], loading: questionsLoading } = useQuestions();

    if (profileLoading) {
        return (
            <div className="flex-grow flex items-center justify-center py-24">
                <Loading />
            </div>
        );
    }

    if (profileError) {
        const isOwnProfile = user && Number(user.register_id) === Number(id);
        return (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-zinc-200 text-center shadow-sm">
                <span className="text-4xl block mb-2">⚠️</span>
                <h2 className="text-lg font-bold text-zinc-900 mb-1">
                    {isOwnProfile ? 'Aún no tienes perfil' : 'Perfil no encontrado'}
                </h2>
                <p className="text-sm text-zinc-500 mb-6">
                    {isOwnProfile
                        ? 'Completa tu perfil para empezar a publicar proyectos y conectar con la comunidad.'
                        : profileError}
                </p>
                <div className="flex items-center justify-center gap-3">
                    {isOwnProfile && (
                        <Link
                            to="/newprofile"
                            className="inline-flex px-5 py-2.5 bg-[#829821] text-white rounded-xl text-sm font-medium hover:bg-[#72851d] transition-colors"
                        >
                            Crear mi perfil
                        </Link>
                    )}
                    <Link
                        to="/"
                        className="inline-flex px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
                    >
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        );
    }

    // Filtramos proyectos del usuario
    const targetUserId = profile?.register_id ? Number(profile.register_id) : Number(id);
    const userProjects = (projects || []).filter(
        (project) => Number(project.register_id) === targetUserId
    );

    // Filtramos preguntas del usuario
    const userQuestions = (questions || []).filter(
        (question) => Number(question.user_id) === targetUserId
    );

    const isOwner = user && Number(user.register_id) === targetUserId;

    return (
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Tarjeta de perfil Hero */}
            <Profile profile={profile} updateProfile={updateProfile} />

            {/* Pestañas de contenido del usuario */}
            <div className="flex items-center gap-3 border-b border-zinc-200 mb-6">
                <button
                    type="button"
                    onClick={() => setActiveTab('projects')}
                    className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === 'projects'
                            ? 'border-[#829821] text-[#829821]'
                            : 'border-transparent text-zinc-500 hover:text-zinc-800'
                    }`}
                >
                    <span>🎨</span>
                    <span>Proyectos</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700">
                        {userProjects.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('questions')}
                    className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === 'questions'
                            ? 'border-[#829821] text-[#829821]'
                            : 'border-transparent text-zinc-500 hover:text-zinc-800'
                    }`}
                >
                    <span>💬</span>
                    <span>Preguntas</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700">
                        {userQuestions.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('connections')}
                    className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === 'connections'
                            ? 'border-[#829821] text-[#829821]'
                            : 'border-transparent text-zinc-500 hover:text-zinc-800'
                    }`}
                >
                    <span>👥</span>
                    <span>Conexiones</span>
                </button>
            </div>

            {/* Contenido de la pestaña activa */}
            {activeTab === 'projects' && (
                <div>
                    {projectsLoading && userProjects.length === 0 ? (
                        <div className="py-12 flex justify-center">
                            <Loading />
                        </div>
                    ) : userProjects.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200/80 p-8 shadow-sm">
                            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                🎨
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                                Sin proyectos publicados todavía
                            </h3>
                            <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
                                {isOwner
                                    ? 'Aún no has compartido ningún proyecto con la comunidad. ¡Sube tu primera creación!'
                                    : 'Este usuario aún no ha publicado ningún proyecto en su portafolio.'}
                            </p>
                            {isOwner && (
                                <Link
                                    to="/crear"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#829821] hover:bg-[#72851d] text-white font-medium rounded-xl shadow-sm transition-all"
                                >
                                    <span>➕</span>
                                    <span>Publicar Proyecto</span>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userProjects.map((project) => (
                                <div key={project.project_id}>
                                    <ProjectPost
                                        project={project}
                                        removeProject={removeProject}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'questions' && (
                <div>
                    {questionsLoading && userQuestions.length === 0 ? (
                        <div className="py-12 flex justify-center">
                            <Loading />
                        </div>
                    ) : userQuestions.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200/80 p-8 shadow-sm">
                            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                💡
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                                Sin preguntas formuladas
                            </h3>
                            <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
                                {isOwner
                                    ? '¿Tienes alguna duda sobre código o arquitectura? Pregúntale a la comunidad.'
                                    : 'Este usuario no tiene preguntas activas.'}
                            </p>
                            {isOwner && (
                                <Link
                                    to="/questions/newquestion"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#829821] hover:bg-[#72851d] text-white font-medium rounded-xl shadow-sm transition-all"
                                >
                                    <span>➕</span>
                                    <span>Formular Pregunta</span>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {userQuestions.map((question) => (
                                <QuestionCard
                                    key={question.question_id}
                                    question={question}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'connections' && (
                <div>
                    <ConnectionsList userId={targetUserId} />
                </div>
            )}
        </main>
    );
};

