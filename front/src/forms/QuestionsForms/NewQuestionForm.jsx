import PropType from 'prop-types';
import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Loading from '../../components/loading';
import { toast } from 'react-hot-toast';
import { insertQuestionService } from '../../services/questionService';
import { AuthContext } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionSchema } from '../../../schemas/questionSchema';

const NewQuestionForm = () => {
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onTouched',
        resolver: zodResolver(questionSchema),
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }

            await insertQuestionService({
                data: formData,
                token,
            });

            toast.success('Pregunta creada exitosamente');
            navigate('/questions');
        } catch (err) {
            console.error(err);
            toast.error('Ha habido un problema al publicar la pregunta');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-zinc-200 shadow-sm text-center">
                <span className="text-4xl block mb-3">🔒</span>
                <h2 className="text-xl font-bold text-zinc-900 mb-2">Inicia sesión para preguntar</h2>
                <p className="text-sm text-zinc-500 mb-6">
                    Debes contar con una cuenta activa en Frankenstein para participar en la comunidad técnica.
                </p>
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#829821] hover:bg-[#72851d] text-white font-medium rounded-xl shadow-sm transition-all"
                >
                    Iniciar Sesión
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm">
                {/* Cabecera del formulario */}
                <div className="mb-6 pb-4 border-b border-zinc-100">
                    <Link
                        to="/questions"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-2"
                    >
                        <span>←</span>
                        <span>Volver a preguntas</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                        <span>💡</span>
                        <span>Formular una Pregunta</span>
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Sé específico e incluye la tecnología y contexto necesario para recibir respuestas rápidas y de calidad.
                    </p>
                </div>

                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    {/* Título de la pregunta */}
                    <div>
                        <label
                            htmlFor="question_title"
                            className="block text-sm font-semibold text-zinc-800 mb-1"
                        >
                            Título descriptivo
                        </label>
                        <input
                            className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                            type="text"
                            name="question_title"
                            id="question_title"
                            placeholder="Ej: ¿Cómo optimizar un renderizado condicional en React 18?"
                            {...register('question_title')}
                        />
                        {errors.question_title && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.question_title?.message}
                            </p>
                        )}
                    </div>

                    {/* Tecnología */}
                    <div>
                        <label
                            htmlFor="technology"
                            className="block text-sm font-semibold text-zinc-800 mb-1"
                        >
                            Tecnología o Lenguaje
                        </label>
                        <input
                            className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                            type="text"
                            name="technology"
                            id="technology"
                            placeholder="Ej: React, Node.js, Python, Tailwind, Docker..."
                            {...register('technology')}
                        />
                        {errors.technology && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.technology?.message}
                            </p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label
                            htmlFor="question_description"
                            className="block text-sm font-semibold text-zinc-800 mb-1"
                        >
                            Detalle del problema y qué has intentado
                        </label>
                        <textarea
                            className="w-full px-4 py-3 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all resize-none"
                            name="question_description"
                            id="question_description"
                            rows="6"
                            placeholder="Explica qué quieres lograr, qué código o configuración tienes y el error exacto que recibes..."
                            {...register('question_description')}
                        />
                        {errors.question_description && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.question_description?.message}
                            </p>
                        )}
                    </div>

                    {/* Botón de envío */}
                    <div className="pt-2">
                        {loading ? (
                            <div className="py-2 flex justify-center">
                                <Loading />
                            </div>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-[#829821] hover:bg-[#72851d] text-white font-medium rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <span>Publicar Pregunta en la Comunidad</span>
                                <span>→</span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewQuestionForm;

