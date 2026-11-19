import { useContext, useState } from 'react';
import { sendProjectService } from '../services';
import { AuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types';

import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../../schemas/projectShema';
import { useProfile } from '../hooks/profilehook/useProfile';
import { ImageAdjusterModal } from './ImageAdjusterModal';

export const NewProject2 = ({ addProject }) => {
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [image, setImage] = useState(null);
    const [rawImage, setRawImage] = useState(null);
    const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);

    const { token, user } = useContext(AuthContext);
    const { profile } = useProfile(user?.register_id);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: 'onTouched',
        resolver: zodResolver(projectSchema),
    });

    //redireccionar
    const navigate = useNavigate();

    const handleForm = async (data) => {
        try {
            setSending(true);

            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }
            if (image) {
                formData.append('project_photo', image);
            }

            const project = await sendProjectService({ data: formData, token });

            addProject(project);
            navigate(`/project/${project.project_id}`);

            setImage(null);
            setRawImage(null);
            toast.success('Agregado proyecto con éxito');
        } catch (error) {
            setError(error.message);
            toast.error('Ha habido un problema al agregar el proyecto');
        } finally {
            setSending(false);
        }
    };
    return (
        <main>
            <div className="flex flex-col items-center justify-center m-5 md:px-6 lg:px-8">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-black font-semibold mb-4">
                    Añade tu proyecto
                </div>
                <form
                    noValidate
                    className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-neutral-200"
                    onSubmit={handleSubmit(handleForm)}
                >
                    <section className="space-y-4">
                        {/* Selector de Imagen con Previsualización y Herramienta de Ajuste */}
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-neutral-800">
                                    Portada del proyecto (Opcional)
                                </label>
                                {image && (
                                    <button
                                        type="button"
                                        onClick={() => setIsAdjusterOpen(true)}
                                        className="text-xs font-semibold text-[#829821] hover:text-[#a1bc28] flex items-center gap-1"
                                    >
                                        <span>✂️</span> Reajustar encuadre
                                    </button>
                                )}
                            </div>
                            
                            {image ? (
                                <div className="relative w-full rounded-xl overflow-hidden border-2 border-[#829821] bg-neutral-900 shadow-sm flex flex-col">
                                    <div className="relative w-full h-52 bg-black/50 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Barra de herramientas sobre la imagen */}
                                    <div className="p-2.5 bg-neutral-800 flex items-center justify-between text-xs text-white">
                                        <span className="truncate max-w-[130px] text-zinc-300 font-medium">
                                            {image.name || 'Portada'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsAdjusterOpen(true)}
                                                className="px-2.5 py-1.5 bg-[#829821] hover:bg-[#a1bc28] text-white font-semibold rounded-md shadow transition-colors flex items-center gap-1 cursor-pointer"
                                                title="Ajustar encuadre, zoom y recorte"
                                            >
                                                <span>✂️</span> Ajustar
                                            </button>
                                            <label
                                                htmlFor="project_photo_replace"
                                                className="px-2 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-zinc-200 font-medium rounded-md transition-colors cursor-pointer"
                                            >
                                                Cambiar
                                                <input
                                                    type="file"
                                                    id="project_photo_replace"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            const file = e.target.files[0];
                                                            setRawImage(file);
                                                            setImage(file);
                                                            setIsAdjusterOpen(true);
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImage(null);
                                                    setRawImage(null);
                                                }}
                                                className="px-2 py-1.5 bg-red-600/80 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
                                                title="Quitar imagen"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <label
                                    htmlFor="project_photo"
                                    className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-neutral-300 hover:border-[#829821] rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors p-4 text-center group"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🖼️</span>
                                        <p className="text-sm font-semibold text-neutral-700">
                                            Haz clic para seleccionar y ajustar imagen
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            Podrás recortar, hacer zoom y centrar el encuadre (16:9)
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        id="project_photo"
                                        name="project_photo"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                setRawImage(file);
                                                setImage(file);
                                                setIsAdjusterOpen(true);
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Modal para Ajustar y Recortar la Imagen */}
                        <ImageAdjusterModal
                            isOpen={isAdjusterOpen}
                            imageFile={rawImage}
                            aspectRatio={16 / 9}
                            onSave={(adjustedFile) => {
                                setImage(adjustedFile);
                            }}
                            onClose={() => setIsAdjusterOpen(false)}
                        />

                        {/* Título del proyecto */}
                        <fieldset>
                            <label
                                htmlFor="project_title"
                                className="block text-sm font-medium text-neutral-800 mb-1"
                            >
                                Título del proyecto *
                            </label>
                            <input
                                className="w-full px-3 py-2 bg-white rounded-md border border-neutral-300 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#829821]"
                                type="text"
                                id="project_title"
                                placeholder="Ej: Frankenstein Red Social"
                                {...register('project_title')}
                            />
                            {errors.project_title && (
                                <p className="text-xs text-rose-500 mt-1 font-medium">
                                    {errors.project_title.message}
                                </p>
                            )}
                        </fieldset>

                        {/* Descripción */}
                        <fieldset>
                            <label
                                htmlFor="project_description"
                                className="block text-sm font-medium text-neutral-800 mb-1"
                            >
                                Descripción *
                            </label>
                            <textarea
                                className="w-full px-3 py-2 bg-white rounded-md border border-neutral-300 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#829821]"
                                id="project_description"
                                rows="3"
                                placeholder="Explica qué tecnologías usaste y cuál es el objetivo..."
                                {...register('project_description')}
                            />
                            {errors.project_description && (
                                <p className="text-xs text-rose-500 mt-1 font-medium">
                                    {errors.project_description.message}
                                </p>
                            )}
                        </fieldset>

                        {/* URL del proyecto */}
                        <fieldset>
                            <label
                                htmlFor="project_url"
                                className="block text-sm font-medium text-neutral-800 mb-1"
                            >
                                Enlace / URL del proyecto *
                            </label>
                            <input
                                className="w-full px-3 py-2 bg-white rounded-md border border-neutral-300 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#829821]"
                                type="url"
                                id="project_url"
                                placeholder="https://github.com/tu-usuario/proyecto"
                                {...register('project_url')}
                            />
                            {errors.project_url && (
                                <p className="text-xs text-rose-500 mt-1 font-medium">
                                    {errors.project_url.message}
                                </p>
                            )}
                        </fieldset>

                        {/* Botón de acción */}
                        {profile?.is_company_validated === 0 &&
                        profile?.profile_role === 'company' ? (
                            <p className="text-sm text-rose-500 bg-rose-50 p-3 rounded-md">
                                Tu empresa aún no está validada. No puedes publicar proyectos hasta su validación.
                            </p>
                        ) : (
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#829821] hover:bg-[#96af25] rounded-md shadow transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {sending ? 'Publicando proyecto...' : 'Añadir proyecto'}
                            </button>
                        )}
                    </section>

                    {error && (
                        <p className="text-sm text-rose-500 mt-3 text-center bg-rose-50 p-2 rounded">
                            {error}
                        </p>
                    )}
                </form>
            </div>
        </main>
    );
};
NewProject2.propTypes = {
    addProject: PropTypes.func,
};
