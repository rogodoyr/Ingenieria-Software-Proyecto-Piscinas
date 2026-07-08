import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children, activeMenu, onMenuClick }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', roles: ['ADMIN', 'SUPERVISOR', 'VENTAS', 'OPERADOR'] },
    { name: 'Clientes', roles: ['ADMIN', 'SUPERVISOR', 'VENTAS'] },
    { name: 'Mantenciones', roles: ['ADMIN', 'SUPERVISOR'] },
    { name: 'Ventas y Facturación', roles: ['ADMIN', 'VENTAS'] },
    { name: 'Rutas', roles: ['ADMIN', 'SUPERVISOR'] },
  ].filter(item => {
    const userRole = user?.rol?.toUpperCase() || 'OPERADOR';
    return item.roles.includes(userRole);
  });

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-outline flex flex-col z-50">
        <div className="p-8 border-b border-outline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
                Verano Perfecto
              </h1>
              <p className="text-[10px] text-primary/70 uppercase tracking-widest font-bold">ERP System</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => onMenuClick(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ease-in-out font-medium
                ${activeMenu === item.name 
                  ? 'bg-secondary-container text-secondary scale-[1.02] shadow-[0_0_15px_rgba(45,219,222,0.15)]' 
                  : 'text-slate-400 hover:bg-surface-high hover:text-slate-200'
              }`}
            >
              <span className="text-xl opacity-80">
                {item.name === 'Dashboard' ? '📊' : item.name === 'Clientes' ? '👥' : item.name === 'Mantenciones' ? '🛠️' : item.name === 'Ventas y Facturación' ? '🧾' : '🗺️'}
              </span>
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 w-full glass-card border-b border-outline flex justify-between items-center px-8 z-40">
          <div className="flex items-center gap-4 bg-surface-high px-4 py-2 rounded-full w-96 border border-outline focus-within:ring-1 focus-within:ring-secondary/50 transition-all duration-300">
             <span>🔍</span>
             <input 
                className="bg-transparent border-none focus:outline-none w-full text-sm text-slate-200 placeholder:text-slate-500" 
                placeholder="Buscar clientes, servicios o productos..." 
                type="text"
             />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user?.nombre || user?.username || ''}</span>
            <button 
              onClick={logout}
              className="w-10 h-10 rounded-full border-2 border-primary-container bg-surface-high flex items-center justify-center cursor-pointer hover:border-primary transition-all duration-300"
              title="Cerrar Sesión"
            >
              👤
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
