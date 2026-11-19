import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FollowButton } from '../Social/FollowButton';
import { getFollowStatusService } from '../../services/socialService';
import { ChatModal } from '../Messages/ChatModal';

export const Profile = ({ profile = {}, updateProfile }) => {
    const { user, token } = useContext(AuthContext);

    const {
        profile_name,
        profile_lastname,
        profile_username,
        birthdate,
        avatar,
        profile_role,
        register_id,
        company_name,
        is_company_validated,
    } = profile;

    const targetUserId = register_id || profile?.register_id;
    const isOwner = Boolean(user && targetUserId && Number(user.register_id) === Number(targetUserId));
    const [chatOpen, setChatOpen] = useState(false);

    const [followStats, setFollowStats] = useState({
        followersCount: 0,
        followingCount: 0,
        friendsCount: 0,
        isFollowing: false,
        isFollower: false,
        isMutual: false,
    });

    useEffect(() => {
        if (!targetUserId) return;
        let isMounted = true;
        const fetchStats = async () => {
            try {
                const data = await getFollowStatusService({ userId: targetUserId, token });
                if (isMounted) {
                    setFollowStats(data);
                }
            } catch {
                // Silently ignore
            }
        };
        fetchStats();
        return () => {
            isMounted = false;
        };
    }, [targetUserId, token]);

    if (!profile || profile.profile_name == null) {
        return (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-2xl shadow-sm text-center max-w-lg mx-auto my-8 border border-zinc-200">
                <span className="text-5xl mb-4">👤</span>
                <h2 className="text-xl font-bold text-zinc-900 mb-2">
                    Aún no has completado tu perfil
                </h2>
                <p className="text-sm text-zinc-600 mb-6 max-w-sm">
                    Configura tu nombre, rol profesional y avatar para que la comunidad de Frankenstein pueda conocer tu trabajo.
                </p>
                <Link
                    to="/newprofile"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#829821] hover:bg-[#72851d] text-white font-medium rounded-xl shadow-sm transition-all"
                >
                    <span>Completar mi perfil</span>
                    <span>→</span>
                </Link>
            </div>
        );
    }

    // Rol formateado y estilo
    const roleLabels = {
        student: { label: 'Estudiante', icon: '🎓', color: 'bg-blue-50 text-blue-700 border-blue-200' },
        expert: { label: 'Experto', icon: '⭐', color: 'bg-amber-50 text-amber-700 border-amber-200' },
        company: { label: 'Empresa', icon: '🏢', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    };

    const roleInfo = roleLabels[profile_role] || {
        label: profile_role || 'Miembro',
        icon: '👤',
        color: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden mb-8">
            {/* Banner superior decorativo */}
            <div className="h-32 sm:h-40 bg-gradient-to-r from-zinc-900 via-neutral-900 to-zinc-950 relative border-b border-zinc-800">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#829821_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            {/* Contenido principal del perfil */}
            <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-5 gap-4">
                    {/* Avatar */}
                    <div className="relative inline-block self-center sm:self-auto">
                        {avatar ? (
                            <img
                                loading="lazy"
                                src={`${import.meta.env.VITE_BASE_URL}/uploads/${avatar}`}
                                alt={`${profile_name} ${profile_lastname}`}
                                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-md bg-white"
                            />
                        ) : (
                            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-zinc-200 flex items-center justify-center text-4xl sm:text-5xl font-bold text-zinc-600 border-4 border-white shadow-md">
                                {profile_name?.[0]?.toUpperCase() || '👤'}
                            </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="self-center sm:self-auto flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
                        {isOwner ? (
                            <Link
                                to="/profileupdate"
                                state={{ profile }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                            >
                                <span>✏️</span>
                                <span>Modificar Perfil</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                                {followStats.isMutual && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                        <span>🤝</span>
                                        <span>Amigos</span>
                                    </span>
                                )}
                                {!followStats.isMutual && followStats.isFollower && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                                        Te sigue
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setChatOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold shadow-sm transition-all"
                                >
                                    <span>💬</span>
                                    <span>Enviar Mensaje</span>
                                </button>
                                <FollowButton
                                    targetUserId={targetUserId}
                                    initialStatus={followStats}
                                    onStatusChange={(updated) => setFollowStats((prev) => ({ ...prev, ...updated }))}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {chatOpen && (
                    <ChatModal
                        isOpen={chatOpen}
                        onClose={() => setChatOpen(false)}
                        targetUser={profile}
                    />
                )}

                {/* Nombre y username */}
                <div className="space-y-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                            {profile_name} {profile_lastname}
                        </h1>

                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleInfo.color} self-center sm:self-auto`}
                        >
                            <span>{roleInfo.icon}</span>
                            <span>{roleInfo.label}</span>
                        </span>
                    </div>

                    <p className="text-sm font-medium text-[#829821]">
                        @{profile_username || 'usuario'}
                    </p>
                </div>

                {/* Contadores sociales (Seguidores, Siguiendo, Amigos) */}
                <div className="flex items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-zinc-100 text-xs sm:text-sm justify-center sm:justify-start">
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-900">{followStats.followersCount}</span>
                        <span className="text-zinc-500">seguidores</span>
                    </div>
                    <span className="text-zinc-300">•</span>
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-900">{followStats.followingCount}</span>
                        <span className="text-zinc-500">siguiendo</span>
                    </div>
                    <span className="text-zinc-300">•</span>
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-900">{followStats.friendsCount}</span>
                        <span className="text-zinc-500">amigos</span>
                    </div>
                </div>

                {/* Chips de metadatos del perfil */}
                <div className="flex flex-wrap items-center gap-3 pt-4 mt-4 border-t border-zinc-100 text-xs sm:text-sm text-zinc-600 justify-center sm:justify-start">
                    {birthdate && (
                        <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200/60">
                            <span>🎂</span>
                            <span>
                                {new Date(birthdate).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    )}

                    {company_name && (
                        <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200/60">
                            <span>🏢</span>
                            <span className="font-medium text-zinc-800">{company_name}</span>
                            {profile_role === 'company' && (
                                is_company_validated ? (
                                    <span className="text-emerald-600 font-semibold text-xs ml-1">✓ Validada</span>
                                ) : (
                                    <span className="text-amber-600 font-semibold text-xs ml-1">⏳ Pendiente de validación</span>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

Profile.propTypes = {
    profile: PropTypes.object,
    updateProfile: PropTypes.func,
};
