import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import avatarImg from '../assets/biomechanical-avatar.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('credentials');
  const [bioView, setBioView] = useState('anterior');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Telemetry Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30">
        <div className="h-16 w-full px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-headline-sm">bolt</span>
              <span className="font-headline-md text-headline-md tracking-wider text-primary uppercase">FORGE</span>
            </div>
            <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-0.5 rounded bg-surface-container-low">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                SISTEMA SEGURO // TLS 1.3
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">language</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">ES</span>
            </div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary bg-surface-container-high px-2 py-0.5 rounded">
              POSTGRESQL // ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* Main Dual Cockpit */}
      <main className="w-full flex-1 pt-16 bg-surface flex flex-col">
        <div className="w-full min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 bg-surface-container-lowest relative overflow-hidden">
          {/* Ambient scan line grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(190,245,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(190,245,0,0.04)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          {/* LEFT COLUMN: BIOMECHANICAL TELEMETRY */}
          <div className="lg:col-span-7 flex flex-col justify-between p-space-md sm:p-space-lg lg:p-space-xl bg-surface relative overflow-hidden">
            {/* Subtle radial glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Top metadata & Title */}
            <div className="relative z-10 flex flex-col gap-space-xs">
              <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-ping"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                    TELEMETRÍA EN DIRECTO // ATLAS V4.8
                  </span>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant bg-surface-container-low px-space-sm py-0.5 rounded">
                  CALIBRACIÓN KINÉTICA DE PRECISIÓN
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
                <div>
                  <h1 className="font-headline-lg text-headline-lg uppercase text-primary tracking-wide">
                    SISTEMA DE CALIBRACIÓN BIOMECÁNICA
                  </h1>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Monitoreo neural multieje · Registro de contracción dinámica en tiempo real
                  </p>
                </div>
                {/* View Selector */}
                <div className="flex items-center bg-surface-container-lowest p-0.5 rounded">
                  <button
                    type="button"
                    className={`px-space-md py-1.5 rounded font-label-md text-label-md uppercase tracking-wider transition-all ${
                      bioView === 'anterior'
                        ? 'bg-surface-container text-secondary font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    onClick={() => setBioView('anterior')}
                  >
                    ANTERIOR
                  </button>
                  <button
                    type="button"
                    className={`px-space-md py-1.5 rounded font-label-md text-label-md uppercase tracking-wider transition-all ${
                      bioView === 'posterior'
                        ? 'bg-surface-container text-secondary font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    onClick={() => setBioView('posterior')}
                  >
                    POSTERIOR
                  </button>
                </div>
              </div>
            </div>

            {/* Center Chassis: Anatomical Avatar & HUD */}
            <div className="relative my-space-md flex items-center justify-center min-h-[380px] lg:min-h-[440px]">
              {/* Floating Badge Top Left */}
              <div className="absolute top-2 left-2 z-20 bg-surface-container/90 backdrop-blur-md p-space-sm rounded shadow-lg max-w-[210px] hidden sm:flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">FATIGA NEUROMUSCULAR</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                </div>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-md text-headline-md text-secondary">12%</span>
                  <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-semibold">ESTADO ÓPTIMO</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-[12%]"></div>
                </div>
              </div>

              {/* Floating Badge Top Right */}
              <div className="absolute top-2 right-2 z-20 bg-surface-container/90 backdrop-blur-md p-space-sm rounded shadow-lg max-w-[210px] hidden sm:flex flex-col gap-1 text-right">
                <div className="flex items-center justify-end gap-space-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">POTENCIA DISPONIBLE</span>
                </div>
                <div className="flex items-baseline justify-end gap-space-xs">
                  <span className="font-headline-md text-headline-md text-primary">98.4%</span>
                  <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-semibold">VELOCIDAD MÁX</span>
                </div>
                <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-primary-fixed h-full w-[98.4%] ml-auto"></div>
                </div>
              </div>

              {/* Anatomical Avatar */}
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] flex items-center justify-center py-space-sm">
                <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={avatarImg}
                    alt="Biomechanical Scan Telemetry"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(170,221,47,0.2)] select-none pointer-events-none"
                  />
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-70 blur-sm animate-[bounce_4s_infinite] pointer-events-none"></div>
                </div>
              </div>

              {/* Floating Recovery Score: Bottom Right */}
              <div className="absolute bottom-6 right-2 z-20 bg-surface-container/90 backdrop-blur-md px-space-md py-space-sm rounded shadow-lg hidden sm:flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-headline-sm">vital_signs</span>
                </div>
                <div>
                  <div className="font-label-sm text-label-sm uppercase text-on-surface-variant">RECOVERY SCORE</div>
                  <div className="font-headline-md text-headline-md text-secondary">
                    94% <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">/ 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Footer */}
            <div className="relative z-10 grid grid-cols-1 gap-space-md pt-space-md bg-surface-container-lowest/80 p-space-md rounded">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                    DISTRIBUCIÓN DE CARGA SEMANAL
                  </span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary bg-primary-container/10 px-1.5 py-0.5 rounded">
                    PRO LEVEL 4
                  </span>
                </div>
                {/* Mini bar chart */}
                <div className="grid grid-cols-7 gap-1 h-10 items-end pt-1">
                  {[
                    { day: 'L', h: '60%', active: false },
                    { day: 'M', h: '85%', active: false },
                    { day: 'X', h: '45%', active: false },
                    { day: 'J', h: '95%', active: true },
                    { day: 'V', h: '70%', active: false },
                    { day: 'S', h: '50%', active: false },
                    { day: 'D', h: '20%', active: false },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5 h-full justify-end">
                      <div
                        className={`w-full rounded-xs transition-all ${
                          bar.active
                            ? 'bg-secondary shadow-[0_0_8px_rgba(170,221,47,0.4)]'
                            : 'bg-surface-container-highest'
                        }`}
                        style={{ height: bar.h }}
                      ></div>
                      <span className={`font-label-sm text-[9px] ${bar.active ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: HIGH-CONTRAST LOGIN SUITE */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center p-space-md sm:p-space-lg lg:p-space-xl bg-surface-container-lowest relative">
            <div className="absolute -right-20 top-1/4 w-80 h-80 bg-primary-container/5 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-surface-container rounded-lg p-space-lg sm:p-space-xl shadow-2xl relative z-10 flex flex-col gap-space-lg border border-outline-variant/30">
              {/* Card Header */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-headline-sm">fitness_center</span>
                    <span className="font-headline-md text-headline-md uppercase tracking-wider text-primary">FORGE // ATHLETICS</span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant bg-surface-container-high px-space-xs py-0.5 rounded font-bold">
                    POSTGRESQL
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg uppercase text-primary tracking-wide mt-space-xs">
                  ACCEDER AL SISTEMA
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Introduce tus credenciales de atleta o escanea tu perfil rápido.
                </p>
              </div>

              {/* Error banner */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-error-container/40 border border-error/50 rounded text-error text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Auth Tabs */}
              <div className="grid grid-cols-2 gap-1 bg-surface-container-low p-1 rounded">
                <button
                  type="button"
                  className={`py-2 rounded font-label-md text-label-md uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'credentials'
                      ? 'bg-surface text-secondary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  onClick={() => setActiveTab('credentials')}
                >
                  <span className="material-symbols-outlined text-[16px]">badge</span> CREDENCIALES
                </button>
                <button
                  type="button"
                  className={`py-2 rounded font-label-md text-label-md uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'qr'
                      ? 'bg-surface text-secondary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  onClick={() => setActiveTab('qr')}
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span> GYM PASS // QR
                </button>
              </div>

              {/* Form Content */}
              {activeTab === 'credentials' ? (
                <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface" htmlFor="athlete-email">
                        ID DE ATLETA O EMAIL
                      </label>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                        SYNC PRISMA READY
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[20px]">person</span>
                      <input
                        id="athlete-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="atleta@forge.com"
                        className="w-full bg-surface-container-low text-primary pl-11 pr-space-md py-3 rounded font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-secondary focus:bg-surface-container-high transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface" htmlFor="athlete-pass">
                        CONTRASEÑA
                      </label>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-secondary cursor-pointer">
                        ¿OLVIDASTE TU CLAVE?
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[20px]">lock</span>
                      <input
                        id="athlete-pass"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-surface-container-low text-primary pl-11 pr-11 py-3 rounded font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-secondary focus:bg-surface-container-high transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="material-symbols-outlined absolute right-space-md text-on-surface-variant hover:text-on-surface text-[20px] transition-colors focus:outline-none"
                      >
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </button>
                    </div>
                  </div>

                  {/* Status row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
                    <label className="flex items-center gap-space-xs cursor-pointer select-none">
                      <input defaultChecked className="w-4 h-4 rounded-xs bg-surface-container-low accent-secondary" type="checkbox" />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Mantener sesión en estación</span>
                    </label>
                    <div className="flex items-center gap-1.5 bg-surface-container-low px-space-xs py-0.5 rounded">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                        POSTGRESQL // PORT 5432
                      </span>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    id="btn-submit"
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-space-xs py-3.5 px-space-md bg-secondary text-on-secondary rounded font-headline-md text-headline-md uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-space-sm shadow-[0_0_20px_rgba(170,221,47,0.25)] disabled:opacity-60"
                  >
                    <span>{submitting ? 'SINCRONIZANDO ATLETA...' : 'INICIAR SESIÓN // ENTRAR AL GYM'}</span>
                    <span className="material-symbols-outlined text-[22px]">bolt</span>
                  </button>
                </form>
              ) : (
                /* QR Tab */
                <div className="flex flex-col items-center justify-center gap-space-md py-space-md bg-surface-container-low rounded p-space-md text-center">
                  <div className="relative w-44 h-44 bg-surface p-3 rounded flex items-center justify-center">
                    <svg className="w-full h-full text-secondary" fill="currentColor" viewBox="0 0 100 100">
                      <rect fill="none" height="30" stroke="currentColor" strokeWidth="4" width="30" x="5" y="5"></rect>
                      <rect height="16" width="16" x="12" y="12"></rect>
                      <rect fill="none" height="30" stroke="currentColor" strokeWidth="4" width="30" x="65" y="5"></rect>
                      <rect height="16" width="16" x="72" y="12"></rect>
                      <rect fill="none" height="30" stroke="currentColor" strokeWidth="4" width="30" x="5" y="65"></rect>
                      <rect height="16" width="16" x="12" y="72"></rect>
                      <rect height="8" width="8" x="45" y="10"></rect>
                      <rect height="14" width="8" x="45" y="25"></rect>
                      <rect height="8" width="15" x="10" y="45"></rect>
                      <rect height="8" width="30" x="35" y="45"></rect>
                      <rect height="8" width="15" x="75" y="45"></rect>
                      <rect height="25" width="12" x="45" y="65"></rect>
                      <rect height="10" width="10" x="65" y="65"></rect>
                      <rect height="10" width="10" x="80" y="80"></rect>
                    </svg>
                    <div className="absolute inset-x-2 top-0 h-1 bg-secondary animate-pulse"></div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-headline-sm text-headline-sm text-primary uppercase">ESCANEA EN EL TÓTEM DEL BOX</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Abre FORGE Mobile App y muestra tu código de atleta activo
                    </span>
                  </div>
                  <button
                    type="button"
                    className="font-label-md text-label-md uppercase text-secondary tracking-wider"
                    onClick={() => setActiveTab('credentials')}
                  >
                    Regresar a credenciales
                  </button>
                </div>
              )}

              {/* Footer Callout */}
              <div className="text-center pt-space-xs border-t border-outline-variant/30">
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  ¿Aún no eres miembro de FORGE?{' '}
                  <Link to="/register" className="font-label-md text-label-md uppercase text-secondary font-bold hover:underline inline-block ml-1">
                    Regístrate y calibra tu rutina
                  </Link>
                </p>
              </div>
            </div>

            {/* Terminal watermark */}
            <div className="mt-space-md text-center">
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                FORGE HARDWARE ECOSYSTEM // TERMINAL #04 · POSTGRESQL ENGINE
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
