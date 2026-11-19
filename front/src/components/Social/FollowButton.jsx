import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../../context/AuthContext';
import { toggleFollowService, getFollowStatusService } from '../../services/socialService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const FollowButton = ({ targetUserId, initialStatus = null, onStatusChange = null, size = 'normal' }) => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [status, setStatus] = useState(
        initialStatus || {
            isFollowing: false,
            isFollower: false,
            isMutual: false,
            followersCount: 0,
            followingCount: 0,
        }
    );
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const isOwnProfile = user && Number(user.register_id) === Number(targetUserId);

    useEffect(() => {
        if (!targetUserId || isOwnProfile) return;

        let isMounted = true;
        const fetchStatus = async () => {
            try {
                const data = await getFollowStatusService({ userId: targetUserId, token });
                if (isMounted) {
                    setStatus(data);
                }
            } catch (err) {
                // Silently ignore status fetch error
            }
        };

        fetchStatus();
        return () => {
            isMounted = false;
        };
    }, [targetUserId, token, isOwnProfile]);

    if (isOwnProfile) {
        return null; // No mostrar botón de seguirse a uno mismo
    }

    const handleToggleFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || !token) {
            toast('Inicia sesión para seguir a otros usuarios', { icon: '🔒' });
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const result = await toggleFollowService({ userId: targetUserId, token });
            setStatus((prev) => {
                const next = {
                    ...prev,
                    isFollowing: result.isFollowing,
                    isMutual: result.isMutual,
                    followersCount: result.followersCount,
                };
                if (onStatusChange) onStatusChange(next);
                return next;
            });

            if (result.isFollowing) {
                if (result.isMutual) {
                    toast.success('¡Ahora sois amigos mutuos! 🤝');
                } else {
                    toast.success('Ahora sigues a este usuario');
                }
            } else {
                toast('Has dejado de seguir a este usuario', { icon: '👋' });
            }
        } catch (err) {
            toast.error(err.message || 'Error al actualizar seguimiento');
        } finally {
            setLoading(false);
        }
    };

    const isSmall = size === 'small';

    if (status.isFollowing) {
        return (
            <button
                type="button"
                onClick={handleToggleFollow}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={loading}
                className={`inline-flex items-center gap-1.5 font-semibold rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50 ${
                    isSmall ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
                } ${
                    isHovered
                        ? 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100'
                        : 'bg-zinc-100 border border-zinc-200 text-zinc-800 hover:bg-zinc-200'
                }`}
            >
                {loading ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : isHovered ? (
                    <>
                        <span>✕</span>
                        <span>Dejar de seguir</span>
                    </>
                ) : (
                    <>
                        <span>{status.isMutual ? '🤝' : '✓'}</span>
                        <span>{status.isMutual ? 'Amigos' : 'Siguiendo'}</span>
                    </>
                )}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleToggleFollow}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 font-semibold rounded-xl bg-[#829821] hover:bg-[#72851d] text-white shadow-sm transition-all duration-200 disabled:opacity-50 ${
                isSmall ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
            }`}
        >
            {loading ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
                <>
                    <span>➕</span>
                    <span>{status.isFollower ? 'Seguir también' : 'Seguir'}</span>
                </>
            )}
        </button>
    );
};

FollowButton.propTypes = {
    targetUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    initialStatus: PropTypes.object,
    onStatusChange: PropTypes.func,
    size: PropTypes.string,
};
