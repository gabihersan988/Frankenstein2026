import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { insertProfileService } from '../../services/profileServices';
import { useNavigate, Link } from 'react-router-dom';
import profileSchema from '../../../schemas/profileSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

export const NewProfile = () => {
    const { token, user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [isCompany, setIsCompany] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: 'onTouched',
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (image) {
            const objectUrl = URL.createObjectURL(image);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [image]);

    const onSubmit = async (data) => {
        setError('');
        try {
            setSending(true);
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }
            if (image) {
                formData.append('avatar', image);
            }
            const { profile_id } = await insertProfileService({
                formData,
                token,
            });
            setUser({ ...user, profile_id });
            toast.success('¡Perfil creado exitosamente!');
            navigate(`/profile/${user.register_id}`);
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'Error al crear perfil');
        } finally {
            setSending(false);
        }
    };

    const handleRoleChange = (event) => {
        const selectedRole = event.target.value;
        setIsCompany(selectedRole === 'company');
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <main className="flex-grow max-w-2xl mx-auto px-4 py-8 w-full">
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm">
                <div className="text-center mb-6 pb-4 border-b border-zinc-100">
                    <span className="text-4xl block mb-2">🎉</span>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                        Crea tu Perfil Profesional
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto">
                        Preséntate ante la comunidad para colaborar en proyectos y participar en los debates.
                    </p>
                </div>

                <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Foto de perfil */}
                    <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60">
                        <div className="relative h-28 w-28 rounded-full bg-zinc-200 overflow-hidden border-4 border-white shadow-md mb-3">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Avatar Preview"
                                    className="rounded-full object-cover h-full w-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full text-4xl text-zinc-400">
                                    👤
                                </div>
                            )}
                        </div>

                        <label
                            htmlFor="avatar"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl border border-zinc-200 cursor-pointer shadow-sm transition-all"
                        >
                            <span>📷</span>
                            <span>{image ? 'Cambiar foto elegida' : 'Subir foto de avatar'}</span>
                            <input
                                type="file"
                                id="avatar"
                                name="avatar"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                        {image && (
                            <button
                                type="button"
                                onClick={() => setImage(null)}
                                className="text-xs text-red-500 hover:underline mt-1 font-medium"
                            >
                                Quitar foto
                            </button>
                        )}
                    </div>

                    {/* Fila: Nombre y Apellidos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="profile_name"
                                className="block text-sm font-semibold text-zinc-800 mb-1"
                            >
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="profile_name"
                                placeholder="Tu nombre"
                                className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                                {...register('profile_name')}
                            />
                            {errors.profile_name && (
                                <p className="text-xs text-rose-500 mt-1">
                                    {errors.profile_name?.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="profile_lastname"
                                className="block text-sm font-semibold text-zinc-800 mb-1"
                            >
                                Apellidos *
                            </label>
                            <input
                                type="text"
                                id="profile_lastname"
                                placeholder="Tus apellidos"
                                className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                                {...register('profile_lastname')}
                            />
                            {errors.profile_lastname && (
                                <p className="text-xs text-rose-500 mt-1">
                                    {errors.profile_lastname?.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Nickname y Fecha de Nacimiento */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="profile_username"
                                className="block text-sm font-semibold text-zinc-800 mb-1"
                            >
                                Nickname único *
                            </label>
                            <input
                                type="text"
                                id="profile_username"
                                placeholder="Ej: dev_pro"
                                className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                                {...register('profile_username')}
                            />
                            {errors.profile_username && (
                                <p className="text-xs text-rose-500 mt-1">
                                    {errors.profile_username?.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="birthdate"
                                className="block text-sm font-semibold text-zinc-800 mb-1"
                            >
                                Fecha de nacimiento *
                            </label>
                            <input
                                type="date"
                                id="birthdate"
                                min="1924-01-01"
                                max="2021-01-01"
                                className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                                {...register('birthdate')}
                            />
                            {errors.birthdate && (
                                <p className="text-xs text-rose-500 mt-1">
                                    {errors.birthdate?.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tipo de Usuario */}
                    <div>
                        <label
                            htmlFor="profile_role"
                            className="block text-sm font-semibold text-zinc-800 mb-1"
                        >
                            Tipo de Perfil *
                        </label>
                        <select
                            id="profile_role"
                            className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                            {...register('profile_role')}
                            onChange={handleRoleChange}
                        >
                            <option value="">Selecciona tu rol...</option>
                            <option value="student">🎓 Estudiante (Aprender y mostrar proyectos)</option>
                            <option value="expert">⭐ Experto (Desarrollador profesional)</option>
                            <option value="company">🏢 Empresa (Publicar y evaluar proyectos)</option>
                        </select>
                        {errors.profile_role && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.profile_role?.message}
                            </p>
                        )}
                    </div>

                    {isCompany && (
                        <div>
                            <label
                                htmlFor="company_name"
                                className="block text-sm font-semibold text-zinc-800 mb-1"
                            >
                                Nombre de la Empresa *
                            </label>
                            <input
                                type="text"
                                id="company_name"
                                placeholder="Ej: Tech Solutions SL"
                                className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                                {...register('company_name')}
                            />
                            {errors.company_name && (
                                <p className="text-xs text-rose-500 mt-1">
                                    {errors.company_name?.message}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Botón de envío */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={!isValid || sending}
                            className="w-full py-3 px-4 bg-[#829821] hover:bg-[#72851d] text-white font-medium rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {sending ? 'Creando perfil...' : 'Completar y Guardar Perfil'}
                        </button>
                    </div>

                    {error && (
                        <p className="text-rose-500 text-center text-sm mt-2">{error}</p>
                    )}
                </form>
            </div>
        </main>
    );
};
