import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { loginUserService } from '../services';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { loginSchema } from '../../schemas/loginSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    AiOutlineQuestionCircle,
    AiOutlineEye,
    AiOutlineEyeInvisible,
} from 'react-icons/ai';

export const LoginPage = () => {
    const { register, handleSubmit, formState } = useForm({
        mode: 'onTouched',
        resolver: zodResolver(loginSchema),
    });

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { errors, isValid } = formState;
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setError('');
        try {
            const responseData = await loginUserService({
                email: data.email,
                register_password: data.register_password,
            });
            login(responseData);
            navigate('/');
            toast.success('¡Bienvenido de nuevo!');
        } catch (error) {
            setError(error.message);
            toast.error(error.response?.data?.error || error.message);
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
                        Inicia sesión en Frankenstein
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                        Conecta, aprende y comparte tus proyectos con la comunidad.
                    </p>
                </div>

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
                            name="email"
                            id="email"
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
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="register_password" className="block text-sm font-semibold text-zinc-800">
                                Contraseña
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-xs text-[#829821] hover:underline inline-flex items-center gap-1 font-medium"
                            >
                                <AiOutlineQuestionCircle className="inline-block" />
                                ¿Olvidaste la clave?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="register_password"
                                name="register_password"
                                placeholder="Tu contraseña"
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
                        Al entrar aceptas las condiciones de uso y la política de privacidad de Frankenstein.
                    </p>

                    <button
                        disabled={!isValid}
                        type="submit"
                        className="w-full py-3 px-4 bg-[#829821] hover:bg-[#72851d] disabled:opacity-50 text-white font-medium rounded-xl shadow-sm transition-all duration-200 text-sm"
                    >
                        Entrar a mi cuenta
                    </button>

                    {error && (
                        <p className="text-center text-rose-500 text-xs mt-2">{error}</p>
                    )}
                </form>

                <div className="text-center pt-5 mt-5 border-t border-zinc-100 text-xs sm:text-sm text-zinc-600">
                    ¿Aún no tienes cuenta?{' '}
                    <Link
                        to="/register"
                        className="font-semibold text-[#829821] hover:underline"
                    >
                        Crea una cuenta gratis
                    </Link>
                </div>
            </div>
        </main>
    );
};

