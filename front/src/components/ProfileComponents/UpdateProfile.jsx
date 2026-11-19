import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { updateProfileService } from '../../services/profileServices';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import profileSchema from '../../../schemas/profileSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useProfile } from '../../hooks/profilehook/useProfile';

export const UpdateProfile = () => {
    const location = useLocation();
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const fallbackId = id || user?.register_id;
    const { profile: fetchedProfile, updateProfile } = useProfile(fallbackId);
    const profile = location.state?.profile || fetchedProfile || {};

    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const [image, setImage] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        mode: 'onTouched',
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (profile && profile.profile_name) {
            let formattedDate = '';
            if (profile.birthdate) {
                try {
                    formattedDate = format(new Date(profile.birthdate), 'yyyy-MM-dd');
                } catch {
                    // fecha no válida
                }
            }
            reset({
                profile_name: profile.profile_name || '',
                profile_lastname: profile.profile_lastname || '',
                profile_username: profile.profile_username || '',
                birthdate: formattedDate,
                profile_role: profile.profile_role || 'student',
                company_name: profile.company_name || '',
            });
        }
    }, [profile, reset]);

    const onError = (formErrors) => {
        const firstError = Object.values(formErrors)[0]?.message;
        if (firstError) {
            toast.error(firstError);
        }
    };

    const handleForm = async (data) => {
        setError('');
        try {
            setSending(true);
            const formData = new FormData();
            for (const key in data) {
                if (key === 'birthdate' && data[key]) {
                    try {
                        const d = new Date(data[key]);
                        if (!isNaN(d.getTime())) {
                            formData.append(key, format(d, 'yyyy-MM-dd'));
                            continue;
                        }
                    } catch {
                        // ignore error
                    }
                }
                if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            }

            if (image) {
                formData.append('avatar', image);
            }

            const response = await updateProfileService({
                data: formData,
                token,
                id: fallbackId,
            });

            const updatedProfile = response?.profile || response;

            if (updateProfile && updatedProfile) {
                updateProfile(updatedProfile);
            }
            setImage(null);
            toast.success('Perfil actualizado con éxito');
            navigate(`/profile/${user?.register_id || fallbackId}`);
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'Error al actualizar perfil');
        } finally {
            setSending(false);
        }
    };

    return (
        <main className="flex-grow max-w-2xl mx-auto px-4 py-8 w-full">
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm">
                {/* Cabecera */}
                <div className="mb-6 pb-4 border-b border-zinc-100 flex items-center justify-between">
                    <div>
                        <Link
                            to={`/profile/${user?.register_id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-2"
                        >
                            <span>←</span>
                            <span>Volver a Mi Perfil</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                            Editar Perfil
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit(handleForm, onError)} className="space-y-6">
                    <input type="hidden" {...register('profile_role')} />
                    {/* Avatar uploader */}
                    <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60">
                        <div className="relative mb-3">
                            {image ? (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    className="w-28 h-28 object-cover rounded-full border-4 border-[#829821] shadow-md"
                                />
                            ) : profile.avatar ? (
                                <img
                                    loading="lazy"
                                    src={`${import.meta.env.VITE_BASE_URL}/uploads/${profile.avatar}`}
                                    alt={profile.profile_name || 'Avatar'}
                                    className="w-28 h-28 object-cover rounded-full border-4 border-zinc-200 shadow-md"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-zinc-200 flex items-center justify-center text-3xl text-zinc-500 font-bold border-4 border-zinc-300">
                                    {profile.profile_name?.[0]?.toUpperCase() || '👤'}
                                </div>
                            )}
                        </div>

                        <label
                            htmlFor="avatar"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl border border-zinc-200 cursor-pointer shadow-sm transition-all"
                        >
                            <span>📷</span>
                            <span>{image ? 'Cambiar imagen' : 'Subir nuevo avatar'}</span>
                            <input
                                type="file"
                                id="avatar"
                                name="avatar"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImage(e.target.files[0]);
                                    }
                                }}
                                className="hidden"
                            />
                        </label>
                        {image && (
                            <button
                                type="button"
                                onClick={() => setImage(null)}
                                className="text-xs text-red-500 hover:underline mt-1 font-medium"
                            >
                                Cancelar nueva foto
                            </button>
                        )}
                        {errors.avatar && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.avatar?.message}
                            </p>
                        )}
                    </div>

                    {/* Fila: Nombre y Apellidos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="profile_name"
                                className="block text-sm font-semibold text-zinc-800 mb-1"
                            >
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="profile_name"
                                {...register('profile_name')}
                                className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
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
                                Apellidos
                            </label>
                            <input
                                type="text"
                                id="profile_lastname"
                                {...register('profile_lastname')}
                                className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
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
                                Nickname
                            </label>
                            <input
                                type="text"
                                id="profile_username"
                                {...register('profile_username')}
                                className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
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
                                Fecha de nacimiento
                            </label>
                            <input
                                type="date"
                                id="birthdate"
                                {...register('birthdate')}
                                className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                            />
                            {errors.birthdate && (
                                <p className="text-xs text-rose-500 mt-1">
                                    {errors.birthdate?.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Rol (Solo lectura con nota informativa) */}
                    <div>
                        <label
                            htmlFor="profile_role"
                            className="block text-sm font-semibold text-zinc-800 mb-1"
                        >
                            Rol actual
                        </label>
                        <input
                            type="text"
                            id="profile_role"
                            value={profile.profile_role || 'student'}
                            readOnly
                            className="w-full px-4 py-2.5 bg-zinc-100 rounded-xl border border-zinc-200 text-zinc-600 text-sm cursor-not-allowed"
                        />
                        <p className="text-xs text-zinc-400 mt-1">
                            * Para solicitar un cambio de rol ponte en contacto con los administradores de la plataforma.
                        </p>
                    </div>

                    {/* Empresa (si aplica) */}
                    {profile.company_name && (
                        <div>
                            <label
                                htmlFor="company_name"
                                className="block text-sm font-semibold text-zinc-800 mb-1"
                            >
                                Empresa
                            </label>
                            <input
                                type="text"
                                id="company_name"
                                {...register('company_name')}
                                className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                            />
                            {errors.company_name && (
                                <p className="text-xs text-rose-500 mt-1">
                                    {errors.company_name?.message}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Botón submit */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full py-3 px-4 bg-[#829821] hover:bg-[#72851d] text-white font-medium rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {sending ? 'Guardando cambios...' : 'Guardar y Actualizar Perfil'}
                        </button>
                    </div>

                    {error && (
                        <p className="text-center text-rose-500 text-sm mt-2">{error}</p>
                    )}
                </form>
            </div>
        </main>
    );
};

UpdateProfile.propTypes = {
    updateProfile: PropTypes.func,
    profile: PropTypes.object,
};

