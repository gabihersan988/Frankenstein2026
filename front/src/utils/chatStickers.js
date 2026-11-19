export const CHAT_EMOJIS = [
    '😀', '😂', '🥹', '😍', '🤩', '😎', '🥳', '🤯',
    '🤔', '😅', '😭', '🙌', '👏', '👍', '👎', '🤝',
    '🙏', '💪', '🔥', '✨', '🚀', '💡', '💻', '🐛',
    '🎉', '❤️', '💚', '⚡', '☕', '🎯', '👀', '👾',
];

export const CHAT_STICKERS = [
    { id: 'rocket', emoji: '🚀', label: '¡Despegamos!', bg: 'from-indigo-500/15 to-sky-500/15', border: 'border-indigo-200', text: 'text-indigo-700' },
    { id: 'fire', emoji: '🔥', label: '¡Brutal!', bg: 'from-orange-500/15 to-rose-500/15', border: 'border-orange-200', text: 'text-orange-700' },
    { id: 'coding', emoji: '💻', label: 'Coding...', bg: 'from-emerald-500/15 to-teal-500/15', border: 'border-emerald-200', text: 'text-emerald-700' },
    { id: 'party', emoji: '🎉', label: '¡Genial!', bg: 'from-amber-500/15 to-yellow-500/15', border: 'border-amber-200', text: 'text-amber-700' },
    { id: 'thanks', emoji: '❤️', label: '¡Gracias!', bg: 'from-rose-500/15 to-pink-500/15', border: 'border-rose-200', text: 'text-rose-700' },
    { id: 'mindblown', emoji: '🤯', label: 'Mind Blown', bg: 'from-purple-500/15 to-fuchsia-500/15', border: 'border-purple-200', text: 'text-purple-700' },
    { id: 'bug', emoji: '🐛', label: 'Bug cazado', bg: 'from-lime-500/15 to-green-500/15', border: 'border-lime-200', text: 'text-lime-800' },
    { id: 'coffee', emoji: '☕', label: 'Café time', bg: 'from-amber-700/15 to-orange-700/15', border: 'border-amber-300', text: 'text-amber-900' },
    { id: 'frankenstein', emoji: '👾', label: 'Frankenstein', bg: 'from-[#829821]/20 to-emerald-500/15', border: 'border-[#829821]/40', text: 'text-[#5b6b15]' },
    { id: 'done', emoji: '👍', label: '¡Hecho!', bg: 'from-sky-500/15 to-cyan-500/15', border: 'border-sky-200', text: 'text-sky-700' },
    { id: 'deal', emoji: '🤝', label: '¡Trato hecho!', bg: 'from-teal-500/15 to-emerald-500/15', border: 'border-teal-200', text: 'text-teal-700' },
    { id: 'top', emoji: '✨', label: '¡Top!', bg: 'from-yellow-500/15 to-amber-500/15', border: 'border-yellow-300', text: 'text-yellow-800' },
];

const STICKER_REGEX = /^\[sticker:([a-z0-9_-]+)\]$/i;

export const parseStickerMessage = (text) => {
    if (!text || typeof text !== 'string') return null;
    const match = text.trim().match(STICKER_REGEX);
    if (!match) return null;
    const stickerId = match[1].toLowerCase();
    return CHAT_STICKERS.find((s) => s.id === stickerId) || null;
};

export const formatMessagePreview = (text) => {
    const sticker = parseStickerMessage(text);
    if (sticker) {
        return `${sticker.emoji} Sticker: ${sticker.label}`;
    }
    return text;
};
