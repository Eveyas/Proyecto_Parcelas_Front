import { useState } from 'react';

const DashboardLayout = ({ 
  children, 
  title="Gestión de Parcelas Agrícolas",
  subtitle="Visualiza y administra los datos en tiempo real",
  bgGradient = "from-green-50 via-white to-blue-50",
  headerGradient = "from-green-600 to-blue-600"
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient}`}>
      {/* Sidebar para móviles */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform">
            {/* Contenido del sidebar móvil */}
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Navegación</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                <a href="/dashboard" className="block py-2 px-4 text-blue-600 bg-blue-50 rounded-lg font-medium">
                  📊 Dashboard
                </a>
                <a href="/parcelas" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">
                  📈 Gestión de Parcelas
                </a>
                <a href="/gestion-parcelas" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg">
                  🗺️ Mapa de Parcelas
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Layout principal */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white shadow-lg border-r border-gray-200">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🌱</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">SistemAgrícola</h1>
                  {/* <p className="text-xs text-gray-500">Sistema Inteligente</p> */}
                </div>
              </div>
            </div>

            {/* Navegación */}
            <nav className="flex-1 p-4 space-y-2">
              <a href="/dashboard" className="flex items-center space-x-3 py-3 px-4 text-blue-600 bg-blue-50 rounded-lg font-medium transition-all duration-200 hover:shadow-md">
                <span> 📊 Dashboard</span>
              </a>
              <a href="/parcelas" className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <span> 📈 Gestión de Parcelas</span>
              </a>
              <a href="/gestion-parcelas" className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <span> 🗺️ Mapa de Parcelas</span>
              </a>
            </nav>

            {/* Footer del sidebar */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Sistema Actualizado</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <header className={`bg-gradient-to-r ${headerGradient} text-white shadow-lg`}>
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                {/* Botón hamburguesa para móvil */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
                  <p className="text-blue-100 mt-1">{subtitle}</p>
                </div>
              </div>

              {/* Menu y notificaciones */}
              <div className="flex items-center space-x-4">
                <button className="relative p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"></span>
                </button>
              </div>
            </div>
          </header>

          {/* Contenido de la página */}
          <div className="p-6">
            {children}
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white mt-8">
            <div className="p-6 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()}. SistemAgrícola. Todos los Derechos Reservados</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;