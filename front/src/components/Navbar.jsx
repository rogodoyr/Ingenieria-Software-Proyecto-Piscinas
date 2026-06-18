export default function Navbar() {
  return (
    <nav className="w-full bg-slate-800 p-4 shadow-md flex justify-between items-center">
      <h2 className="text-xl font-bold text-sky-400">Mi Sistema</h2>
      <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded transition-colors">
        Cerrar Sesión
      </button>
    </nav>
  );
}