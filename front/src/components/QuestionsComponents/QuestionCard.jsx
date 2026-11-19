import PropType from 'prop-types';
import { Link } from 'react-router-dom';

export const QuestionCard = ({ question }) => {
    return (
        <article className="group flex flex-col bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
            <Link to={`/question/${question.question_id}`} className="flex flex-col h-full">
                {/* Cabecera de la tarjeta: Badge de Tecnología y Fecha */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[#829821]/15 text-[#73871d] uppercase tracking-wider">
                        #{question.technology || 'General'}
                    </span>
                    <time className="text-xs text-zinc-400 font-medium">
                        {new Date(question.created_at).toLocaleDateString()}
                    </time>
                </div>

                {/* Título de la pregunta */}
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-[#829821] transition-colors leading-snug line-clamp-2">
                    {question.question_title}
                </h3>

                {/* Descripción */}
                <p className="text-xs sm:text-sm text-zinc-600 line-clamp-3 mt-2 leading-relaxed flex-grow">
                    {question.question_description || 'Sin descripción adicional.'}
                </p>

                {/* Pie de tarjeta */}
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-medium text-zinc-400">Comunidad Frankenstein</span>
                    <span className="text-[#829821] font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        Ver respuestas <span>→</span>
                    </span>
                </div>
            </Link>
        </article>
    );
};

QuestionCard.propTypes = {
    question: PropType.object.isRequired,
};
