import PropType from 'prop-types';
import moment from 'moment';
import AddVoteForm from '../../forms/VoteForms/AddVoteForm';
import { insertResponseVoteService } from '../../services/responsesService';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import useResponses from '../../hooks/ResponsesHook/useResponses';

const ResponsesListItem = ({ response }) => {
    const { user, token } = useContext(AuthContext);
    const { addResponseVote } = useResponses(response.response_id);

    return (
        <li className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 shadow-sm transition-all hover:border-zinc-300">
            {/* Cabecera de la respuesta: autor / fecha y votos */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#829821]/15 text-[#6c7f1a] font-bold flex items-center justify-center text-sm border border-[#829821]/20">
                        {response.profile_username?.[0]?.toUpperCase() || '💬'}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-zinc-900">
                            {response.profile_username || 'Miembro de la comunidad'}
                        </div>
                        <time className="text-xs text-zinc-400">
                            {moment(response.created_at).format('DD/MM/YYYY [a las] HH:mm')}
                        </time>
                    </div>
                </div>

                {/* Widget de Votación */}
                <div className="flex items-center bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200/60 self-start sm:self-auto">
                    <AddVoteForm
                        insertResponseVotesService={insertResponseVoteService}
                        addResponseVote={addResponseVote}
                        votes={response.votes}
                        response_id={response.response_id}
                        user={user}
                        token={token}
                    />
                </div>
            </div>

            {/* Texto de la respuesta */}
            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed whitespace-pre-line">
                {response.response_text}
            </p>
        </li>
    );
};

ResponsesListItem.propTypes = {
    response: PropType.object.isRequired,
};

export default ResponsesListItem;

