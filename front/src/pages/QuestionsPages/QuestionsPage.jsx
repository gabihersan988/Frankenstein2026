import useQuestions from '../../hooks/QuestionsHook/useQuestions.js';
import Loading from '../../components/loading';
import SearchForm from '../../forms/QuestionsForms/SearchQuestionForm';
import { QuestionCard } from '../../components/QuestionsComponents/QuestionCard.jsx';
import { Link } from 'react-router-dom';

const QuestionsPage = () => {
    const {
        questions,
        setSearchParams,
        prevPage,
        currentPage,
        nextPage,
        loading,
    } = useQuestions();

    return (
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Cabecera / Hero de Preguntas */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-zinc-200 gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#829821]/10 text-[#829821] text-xs font-semibold mb-2">
                        <span>💬</span>
                        <span>Comunidad Técnica</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                        Preguntas y Discusiones
                    </h1>
                    <p className="text-sm text-zinc-600 mt-1 max-w-xl">
                        Resuelve dudas de código, debate sobre tecnologías y colabora con otros desarrolladores.
                    </p>
                </div>
                <Link
                    to="/questions/newquestion"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#829821] hover:bg-[#72851d] text-white font-medium rounded-xl shadow-sm transition-all duration-200 self-start md:self-auto shrink-0"
                >
                    <span>➕</span>
                    <span>Hacer una Pregunta</span>
                </Link>
            </div>

            {/* Formulario de búsqueda / filtros */}
            <div className="mb-6">
                <SearchForm setSearchParams={setSearchParams} loading={loading} />
            </div>

            {/* Listado de preguntas */}
            {loading && questions.length === 0 ? (
                <div className="py-16 flex justify-center">
                    <Loading />
                </div>
            ) : questions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        💡
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                        No se encontraron preguntas
                    </h3>
                    <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
                        Sé el primero en formular una duda o cambiar los filtros de búsqueda.
                    </p>
                    <Link
                        to="/questions/newquestion"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#829821] hover:bg-[#72851d] text-white font-medium rounded-xl shadow-sm transition-all"
                    >
                        Formular Pregunta
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {questions.map((question) => (
                            <QuestionCard
                                key={question.question_id}
                                question={question}
                            />
                        ))}
                    </div>

                    {/* Controles de paginación */}
                    <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
                        <button
                            onClick={() => {
                                setSearchParams(
                                    new URLSearchParams({
                                        page: prevPage,
                                    })
                                );
                            }}
                            disabled={!prevPage}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                prevPage
                                    ? 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 shadow-sm'
                                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            }`}
                        >
                            <span>←</span>
                            <span>Anterior</span>
                        </button>

                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-3.5 py-1.5 rounded-full">
                            Página {currentPage}
                        </div>

                        <button
                            onClick={() => {
                                setSearchParams(
                                    new URLSearchParams({
                                        page: nextPage,
                                    })
                                );
                            }}
                            disabled={!nextPage}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                nextPage
                                    ? 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 shadow-sm'
                                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            }`}
                        >
                            <span>Siguiente</span>
                            <span>→</span>
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default QuestionsPage;

