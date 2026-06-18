import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login, register, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(username, password, nombre, email);
      } else {
        await login(username, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl border border-outline/20 p-8 shadow-2xl pool-glow">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Verano Perfecto
            </h1>
            <p className="text-sm text-slate-400 mt-2 uppercase tracking-wider font-semibold">ERP System</p>
          </div>

          {error && (
            <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-surface-high border border-outline/30 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                  placeholder="Tu nombre"
                />
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-high border border-outline/30 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-400 mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-high border border-outline/30 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="Nombre de usuario"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-high border border-outline/30 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-secondary transition-colors"
                placeholder="Tu contraseña"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-surface bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Cargando...' : isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-sm text-secondary hover:underline"
            >
              {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
