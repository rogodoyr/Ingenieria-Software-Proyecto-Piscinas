import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Mantenciones from './pages/Mantenciones';
import Ventas from './pages/Ventas';
import Rutas from './pages/Rutas';
import Tecnicos from './pages/Tecnicos';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [vistaActual, setVistaActual] = useState(null);

  useEffect(() => {
    if (user && !vistaActual) {
      const role = user.rol?.toUpperCase();
      if (role === 'ADMIN') setVistaActual('Dashboard');
      else if (role === 'SUPERVISOR') setVistaActual('Mantenciones');
      else if (role === 'VENTAS') setVistaActual('Ventas y Facturación');
      else setVistaActual('Clientes');
    }
  }, [user, vistaActual]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderizarVista = () => {
    switch (vistaActual) {
      case 'Dashboard': return <Dashboard onNavigate={setVistaActual} />;
      case 'Clientes': return <Clientes />;
      case 'Técnicos': return <Tecnicos />;
      case 'Mantenciones': return <Mantenciones />;
      case 'Ventas y Facturación': return <Ventas />;
      case 'Rutas': return <Rutas />;
      default: return <Dashboard onNavigate={setVistaActual} />;
    }
  };

  return (
    <Layout activeMenu={vistaActual} onMenuClick={setVistaActual}>
      {renderizarVista()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
