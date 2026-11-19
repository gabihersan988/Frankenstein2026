import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getConversationsService } from '../../services/messageService';
import { ChatModal } from './ChatModal';
import Loading from '../loading';
import { formatMessagePreview } from '../../utils/chatStickers';

export const ConversationsView = () => {
    const { token, user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const loadConversations = async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError('');
            const data = await getConversationsService({ token });
            setConversations(data || []);
        } catch (err) {
            setError(err.message || 'Error al cargar mensajes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConversations();
    }, [token]);

    if (!user) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200 text-sm text-zinc-500">
                Inicia sesión para ver tus mensajes y conversaciones.
            </div>
        );
    }

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

    return (
        <div className="space-y-4">
            {conversations.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200/80 p-8 shadow-sm">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        💬
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                        Sin conversaciones todavía
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-4">
                        Conecta con otros miembros de Frankenstein, síguelos y envíales un mensaje directo para iniciar una conversación.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-zinc-100 bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm">
                    {conversations.map((c) => {
                        const displayName =
                            c.profile_name && c.profile_lastname
                                ? `${c.profile_name} ${c.profile_lastname}`
                                : c.usernameOfRegister || c.email?.split('@')[0] || 'Usuario';
                        const isLastFromMe = Number(c.last_sender_id) === Number(user.register_id);

                        return (
                            <div
                                key={c.register_id}
                                onClick={() => setSelectedUser(c)}
                                className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors cursor-pointer gap-4"
                            >
                                <div className="flex items-center gap-3.5 min-w-0 flex-grow">
                                    <div className="relative shrink-0">
                                        {c.avatar ? (
                                            <img
                                                src={`${import.meta.env.VITE_BASE_URL}/uploads/${c.avatar}`}
                                                alt={displayName}
                                                className="w-12 h-12 rounded-full object-cover border border-zinc-200"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-base">
                                                {displayName[0]?.toUpperCase() || '👤'}
                                            </div>
                                        )}
                                        {c.unread_count > 0 && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                                                {c.unread_count}
                                            </span>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-grow">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-zinc-900 truncate">
                                                {displayName}
                                            </h4>
                                            <span className="text-[11px] text-zinc-400 shrink-0">
                                                {new Date(c.last_message_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {isLastFromMe && <span className="text-[#829821] font-semibold">Tú: </span>}
                                            {formatMessagePreview(c.message_text)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUser(c);
                                    }}
                                    className="px-3 py-1.5 bg-zinc-100 hover:bg-[#829821] hover:text-white text-zinc-700 text-xs font-semibold rounded-xl transition-all shrink-0"
                                >
                                    Chatear
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedUser && (
                <ChatModal
                    isOpen={Boolean(selectedUser)}
                    onClose={() => {
                        setSelectedUser(null);
                        loadConversations();
                    }}
                    targetUser={selectedUser}
                />
            )}
        </div>
    );
};
