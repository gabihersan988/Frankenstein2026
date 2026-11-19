import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const { authFP } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            setLoading(true);
            await authFP(email);
            toast.success('Si el correo existe, recibirás un enlace de recuperación');
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Ha ocurrido un problema al solicitar el reseteo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm">
                <div className="text-center mb-6">
                    <span className="text-4xl block mb-2">🔑</span>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                        Recuperar Contraseña
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                        Introduce tu correo electrónico registrado y te enviaremos las instrucciones de restablecimiento.
                    </p>
                </div>

                <form noValidate onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-zinc-800 mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="tu@email.com"
                            className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email.trim()}
                        className="w-full py-3 px-4 bg-[#829821] hover:bg-[#72851d] disabled:opacity-50 text-white font-medium rounded-xl shadow-sm transition-all duration-200 text-sm"
                    >
                        {loading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
                    </button>
                </form>

                <div className="text-center pt-5 mt-5 border-t border-zinc-100 text-xs sm:text-sm text-zinc-600">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 font-medium text-[#829821] hover:underline"
                    >
                        <span>←</span>
                        <span>Volver al inicio de sesión</span>
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ForgotPasswordPage;

