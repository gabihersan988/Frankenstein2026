import { useState } from 'react';
import { registerUserService } from '../services';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { registerSchema } from '../../schemas/registerSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState } = useForm({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema),
    });

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [registeredCode, setRegisteredCode] = useState(null);

    const { errors, isValid } = formState;

    const onSubmit = async (data) => {
        setError('');
        try {
            const result = await registerUserService({
                email: data.email,
                register_password: data.register_password,
            });
            if (result?.registrationCode) {
                setRegisteredCode(result.registrationCode);
                toast.success('¡Usuario creado! Activa tu cuenta para continuar.', { duration: 6000 });
            } else {
                navigate('/login');
                toast.success('Activa tu cuenta en tu email.', { duration: 6000 });
            }
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
    };

    return (
        <main className="flex-grow flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm">
                <div className="text-center mb-6">
                    <img
                        loading="lazy"
                        src="/franki-icono.png"
                        className="mx-auto mb-3 w-16 h-16 object-contain"
                        alt="Frankenstein Logo"
                    />
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                        Crea tu cuenta en Frankenstein
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                        Únete a la comunidad de desarrolladores y creativos.
                    </p>
                </div>

                {registeredCode ? (
                    <div className="text-center">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                            ✓
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900 mb-2">
                            ¡Cuenta registrada con éxito!
                        </h2>
                        <p className="text-zinc-600 text-xs sm:text-sm mb-6">
                            Para empezar a utilizar tu cuenta, necesitas activarla. En modo de desarrollo puedes hacer clic en el botón de abajo:
                        </p>
                        <Link
                            to={`/validate/${registeredCode}`}
                            className="block w-full bg-[#829821] hover:bg-[#72851d] text-white py-3 px-4 rounded-xl font-medium text-center text-sm transition-colors mb-3 shadow-sm"
                        >
                            Activar mi cuenta ahora
                        </Link>
                        <Link
                            to="/login"
                            className="text-xs text-zinc-500 hover:text-zinc-700 underline"
                        >
                            Ir a la pantalla de login
                        </Link>
                    </div>
                ) : (
                    <>
                        <form
                            noValidate
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-zinc-800 mb-1">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-xs text-rose-500 mt-1">
                                        {errors.email?.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="register_password" className="block text-sm font-semibold text-zinc-800 mb-1">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="register_password"
                                        name="register_password"
                                        placeholder="Mínimo 8 caracteres"
                                        className="w-full px-4 py-2.5 pr-10 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                                        {...register('register_password')}
                                    />

                                    <button
                                        type="button"
                                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none text-base"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <AiOutlineEye className="text-[#829821]" />
                                        ) : (
                                            <AiOutlineEyeInvisible />
                                        )}
                                    </button>
                                </div>
                                {errors.register_password && (
                                    <p className="text-xs text-rose-500 mt-1">
                                        {errors.register_password?.message}
                                    </p>
                                )}
                            </div>

                            <p className="text-xs text-zinc-400 text-center leading-relaxed pt-1">
                                Al registrarte aceptas las condiciones de uso y la política de privacidad de Frankenstein.
                            </p>

                            <button
                                disabled={!isValid}
                                type="submit"
                                className="w-full py-3 px-4 bg-[#829821] hover:bg-[#72851d] disabled:opacity-50 text-white font-medium rounded-xl shadow-sm transition-all duration-200 text-sm"
                            >
                                Crear mi cuenta
                            </button>

                            {error && (
                                <p className="text-rose-500 text-xs mt-2 text-center">{error}</p>
                            )}
                        </form>

                        <div className="text-center pt-5 mt-5 border-t border-zinc-100 text-xs sm:text-sm text-zinc-600">
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-[#829821] hover:underline"
                            >
                                Inicia sesión
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

