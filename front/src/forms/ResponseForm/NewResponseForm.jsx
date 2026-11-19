import Loading from '../../components/loading';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { insertResponseService } from '../../services/responsesService';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useParams } from 'react-router-dom';
import useQuestion from '../../hooks/QuestionsHook/useQuestion';
import { useProfile } from '../../hooks/profilehook/useProfile';

const NewResponseForm = ({ setIdResponse }) => {
    const [response_text, setResponse_text] = useState('');
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const { token, user } = useContext(AuthContext);
    const { question } = useQuestion(id, token);
    const { profile } = useProfile(user?.register_id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!response_text.trim()) return;

        try {
            setLoading(true);
            const data = await insertResponseService(
                response_text,
                token,
                question.question_id
            );

            setIdResponse(data.resposeID);
            setResponse_text('');
            toast.success('Respuesta publicada con éxito');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-[#829821]/10 text-[#829821] rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                    ✍️
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-1">
                    ¿Conoces la solución a esta consulta?
                </h3>
                <p className="text-xs text-zinc-500 mb-4 max-w-sm mx-auto">
                    Inicia sesión en tu cuenta para aportar tu respuesta y ayudar a la comunidad.
                </p>
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#829821] hover:bg-[#72851d] text-white text-sm font-medium rounded-xl shadow-sm transition-all"
                >
                    Iniciar sesión para responder
                </Link>
            </div>
        );
    }

    const canRespond =
        profile?.profile_role !== 'student' ||
        user?.register_id === question?.user_id;

    if (!canRespond) {
        return (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 text-sm text-amber-800">
                <p className="font-medium">Solo expertos, empresas o el autor pueden responder preguntas.</p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                    <span>💬</span>
                    <span>Tu Respuesta Técnica</span>
                </h3>
                <span className="text-xs text-zinc-400">
                    {response_text.length} caracteres
                </span>
            </div>

            <textarea
                className="w-full px-4 py-3 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all resize-none"
                name="response_text"
                id="response_text"
                value={response_text}
                onChange={(e) => setResponse_text(e.target.value)}
                required
                placeholder="Escribe una explicación clara o comparte un snippet de solución..."
                rows="4"
            />

            <div className="flex justify-end">
                {loading ? (
                    <Loading />
                ) : (
                    <button
                        type="submit"
                        disabled={loading || !response_text.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#829821] hover:bg-[#72851d] disabled:opacity-50 text-white font-medium rounded-xl shadow-sm transition-all text-sm"
                    >
                        <span>Publicar Respuesta</span>
                        <span>→</span>
                    </button>
                )}
            </div>
        </form>
    );
};

NewResponseForm.propTypes = {
    setIdResponse: PropTypes.any,
};

export default NewResponseForm;

