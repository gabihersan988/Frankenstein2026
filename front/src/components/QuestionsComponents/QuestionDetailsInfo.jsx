import PropType from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';

const QuestionDetailsInfo = ({
    question_title,
    question_technology,
    question_description,
    created_at,
}) => {
    return (
        <article className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm">
            {/* Botón de retroceso y metadatos */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-100">
                <Link
                    to="/questions"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                    <span>←</span>
                    <span>Volver al listado de preguntas</span>
                </Link>

                <div className="flex items-center gap-2">
                    {question_technology && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#829821]/15 text-[#6c7f1a] border border-[#829821]/20">
                            #{question_technology}
                        </span>
                    )}
                    <time className="text-xs text-zinc-400">
                        {moment(created_at).format('DD/MM/YYYY [a las] HH:mm')}
                    </time>
                </div>
            </div>

            {/* Título de la consulta */}
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-4">
                {question_title}
            </h1>

            {/* Descripción detallada */}
            <div className="text-zinc-700 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-zinc-50/70 rounded-xl p-5 border border-zinc-100 font-sans">
                {question_description}
            </div>
        </article>
    );
};

QuestionDetailsInfo.propTypes = {
    question_title: PropType.string.isRequired,
    question_technology: PropType.string.isRequired,
    question_description: PropType.string.isRequired,
    created_at: PropType.string.isRequired,
};

export default QuestionDetailsInfo;

