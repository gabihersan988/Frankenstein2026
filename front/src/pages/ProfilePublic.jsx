import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../hooks/profilehook/useProfile';
import { Profile } from '../components/ProfileComponents/Profile';
import { ProjectPost } from '../components/ProjectPost';
import { QuestionCard } from '../components/QuestionsComponents/QuestionCard';
import { ConnectionsList } from '../components/Social/ConnectionsList';
import useProjects from '../hooks/useProjects';
import useQuestions from '../hooks/QuestionsHook/useQuestions';
import Loading from '../components/loading';

export const ProfilePublic = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('projects');

    const { profile, loading: profileLoading, error: profileError } = useProfile(id);
    const { projects = [], loading: projectsLoading } = useProjects();
    const { questions = [], loading: questionsLoading } = useQuestions();

    if (profileLoading) {
        return (
            <div className="flex-grow flex items-center justify-center py-24">
                <Loading />
            </div>
        );
    }

    if (profileError) {
        return (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-zinc-200 text-center shadow-sm">
                <span className="text-4xl block mb-2">⚠️</span>
                <h2 className="text-lg font-bold text-zinc-900 mb-1">Perfil no disponible</h2>
                <p className="text-sm text-zinc-500">{profileError}</p>
            </div>
        );
    }

    const targetUserId = profile?.register_id ? Number(profile.register_id) : Number(id);
    const userProjects = (projects || []).filter(
        (project) => Number(project.register_id) === targetUserId
    );
    const userQuestions = (questions || []).filter(
        (question) => Number(question.user_id) === targetUserId
    );

    return (
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <Profile profile={profile} />

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

            {activeTab === 'projects' && (
                <div>
                    {projectsLoading && userProjects.length === 0 ? (
                        <div className="py-12 flex justify-center">
                            <Loading />
                        </div>
                    ) : userProjects.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200/80 p-8 shadow-sm">
                            <p className="text-zinc-500 text-sm">Este usuario aún no ha compartido proyectos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userProjects.map((project) => (
                                <div key={project.project_id}>
                                    <ProjectPost project={project} />
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
                            <p className="text-zinc-500 text-sm">Este usuario no tiene preguntas en la comunidad.</p>
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

