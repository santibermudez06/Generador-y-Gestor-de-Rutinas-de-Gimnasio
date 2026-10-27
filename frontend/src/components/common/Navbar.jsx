import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useActiveWorkout } from '../../context/ActiveWorkoutContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { activeWorkout, startWorkout } = useActiveWorkout();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuickStart = async () => {
    if (activeWorkout) {
      navigate('/active-workout');
      return;
    }
    try {
      await startWorkout({ name: 'Sesión Rápida Forge' });
      navigate('/active-workout');
    } catch {
      navigate('/routines');
    }
  };

  const mobileNavItems = [
    { label: 'Dashboard', path: '/', icon: 'grid_view' },
    { label: 'Rutinas', path: '/routines', icon: 'format_list_bulleted' },
    {
      label: 'Entrenar',
      path: '/active-workout',
      icon: 'timer',
      isLive: !!activeWorkout
    },
    { label: 'Ejercicios', path: '/exercises', icon: 'fitness_center' },
    { label: 'Progreso', path: '/progress', icon: 'monitoring' }
  ];

  return (
    <>
      {/* Desktop Top Header Bar */}
      <header className="hidden lg:flex fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/30 z-40 px-space-lg items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-space-xs px-space-sm py-1.5 rounded-DEFAULT bg-surface-container-low border border-outline-variant/50">
            <span className="material-symbols-outlined text-outline text-[18px]">search</span>
            <input
              className="bg-transparent text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none w-64 uppercase tracking-wider"
              placeholder="Buscar rutina, ejercicio..."
              type="text"
            />
          </div>
          <div className="hidden xl:flex items-center gap-2 px-space-sm py-1 rounded-DEFAULT bg-surface-container-low border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-primary-fixed"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              ESTADO DEL GYM:
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
              METRICS ONLINE 100%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-md">
          <button
            onClick={handleQuickStart}
            className="flex items-center gap-1.5 px-space-md py-2 rounded-DEFAULT bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim font-headline-sm text-headline-sm uppercase tracking-wider transition-all transform active:scale-95 shadow-md shadow-primary-fixed/20"
          >
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            <span>{activeWorkout ? 'Ir a Sesión Activa' : 'Iniciar Sesión Rápida'}</span>
          </button>

          <button className="relative p-2 rounded-DEFAULT bg-surface-container-low border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary"></span>
          </button>

          <div className="flex items-center gap-2 pl-space-xs border-l border-outline-variant/30">
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center font-bold text-secondary text-sm">
              {user?.name ? user.name.slice(0, 1) : 'A'}
            </div>
            <span className="font-label-md text-label-md uppercase text-primary font-semibold hidden md:inline">
              {user?.name || 'Atleta'}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex h-14 bg-surface-container-lowest border-b border-outline-variant/30 px-4 items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-2xl">bolt</span>
          <span className="font-headline-md text-headline-md tracking-wider text-primary uppercase">FORGE</span>
        </div>
        <div className="flex items-center gap-2">
          {activeWorkout && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-DEFAULT bg-primary-fixed/20 text-primary-fixed font-label-sm text-[10px] tracking-widest uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping"></span> LIVE
            </span>
          )}
          <button
            onClick={handleQuickStart}
            className="p-1.5 bg-primary-fixed text-on-primary-fixed rounded-DEFAULT"
          >
            <span className="material-symbols-outlined text-[20px]">play_arrow</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-lg border-t border-outline-variant/30 z-50 flex items-center justify-around px-2">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors relative ${
                isActive ? 'text-primary-fixed font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="font-label-sm text-[10px] uppercase tracking-wider">{item.label}</span>
            {item.isLive && (
              <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-primary-fixed animate-ping"></span>
            )}
          </NavLink>
        ))}
      </div>
    </>
  );
}
