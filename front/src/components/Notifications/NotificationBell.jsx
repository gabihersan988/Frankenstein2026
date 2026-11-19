import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    getNotificationsService,
    markNotificationsReadService,
} from '../../services/notificationService';
import { ChatModal } from '../Messages/ChatModal';
import { formatMessagePreview } from '../../utils/chatStickers';
import { AiOutlineBell } from 'react-icons/ai';

export const NotificationBell = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [chatTarget, setChatTarget] = useState(null);
    const dropdownRef = useRef(null);

    const loadNotifications = async () => {
        if (!token || !user) return;
        try {
            const data = await getNotificationsService({ token });
            setNotifications(data?.notifications || []);
            setUnreadCount(data?.unreadCount || 0);
        } catch {
            // Silencioso en polling
        }
    };

    useEffect(() => {
        if (!token || !user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }
        loadNotifications();
        const interval = setInterval(loadNotifications, 10000);
        return () => clearInterval(interval);
    }, [token, user?.register_id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const handleMarkAllRead = async () => {
        try {
            await markNotificationsReadService({ token, type: 'all' });
            await loadNotifications();
        } catch {
            // Ignorar error puntual
        }
    };

    const handleNotificationClick = async (notif) => {
        setIsOpen(false);
        if (notif.type === 'message') {
            setChatTarget(notif.actor);
            return;
        }
        if (notif.type === 'follow') {
            if (notif.unread && notif.follow_id) {
                try {
                    await markNotificationsReadService({
                        token,
                        type: 'follow',
                        followId: notif.follow_id,
                    });
                    loadNotifications();
                } catch {
                    // Ignorar error puntual
                }
            }
            navigate(`/profilepublic/${notif.actor.register_id}`);
        }
    };

    const getActorName = (actor) => {
        if (actor?.profile_name && actor?.profile_lastname) {
            return `${actor.profile_name} ${actor.profile_lastname}`;
        }
        return actor?.usernameOfRegister || actor?.email?.split('@')[0] || 'Usuario';
    };

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen((prev) => !prev);
                        if (!isOpen) loadNotifications();
                    }}
                    className="relative p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors focus:outline-none"
                    aria-label="Notificaciones"
                    title="Notificaciones"
                >
                    <AiOutlineBell className="text-xl" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50 animate-fadeIn">
                        <div className="px-4 py-3 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold">Notificaciones</span>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={handleMarkAllRead}
                                    className="text-xs text-[#829821] hover:underline font-medium"
                                >
                                    Marcar todo leído
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500">
                                    <span className="text-3xl block mb-2">🔔</span>
                                    <p className="text-sm font-medium text-zinc-700">
                                        No tienes notificaciones
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        Te avisaremos cuando alguien te escriba o empiece a seguirte.
                                    </p>
                                </div>
                            ) : (
                                notifications.map((n) => {
                                    const actorName = getActorName(n.actor);
                                    const preview =
                                        n.type === 'message'
                                            ? formatMessagePreview(n.text)
                                            : n.text;

                                    return (
                                        <button
                                            key={n.id}
                                            type="button"
                                            onClick={() => handleNotificationClick(n)}
                                            className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-zinc-50 transition-colors ${
                                                n.unread ? 'bg-[#829821]/5' : 'bg-white'
                                            }`}
                                        >
                                            <div className="relative shrink-0">
                                                {n.actor?.avatar ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_BASE_URL}/uploads/${n.actor.avatar}`}
                                                        alt={actorName}
                                                        className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-sm">
                                                        {actorName[0]?.toUpperCase() || '👤'}
                                                    </div>
                                                )}
                                                <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 shadow-sm">
                                                    {n.type === 'message' ? '💬' : '👋'}
                                                </span>
                                            </div>

                                            <div className="min-w-0 flex-grow">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-xs font-bold text-zinc-900 truncate">
                                                        {actorName}
                                                    </p>
                                                    <span className="text-[10px] text-zinc-400 shrink-0">
                                                        {new Date(n.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-600 truncate mt-0.5">
                                                    {preview}
                                                </p>
                                                {n.type === 'message' && n.unread_messages > 1 && (
                                                    <span className="inline-block mt-1 text-[10px] font-semibold text-[#829821]">
                                                        {n.unread_messages} mensajes sin leer
                                                    </span>
                                                )}
                                            </div>

                                            {n.unread && (
                                                <span className="w-2 h-2 rounded-full bg-[#829821] shrink-0 mt-2" />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {chatTarget && (
                <ChatModal
                    isOpen={Boolean(chatTarget)}
                    onClose={() => {
                        setChatTarget(null);
                        loadNotifications();
                    }}
                    targetUser={chatTarget}
                />
            )}
        </>
    );
};
