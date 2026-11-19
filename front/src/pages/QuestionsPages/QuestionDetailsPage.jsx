import { useParams } from 'react-router-dom';
import useQuestion from '../../hooks/QuestionsHook/useQuestion.js';
import Loading from '../../components/loading.jsx';
import ResponsesListItem from '../../components/ResponsesComponents/ResponsesListItem.jsx';
import useResponses from '../../hooks/ResponsesHook/useResponses.js';
import NewResponseForm from '../../forms/ResponseForm/NewResponseForm.jsx';
import QuestionDetailsInfo from '../../components/QuestionsComponents/QuestionDetailsInfo';
import { useState } from 'react';

const QuestionDetailsPage = () => {
    const [idResponse, setIdResponse] = useState(null);
    const { id } = useParams();

    const { responses, loading } = useResponses(id, idResponse);
    const { question, loading: questionLoading } = useQuestion(id);

    return (
        <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
            {questionLoading && !question ? (
                <div className="py-20 flex justify-center">
                    <Loading />
                </div>
            ) : question ? (
                <>
                    {/* Pregunta principal */}
                    <QuestionDetailsInfo
                        question_title={question.question_title}
                        question_technology={question.technology}
                        question_description={question.question_description}
                        created_at={question.created_at}
                    />

                    {/* Formulario para añadir respuesta */}
                    <NewResponseForm setIdResponse={setIdResponse} />

                    {/* Listado de respuestas */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                <span>💬</span>
                                <span>Respuestas ({responses ? responses.length : 0})</span>
                            </h2>
                        </div>

                        {loading && responses.length === 0 ? (
                            <div className="py-8 flex justify-center">
                                <Loading />
                            </div>
                        ) : responses.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-zinc-200/80 p-8 text-center text-zinc-500 shadow-sm">
                                <span className="text-3xl block mb-2">💭</span>
                                <p className="text-sm font-medium text-zinc-700">Aún no hay respuestas para esta consulta.</p>
                                <p className="text-xs text-zinc-400 mt-1">Sé el primero en compartir tu experiencia.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {responses.map((response) => (
                                    <ResponsesListItem
                                        key={response.response_id}
                                        response={response}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>
                </>
            ) : (
                <div className="bg-white rounded-2xl p-8 text-center border border-zinc-200 shadow-sm">
                    <p className="text-zinc-600">No se encontró la pregunta solicitada.</p>
                </div>
            )}
        </main>
    );
};

export default QuestionDetailsPage;

