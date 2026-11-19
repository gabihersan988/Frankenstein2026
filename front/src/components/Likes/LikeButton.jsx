import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../../context/AuthContext';
import { toggleProjectLikeService, getProjectLikesService } from '../../services/likeService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const LikeButton = ({ projectId, initialLikesCount = 0, size = 'normal', showLabel = false }) => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [likesCount, setLikesCount] = useState(Number(initialLikesCount) || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setLikesCount(Number(initialLikesCount) || 0);
    }, [initialLikesCount]);

    useEffect(() => {
        if (!projectId) return;

        let isMounted = true;
        const checkLikeStatus = async () => {
            try {
                const data = await getProjectLikesService({ projectId, token });
                if (isMounted) {
                    setIsLiked(data.isLiked);
                    if (data.likesCount !== undefined) {
                        setLikesCount(data.likesCount);
                    }
                }
            } catch {
                // Silently ignore
            }
        };

        checkLikeStatus();
        return () => {
            isMounted = false;
        };
    }, [projectId, token]);

    const handleToggleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || !token) {
            toast('Inicia sesión para dar Me Gusta', { icon: '❤️' });
            navigate('/login');
            return;
        }

        if (loading) return;

        // Optimistic UI update
        const prevLiked = isLiked;
        const prevCount = likesCount;

        setIsLiked(!prevLiked);
        setLikesCount((prev) => (prevLiked ? Math.max(0, prev - 1) : prev + 1));
        setAnimate(true);
        setTimeout(() => setAnimate(false), 300);

        try {
            setLoading(true);
            const data = await toggleProjectLikeService({ projectId, token });
            setIsLiked(data.isLiked);
            setLikesCount(data.likesCount);
            if (data.isLiked) {
                toast.success('¡Te gusta este proyecto! ❤️');
            }
        } catch (err) {
            // Revert on error
            setIsLiked(prevLiked);
            setLikesCount(prevCount);
            toast.error(err.message || 'Error al procesar el like');
        } finally {
            setLoading(false);
        }
    };

    const isSmall = size === 'small';
    const isLarge = size === 'large';

    return (
        <button
            type="button"
            onClick={handleToggleLike}
            disabled={loading}
            aria-label={isLiked ? 'Ya no me gusta' : 'Me gusta'}
            className={`group inline-flex items-center gap-1.5 font-semibold rounded-xl transition-all duration-200 select-none ${
                isLarge
                    ? 'px-4 py-2 text-sm bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 shadow-sm'
                    : isSmall
                    ? 'px-2 py-1 text-xs hover:bg-zinc-100 rounded-lg'
                    : 'px-3 py-1.5 text-xs bg-zinc-50 hover:bg-rose-50 border border-zinc-200/80 hover:border-rose-200 rounded-xl'
            } ${isLiked ? 'text-rose-600' : 'text-zinc-600 hover:text-rose-600'}`}
        >
            <span
                className={`transition-transform duration-200 inline-block text-base leading-none ${
                    animate ? 'scale-125' : 'group-hover:scale-110'
                } ${isLiked ? 'filter drop-shadow-sm' : 'grayscale group-hover:grayscale-0'}`}
            >
                {isLiked ? '❤️' : '🤍'}
            </span>
            <span className="font-bold tabular-nums">{likesCount}</span>
            {showLabel && (
                <span className="font-medium text-xs hidden sm:inline">
                    {isLiked ? 'Te gusta' : 'Me gusta'}
                </span>
            )}
        </button>
    );
};

LikeButton.propTypes = {
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    initialLikesCount: PropTypes.number,
    size: PropTypes.string,
    showLabel: PropTypes.bool,
};
