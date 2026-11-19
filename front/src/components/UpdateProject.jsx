import { useContext, useEffect, useState } from 'react';
import { deleteProjectService, updateProjectService } from '../services';
import { AuthContext } from '../context/AuthContext';
import PropTypes from 'prop-types';

import { toast } from 'react-hot-toast';

import { useNavigate, useParams } from 'react-router-dom';
import useProject from '../hooks/useProject';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../../schemas/projectShema';
import { ImageAdjusterModal } from './ImageAdjusterModal';

export const UpdateProject = ({ updateProject, removeProject }) => {
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [image, setImage] = useState(null);
    const [rawImage, setRawImage] = useState(null);
    const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);

    const { token } = useContext(AuthContext);

    const { id } = useParams();

    const { project } = useProject(id);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        mode: 'onTouched',
        resolver: zodResolver(projectSchema),
    });
    useEffect(() => {
        if (project) {
            setValue('project_title', project.project_title);
            setValue('project_description', project.project_description);
            setValue('project_url', project.project_url);
        }
    }, [project, setValue]);
    const navigate = useNavigate();

    const deleteProject = async (id) => {
        try {
            await deleteProjectService({ id, token });
            if (removeProject) {
                removeProject(id);
            }
            toast.success('Has eliminado el proyecto con éxito!');
            navigate('/projects');
        } catch (error) {
            setError(error.message);
            toast.error(error.message || 'Error al eliminar el proyecto');
        }
    };

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

            await updateProjectService({
                data: formData,
                token,
                id,
            });

            if (typeof updateProject === 'function') {
                updateProject({ ...project, ...data });
            }

            setImage(null);
            toast.success('Proyecto actualizado con éxito');
            navigate(`/project/${id}`);
        } catch (error) {
            setError(error.message);
            toast.error(error.message || 'Ha habido un problema al modificar el proyecto');
        } finally {
            setSending(false);
        }
    };
    return (
        <main className="flex-grow">
            <div className="flex flex-col items-center justify-center m-auto md:px-6 lg:px-8">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-black font-semibold m-8">
                    {project?.project_title ? `Tu proyecto: ${project.project_title}` : 'Editar proyecto'}
                </div>
                <form
                    noValidate
                    className="w-full max-w-xs md:max-w-sm lg:max-w-md"
                    onSubmit={handleSubmit(handleForm)}
                >
                    {/* Imagen del proyecto */}
                    <div>
                        {project.project_photo ? (
                            <img
                                loading="lazy"
                                src={`${
                                    import.meta.env.VITE_BASE_URL
                                }/uploads/${project.project_photo}`}
                                alt={project.project_title}
                                className="aspect-[0.96] w-[158px]"
                            />
                        ) : (
                            <img
                                className="h-48 w-full object-cover md:h-full md:w-48"
                                src="/apple-touch-icon.png"
                                alt="Logo de frankenstein"
                            />
                        )}
                    </div>
                    {/* FIN Imagen del proyecto -------------------------------- */}

                    <fieldset className="mb-4">
                        <label htmlFor="project_title" className="block mb-1">
                            Título del proyecto
                        </label>
                        <input
                            className="w-full px-3 py-2 bg-white rounded-md border border-solid border-zinc-200 text-neutral-700"
                            type="text"
                            id="project_title"
                            name="project_title"
                            // defaultValue={project.project_title}
                            {...register('project_title')}
                        />
                        <p className="h-4 text-sm text-rose-500">
                            {errors.project_title?.message}
                        </p>
                    </fieldset>

                    <fieldset className="mb-4">
                        <label
                            htmlFor="project_description"
                            className="block mb-1"
                        >
                            Descripción
                        </label>
                        <textarea
                            className="w-full px-3 bg-white rounded-md border border-solid border-zinc-200 text-neutral-700"
                            type="text"
                            rows="4"
                            id="project_description"
                            name="project_description"
                            // defaultValue={project.project_description}
                            {...register('project_description')}
                        />
                        <p className="h-4 text-sm text-rose-500">
                            {errors.project_description?.message}
                        </p>
                    </fieldset>

                    <fieldset className="mb-4">
                        <label htmlFor="project_url" className="block mb-1">
                            URL
                        </label>
                        <input
                            className="w-full px-3 py-2 bg-white rounded-md border border-solid border-zinc-200 text-neutral-700"
                            type="url"
                            id="project_url"
                            name="project_url"
                            // defaultValue={project.project_url}
                            {...register('project_url')}
                        />
                        <p className="h-4 text-sm text-rose-500">
                            {errors.project_url?.message}
                        </p>
                    </fieldset>

                    <fieldset className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-neutral-800">
                                Portada del proyecto
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
                                <div className="relative w-full h-44 bg-black/50 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-2 bg-neutral-800 flex items-center justify-between text-xs text-white">
                                    <span className="truncate max-w-[130px] text-zinc-300">
                                        {image.name || 'Nueva portada'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsAdjusterOpen(true)}
                                            className="px-2.5 py-1 bg-[#829821] hover:bg-[#a1bc28] text-white font-semibold rounded shadow flex items-center gap-1"
                                        >
                                            <span>✂️</span> Ajustar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImage(null);
                                                setRawImage(null);
                                            }}
                                            className="px-2 py-1 bg-red-600/80 hover:bg-red-700 text-white rounded"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor="project_photo_update"
                                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-neutral-300 hover:border-[#829821] rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors p-3 text-center"
                            >
                                <span className="text-2xl mb-1">🖼️</span>
                                <p className="text-xs font-semibold text-neutral-700">
                                    Seleccionar nueva imagen para la portada
                                </p>
                                <input
                                    type="file"
                                    id="project_photo_update"
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

                        <ImageAdjusterModal
                            isOpen={isAdjusterOpen}
                            imageFile={rawImage}
                            aspectRatio={16 / 9}
                            onSave={(adjustedFile) => {
                                setImage(adjustedFile);
                            }}
                            onClose={() => setIsAdjusterOpen(false)}
                        />
                    </fieldset>
                    <div className=" flex space-x-4 mt-4 place-content-around">
                        <button
                            className="w-[50%] px-4 py-2 text-sm font-medium text-white bg-frankgreen border border-transparent rounded-md shadow-sm hover:bg-frankgreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-frankgreen disabled:opacity-50 mb-4"
                            // disabled={!isValid || sending}
                        >
                            {sending ? 'Enviando...' : 'Modificar proyecto'}
                        </button>

                        <button
                            type="button"
                            className="w-[50%] px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none disabled:opacity-50 mb-4 text-center m-auto transition-colors"
                            onClick={() => {
                                deleteProject(project.project_id);
                            }}
                        >
                            {sending ? 'Procesando...' : 'Eliminar proyecto'}
                        </button>

                        {error ? <p>{error}</p> : null}
                    </div>
                </form>
            </div>
        </main>
    );
};
UpdateProject.propTypes = {
    updateProject: PropTypes.func,
    removeProject: PropTypes.func,
};
