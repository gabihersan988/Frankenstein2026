import { useState } from 'react';
import { ResetPassword } from '../services/userService';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ResetPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const { id, token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);
            await ResetPassword(id, token, password, password2);
            toast.success('Contraseña restablecida con éxito');
            navigate('/login');
        } catch (err) {
            toast.error(err.message || 'Error al restablecer la contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm">
                <div className="text-center mb-6">
                    <span className="text-4xl block mb-2">🔐</span>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                        Nueva Contraseña
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                        Establece una nueva clave segura para acceder a tu cuenta.
                    </p>
                </div>

                <form noValidate onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-zinc-800 mb-1">
                            Nueva Contraseña
                        </label>
                        <input
                            className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password2" className="block text-sm font-semibold text-zinc-800 mb-1">
                            Repite la Contraseña
                        </label>
                        <input
                            className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-white focus:bg-white rounded-xl border border-zinc-200 text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#829821] focus:border-transparent transition-all"
                            type="password"
                            id="password2"
                            name="password2"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            placeholder="Repite la clave exactamente"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !password || !password2}
                        className="w-full py-3 px-4 bg-[#829821] hover:bg-[#72851d] disabled:opacity-50 text-white font-medium rounded-xl shadow-sm transition-all duration-200 text-sm mt-2"
                    >
                        {loading ? 'Guardando nueva clave...' : 'Actualizar Contraseña'}
                    </button>
                </form>

                <div className="text-center pt-5 mt-5 border-t border-zinc-100 text-xs sm:text-sm text-zinc-600">
                    <Link to="/login" className="text-[#829821] hover:underline font-medium">
                        ← Volver a inicio de sesión
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ResetPasswordForm;

