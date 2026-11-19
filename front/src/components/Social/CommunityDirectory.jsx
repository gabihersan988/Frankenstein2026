import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getCommunityMembersService } from '../../services/communityService';
import { FollowButton } from './FollowButton';
import { ChatModal } from '../Messages/ChatModal';
import { Link } from 'react-router-dom';
import Loading from '../loading';

export const CommunityDirectory = () => {
    const { token, user } = useContext(AuthContext);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChatUser, setSelectedChatUser] = useState(null);

    const loadMembers = async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            const data = await getCommunityMembersService({ token });
            setMembers(data || []);
        } catch {
            // Silently ignore
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    useEffect(() => {
        loadMembers(true);
    }, [token]);

    const filteredMembers = members.filter((m) => {
        const query = searchTerm.toLowerCase();
        const fullName = `${m.profile_name || ''} ${m.profile_lastname || ''}`.toLowerCase();
        const username = (m.profile_username || m.usernameOfRegister || '').toLowerCase();
        const role = (m.profile_role || '').toLowerCase();
        return fullName.includes(query) || username.includes(query) || role.includes(query);
    });

    const roleBadges = {
        student: { label: 'Estudiante', color: 'bg-blue-50 text-blue-700 border-blue-200' },
        expert: { label: 'Experto', color: 'bg-amber-50 text-amber-700 border-amber-200' },
        company: { label: 'Empresa', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    };

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Buscador de miembros */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre, @username o rol (estudiante, experto, empresa)..."
                        className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#829821] focus:bg-white transition-all"
                    />
                </div>
                <span className="text-xs text-zinc-500 self-end sm:self-center font-medium">
                    {filteredMembers.length} {filteredMembers.length === 1 ? 'miembro' : 'miembros'} encontrados
                </span>
            </div>

            {/* Parrilla de miembros */}
            {filteredMembers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200/80 p-8 shadow-sm">
                    <span className="text-4xl block mb-2">🔍</span>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                        No se encontraron miembros
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                        Prueba con otros términos de búsqueda para encontrar estudiantes, expertos o empresas.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredMembers.map((m) => {
                        const displayName =
                            m.profile_name && m.profile_lastname
                                ? `${m.profile_name} ${m.profile_lastname}`
                                : m.usernameOfRegister || m.email?.split('@')[0] || 'Usuario';
                        const badge = roleBadges[m.profile_role] || {
                            label: m.profile_role || 'Miembro',
                            color: 'bg-zinc-100 text-zinc-700 border-zinc-200',
                        };

                        const isMe = user && Number(user.register_id) === Number(m.register_id);

                        return (
                            <div
                                key={m.register_id}
                                className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div className="flex items-start gap-3.5 mb-4">
                                    <Link
                                        to={`/profilepublic/${m.register_id}`}
                                        className="shrink-0 group"
                                    >
                                        {m.avatar ? (
                                            <img
                                                src={`${import.meta.env.VITE_BASE_URL}/uploads/${m.avatar}`}
                                                alt={displayName}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-zinc-200 group-hover:border-[#829821] transition-colors"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-lg border-2 border-zinc-200 group-hover:border-[#829821] transition-colors">
                                                {displayName[0]?.toUpperCase() || '👤'}
                                            </div>
                                        )}
                                    </Link>

                                    <div className="min-w-0 flex-grow">
                                        <Link
                                            to={`/profilepublic/${m.register_id}`}
                                            className="font-bold text-sm sm:text-base text-zinc-900 hover:text-[#829821] transition-colors line-clamp-1"
                                        >
                                            {displayName}
                                        </Link>
                                        <p className="text-xs text-zinc-500 truncate">
                                            @{m.profile_username || m.usernameOfRegister || 'usuario'}
                                        </p>
                                        <span
                                            className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${badge.color}`}
                                        >
                                            {badge.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Estadísticas de proyectos */}
                                <div className="flex items-center gap-4 py-2 px-3 bg-zinc-50 rounded-xl text-xs text-zinc-600 mb-4">
                                    <div>
                                        <span className="font-bold text-zinc-900">{m.projects_count || 0}</span>{' '}
                                        <span>proyectos</span>
                                    </div>
                                    <span className="text-zinc-300">•</span>
                                    <div>
                                        <span className="font-bold text-zinc-900">{m.followers_count || 0}</span>{' '}
                                        <span>seguidores</span>
                                    </div>
                                </div>

                                {/* Acciones: Seguir y Mensaje */}
                                {!isMe ? (
                                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                                        <div className="flex-grow">
                                            <FollowButton
                                                targetUserId={m.register_id}
                                                size="small"
                                                onStatusChange={(newStatus) => {
                                                    setMembers((prev) =>
                                                        prev.map((item) =>
                                                            Number(item.register_id) === Number(m.register_id)
                                                                ? { ...item, followers_count: newStatus.followersCount }
                                                                : item
                                                        )
                                                    );
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedChatUser(m)}
                                            className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 shrink-0"
                                            title="Enviar mensaje directo"
                                        >
                                            <span>💬</span>
                                            <span>Mensaje</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-1 text-xs font-semibold text-zinc-400 border-t border-zinc-100">
                                        (Tu perfil)
                                    </div>
                                )}
                            </div>
                        );
                    })}
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
