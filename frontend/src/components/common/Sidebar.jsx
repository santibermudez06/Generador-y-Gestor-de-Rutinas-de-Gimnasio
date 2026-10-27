import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useActiveWorkout } from '../../context/ActiveWorkoutContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { activeWorkout } = useActiveWorkout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: 'grid_view' },
    { label: 'Mis Rutinas', path: '/routines', icon: 'format_list_bulleted' },
    { label: 'Ejercicios', path: '/exercises', icon: 'fitness_center' },
    {
      label: 'Entrenamiento Activo',
      path: '/active-workout',
      icon: 'timer',
      badge: activeWorkout ? 'LIVE' : null
    },
    { label: 'Historial', path: '/history', icon: 'history' },
    { label: 'Progreso & Estadísticas', path: '/progress', icon: 'monitoring' },
    { label: 'Perfil & Ajustes', path: '/profile', icon: 'tune' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-space-lg flex items-center border-b border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-DEFAULT bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <span className="font-headline-lg text-headline-lg tracking-wider text-primary uppercase">FORGE</span>
            <span className="px-1.5 py-0.5 rounded-DEFAULT bg-surface-container-high border border-outline-variant text-[9px] font-label-sm tracking-widest text-primary-fixed uppercase ml-1">
              POSTGRESQL
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="px-space-md py-space-sm">
          <div className="px-space-sm py-space-xs mb-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
              TELEMETRÍA &amp; GESTIÓN
            </span>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-sm py-2.5 rounded-DEFAULT transition-all group ${
                    isActive
                      ? 'bg-surface-container-high text-primary-fixed font-bold border-l-2 border-primary-fixed'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="font-body-md text-body-md uppercase font-semibold tracking-wide">
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-DEFAULT bg-primary-fixed/15 border border-primary-fixed/40 text-primary-fixed font-label-sm text-[10px] tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping"></span>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-space-md border-t border-outline-variant/30 bg-surface-container-low">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-DEFAULT bg-surface-container-high flex items-center justify-center text-primary-fixed border border-outline-variant font-headline-sm uppercase">
                {user?.name ? user.name.slice(0, 2) : 'AT'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary-fixed rounded-full ring-2 ring-surface-container-lowest"></span>
            </div>
            <div className="flex flex-col truncate">
              <span className="font-headline-sm text-headline-sm text-primary tracking-wide uppercase truncate leading-tight">
                {user?.name || 'Atleta Forge'}
              </span>
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
                {user?.preferredWeightUnit ? `Unidad: ${user.preferredWeightUnit.toUpperCase()}` : 'Nivel Pro'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-2 text-on-surface-variant hover:text-error transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
