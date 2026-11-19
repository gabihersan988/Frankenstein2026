import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { validateRegisterService } from '../services/userService';
import { toast } from 'react-hot-toast';
// import { FaRegCheckCircle } from 'react-icons/fa';

export const ValidatePage = () => {
    const { registrationCode } = useParams();

    const [error, setError] = useState(null);
    const [isValidating, setIsValidating] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const validateAccount = async () => {
            try {
                await validateRegisterService(registrationCode);
                if (isMounted) {
                    setIsSuccess(true);
                    toast.success('¡Tu cuenta ha sido activada!');
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setIsValidating(false);
                }
            }
        };

        if (registrationCode) {
            validateAccount();
        }

        return () => {
            isMounted = false;
        };
    }, [registrationCode]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-md max-w-lg w-full text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-black font-semibold mb-4">
                    {isValidating ? 'Validando cuenta...' : isSuccess ? '¡Cuenta Activada!' : 'Error de Activación'}
                </h1>
                <img
                    loading="lazy"
                    src="/franki-icono.png"
                    className="self-center mt-4 mb-6 w-20 sm:w-24 lg:w-28"
                    alt="Logo Franki"
                />

                {isValidating && (
                    <p className="text-zinc-600 mb-6">Estamos verificando tu código de activación...</p>
                )}

                {isSuccess && (
                    <>
                        <p className="text-green-700 font-medium mb-4">
                            ¡Tu usuario ha sido validado correctamente!
                        </p>
                        <p className="text-zinc-600 text-sm mb-6">
                            Ya puedes iniciar sesión con tu correo y contraseña para disfrutar de la comunidad.
                        </p>
                        <Link
                            className="bg-[#829821] hover:bg-[#a1bc28] text-white font-bold py-2.5 px-6 rounded-md transition-colors"
                            to="/login"
                        >
                            Iniciar sesión
                        </Link>
                    </>
                )}

                {error && !isValidating && (
                    <>
                        <p className="text-red-500 font-medium mb-4">{error}</p>
                        <p className="text-zinc-500 text-sm mb-6">
                            Es posible que tu cuenta ya haya sido activada anteriormente o que el enlace haya expirado.
                        </p>
                        <Link
                            className="bg-[#829821] hover:bg-[#a1bc28] text-white font-bold py-2.5 px-6 rounded-md transition-colors"
                            to="/login"
                        >
                            Ir a Iniciar Sesión
                        </Link>
                    </>
                )}

                <div className="mt-8 pt-4 border-t border-zinc-100 text-xs text-zinc-400">
                    ¿Necesitas ayuda?{' '}
                    <a
                        href="mailto:frankensteinhack2024@gmail.com"
                        className="text-frankgreen hover:underline"
                    >
                        frankensteinhack2024@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
};
