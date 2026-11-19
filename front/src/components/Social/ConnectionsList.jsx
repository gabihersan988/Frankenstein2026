import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUserConnectionsService } from '../../services/socialService';
import { FollowButton } from './FollowButton';
import { ChatModal } from '../Messages/ChatModal';
import { ConversationsView } from '../Messages/ConversationsView';
import { CommunityDirectory } from './CommunityDirectory';
import Loading from '../loading';

export const ConnectionsList = ({ userId }) => {
    const { user } = useContext(AuthContext);
    const [subTab, setSubTab] = useState('friends'); // 'friends' | 'followers' | 'following' | 'messages' | 'discover'
    const [connections, setConnections] = useState({
        friends: [],
        followers: [],
        following: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedChatUser, setSelectedChatUser] = useState(null);

    const loadConnections = async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            setError('');
            const data = await getUserConnectionsService(userId);
            setConnections({
                friends: data.friends || [],
                followers: data.followers || [],
                following: data.following || [],
            });
        } catch (err) {
            setError(err.message || 'Error al cargar conexiones');
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadConnections(true);
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-center text-sm">
                {error}
            </div>
        );
    }

    const currentList = connections[subTab] || [];

    const roleBadges = {
        student: { label: 'Estudiante', color: 'bg-blue-50 text-blue-700 border-blue-200' },
        expert: { label: 'Experto', color: 'bg-amber-50 text-amber-700 border-amber-200' },
        company: { label: 'Empresa', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    };

    return (
        <div className="space-y-6">
            {/* Sub-pestañas: Amigos, Seguidores, Siguiendo, Mensajes, Descubrir Personas */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-zinc-100 rounded-2xl">
                <button
                    type="button"
                    onClick={() => setSubTab('friends')}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                        subTab === 'friends'
                            ? 'bg-white text-zinc-900 shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                >
                    <span>🤝 Amigos</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700">
                        {connections.friends.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setSubTab('followers')}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                        subTab === 'followers'
                            ? 'bg-white text-zinc-900 shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                >
                    <span>👥 Seguidores</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700">
                        {connections.followers.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setSubTab('following')}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                        subTab === 'following'
                            ? 'bg-white text-zinc-900 shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                >
                    <span>🔍 Siguiendo</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700">
                        {connections.following.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setSubTab('messages')}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                        subTab === 'messages'
                            ? 'bg-white text-[#829821] shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                >
                    <span>💬 Mensajes Directos</span>
                </button>

                <button
                    type="button"
                    onClick={() => setSubTab('discover')}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                        subTab === 'discover'
                            ? 'bg-white text-[#829821] shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                >
                    <span>🌐 Descubrir Personas</span>
                </button>
            </div>

            {/* Vista de Mensajes Directos */}
            {subTab === 'messages' && (
                <div>
                    <ConversationsView />
                </div>
            )}

            {/* Vista de Descubrir Miembros */}
            {subTab === 'discover' && (
                <div>
                    <CommunityDirectory />
                </div>
            )}

            {/* Listado de conexiones (Amigos, Seguidores, Siguiendo) */}
            {subTab !== 'messages' && subTab !== 'discover' && (
                <div>
                    {currentList.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200/80 p-8 shadow-sm">
                            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                {subTab === 'friends' ? '🤝' : subTab === 'followers' ? '👥' : '🔍'}
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                                {subTab === 'friends'
                                    ? 'Aún no tienes amigos mutuos'
                                    : subTab === 'followers'
                                    ? 'Sin seguidores todavía'
                                    : 'No estás siguiendo a nadie'}
                            </h3>
                            <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-5">
                                {subTab === 'friends'
                                    ? 'Los amigos son personas que se siguen mutuamente. ¡Explora perfiles y crea conexiones!'
                                    : subTab === 'followers'
                                    ? 'Comparte tus proyectos y responde preguntas para que otros miembros te sigan.'
                                    : 'Descubre el trabajo de otros estudiantes, expertos y empresas en Frankenstein.'}
                            </p>
                            <button
                                type="button"
                                onClick={() => setSubTab('discover')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#829821] hover:bg-[#72851d] text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                            >
                                <span>🌐 Explorar Personas de la Comunidad</span>
                                <span>→</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentList.map((c) => {
                                const displayName =
                                    c.profile_name && c.profile_lastname
                                        ? `${c.profile_name} ${c.profile_lastname}`
                                        : c.usernameOfRegister || c.email?.split('@')[0] || 'Usuario';
                                const username = c.profile_username || c.usernameOfRegister || 'usuario';
                                const badge = roleBadges[c.profile_role] || {
                                    label: c.profile_role || 'Miembro',
                                    color: 'bg-zinc-100 text-zinc-700 border-zinc-200',
                                };

                                return (
                                    <div
                                        key={c.register_id}
                                        className="flex flex-col justify-between p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-sm hover:border-zinc-300 transition-all gap-4"
                                    >
                                        <Link
                                            to={`/profilepublic/${c.register_id}`}
                                            className="flex items-center gap-3 min-w-0 flex-grow group"
                                        >
                                            {c.avatar ? (
                                                <img
                                                    src={`${import.meta.env.VITE_BASE_URL}/uploads/${c.avatar}`}
                                                    alt={displayName}
                                                    className="w-12 h-12 rounded-full object-cover border border-zinc-200 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-base shrink-0">
                                                    {displayName[0]?.toUpperCase() || '👤'}
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-zinc-900 group-hover:text-[#829821] truncate transition-colors">
                                                    {displayName}
                                                </h4>
                                                <p className="text-xs text-zinc-500 truncate">
                                                    @{username}
                                                </p>
                                                <span
                                                    className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${badge.color}`}
                                                >
                                                    {badge.label}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedChatUser(c)}
                                                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                                                title="Enviar mensaje directo"
                                            >
                                                <span>💬</span>
                                                <span>Mensaje</span>
                                            </button>
                                            <FollowButton
                                                targetUserId={c.register_id}
                                                size="small"
                                                onStatusChange={() => {
                                                    loadConnections(false);
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {selectedChatUser && (
                <ChatModal
                    isOpen={Boolean(selectedChatUser)}
                    onClose={() => setSelectedChatUser(null)}
                    targetUser={selectedChatUser}
                />
            )}
        </div>
    );
};

ConnectionsList.propTypes = {
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
