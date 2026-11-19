import { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../../context/AuthContext';
import { sendMessageService, getConversationService } from '../../services/messageService';
import { toast } from 'react-hot-toast';
import {
    CHAT_EMOJIS,
    CHAT_STICKERS,
    parseStickerMessage,
} from '../../utils/chatStickers';

export const ChatModal = ({ isOpen, onClose, targetUser }) => {
    const { user, token } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTab, setPickerTab] = useState('emojis'); // 'emojis' | 'stickers'
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMessages = async (silent = false) => {
        if (!targetUser?.register_id || !token) return;
        try {
            if (!silent) setLoading(true);
            const data = await getConversationService({
                userId: targetUser.register_id,
                token,
            });
            setMessages(data || []);
        } catch {
            // Silently fail on polling
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && targetUser?.register_id) {
            loadMessages();
            // Polling cada 4 segundos mientras el chat esté abierto
            const interval = setInterval(() => {
                loadMessages(true);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [isOpen, targetUser?.register_id, token]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!isOpen || !targetUser) return null;

    const sendText = async (text, { clearInput = false } = {}) => {
        if (!text.trim() || sending) return;
        const cleanText = text.trim();
        if (clearInput) setNewMessage('');

        // Optimistic UI update
        const tempId = `temp-${Date.now()}`;
        const tempMsg = {
            message_id: tempId,
            sender_id: user.register_id,
            receiver_id: targetUser.register_id,
            message_text: cleanText,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMsg]);

        try {
            setSending(true);
            const savedMsg = await sendMessageService({
                receiverId: targetUser.register_id,
                messageText: cleanText,
                token,
            });
            setMessages((prev) =>
                prev.map((m) => (m.message_id === tempId ? savedMsg : m))
            );
        } catch (err) {
            toast.error(err.message || 'Error al enviar mensaje');
            setMessages((prev) => prev.filter((m) => m.message_id !== tempId));
            if (clearInput) setNewMessage(cleanText);
        } finally {
            setSending(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setShowPicker(false);
        await sendText(newMessage, { clearInput: true });
    };

    const handleEmojiClick = (emoji) => {
        setNewMessage((prev) => `${prev}${emoji}`);
        inputRef.current?.focus();
    };

    const handleStickerClick = async (sticker) => {
        setShowPicker(false);
        await sendText(`[sticker:${sticker.id}]`);
    };

    const recipientName =
        targetUser.profile_name && targetUser.profile_lastname
            ? `${targetUser.profile_name} ${targetUser.profile_lastname}`
            : targetUser.usernameOfRegister || targetUser.email?.split('@')[0] || 'Usuario';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-lg flex flex-col h-[560px] overflow-hidden">
                {/* Cabecera del chat */}
                <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
                    <div className="flex items-center gap-3 min-w-0">
                        {targetUser.avatar ? (
                            <img
                                src={`${import.meta.env.VITE_BASE_URL}/uploads/${targetUser.avatar}`}
                                alt={recipientName}
                                className="w-10 h-10 rounded-full object-cover border-2 border-[#829821]"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-sm border border-zinc-700">
                                {recipientName[0]?.toUpperCase() || '👤'}
                            </div>
                        )}
                        <div className="min-w-0">
                            <h3 className="font-bold text-sm text-white truncate">
                                {recipientName}
                            </h3>
                            <p className="text-xs text-zinc-400 truncate">
                                @{targetUser.profile_username || targetUser.usernameOfRegister || 'usuario'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                        aria-label="Cerrar chat"
                    >
                        ✕
                    </button>
                </div>

                {/* Lista de mensajes */}
                <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-zinc-50">
                    {loading && messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-xs text-zinc-400">
                            Cargando mensajes...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-zinc-400">
                            <span className="text-4xl mb-2">👋</span>
                            <p className="text-sm font-semibold text-zinc-700">
                                Inicia la conversación con {recipientName}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                                Saluda, comparte ideas sobre proyectos o haz una pregunta profesional.
                            </p>
                        </div>
                    ) : (
                        messages.map((m) => {
                            const isMe = Number(m.sender_id) === Number(user?.register_id);
                            const sticker = parseStickerMessage(m.message_text);
                            return (
                                <div
                                    key={m.message_id}
                                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                >
                                    {sticker ? (
                                        <div
                                            className={`px-5 py-3.5 rounded-2xl bg-gradient-to-br ${sticker.bg} border ${sticker.border} shadow-sm flex flex-col items-center gap-1 select-none`}
                                        >
                                            <span className="text-5xl leading-none">{sticker.emoji}</span>
                                            <span className={`text-xs font-bold ${sticker.text}`}>
                                                {sticker.label}
                                            </span>
                                        </div>
                                    ) : (
                                        <div
                                            className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                                isMe
                                                    ? 'bg-[#829821] text-white rounded-br-sm'
                                                    : 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-sm'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap break-words">{m.message_text}</p>
                                        </div>
                                    )}
                                    <span className="text-[10px] text-zinc-400 mt-1 px-1">
                                        {new Date(m.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Selector de emoticonos y stickers */}
                {showPicker && (
                    <div className="border-t border-zinc-200 bg-white px-3 pt-2.5 pb-3">
                        <div className="flex items-center gap-2 mb-2.5 border-b border-zinc-100 pb-2">
                            <button
                                type="button"
                                onClick={() => setPickerTab('emojis')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    pickerTab === 'emojis'
                                        ? 'bg-[#829821] text-white'
                                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                }`}
                            >
                                😊 Emoticonos
                            </button>
                            <button
                                type="button"
                                onClick={() => setPickerTab('stickers')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    pickerTab === 'stickers'
                                        ? 'bg-[#829821] text-white'
                                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                }`}
                            >
                                🎨 Stickers
                            </button>
                        </div>

                        {pickerTab === 'emojis' ? (
                            <div className="grid grid-cols-8 gap-1 max-h-36 overflow-y-auto">
                                {CHAT_EMOJIS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleEmojiClick(emoji)}
                                        className="text-xl p-1.5 rounded-lg hover:bg-zinc-100 transition-transform hover:scale-110"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto">
                                {CHAT_STICKERS.map((sticker) => (
                                    <button
                                        key={sticker.id}
                                        type="button"
                                        onClick={() => handleStickerClick(sticker)}
                                        disabled={sending}
                                        className={`p-2 rounded-xl bg-gradient-to-br ${sticker.bg} border ${sticker.border} flex flex-col items-center gap-0.5 hover:scale-[1.03] transition-transform`}
                                    >
                                        <span className="text-2xl">{sticker.emoji}</span>
                                        <span className={`text-[10px] font-bold ${sticker.text} truncate max-w-full`}>
                                            {sticker.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Formulario de envío */}
                <form
                    onSubmit={handleSend}
                    className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
                >
                    <button
                        type="button"
                        onClick={() => setShowPicker((prev) => !prev)}
                        className={`p-2.5 rounded-xl text-lg transition-colors shrink-0 ${
                            showPicker
                                ? 'bg-[#829821]/15 text-[#829821]'
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
                        }`}
                        title="Emoticonos y Stickers"
                        aria-label="Abrir selector de emoticonos y stickers"
                    >
                        😊
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Escribe un mensaje a ${recipientName}...`}
                        className="flex-grow px-4 py-2.5 bg-zinc-100 focus:bg-white border border-transparent focus:border-[#829821] rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none transition-all"
                        disabled={sending}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="px-4 py-2.5 bg-[#829821] hover:bg-[#72851d] text-white font-bold rounded-xl text-sm shadow-sm transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0"
                    >
                        <span>Enviar</span>
                        <span>➤</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

ChatModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    targetUser: PropTypes.object,
};
