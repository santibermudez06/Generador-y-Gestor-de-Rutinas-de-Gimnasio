import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import avatarImg from '../assets/biomechanical-avatar.png';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredWeightUnit, setPreferredWeightUnit] = useState('kg');
  const [bodyWeight, setBodyWeight] = useState('80.0');
  const [bodyHeight, setBodyHeight] = useState('178');
  const [experienceLevel, setExperienceLevel] = useState('AVANZADO');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setErrorMsg('Debes aceptar los términos biométricos de FORGE');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
        preferredWeightUnit
      });
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Error al crear la cuenta');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col justify-between">
      {/* Top System Header */}
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
                CALIBRACIÓN EN LÍNEA // POSTGRESQL ENGINE
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">language</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">ES</span>
            </div>
            <Link
              to="/login"
              className="font-label-md text-label-md uppercase tracking-wider text-secondary hover:underline transition-colors"
            >
              YA TENGO CUENTA // LOGIN
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dual Cockpit Grid */}
      <main className="w-full flex-1 pt-16 bg-surface flex flex-col">
        <div className="w-full max-w-[1560px] mx-auto px-gutter sm:px-margin py-space-md lg:py-space-lg">
          {/* Top Telemetry Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-space-sm pb-space-sm mb-space-md border-b border-outline-variant/30 text-on-surface-variant">
            <div className="flex items-center gap-space-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary-fixed shadow-[0_0_10px_#c6ff00]"></span>
              <span className="font-label-md text-label-md tracking-widest uppercase text-secondary">
                FASE // ALTA DE NUEVO ATLETA
              </span>
              <span className="text-outline-variant">/</span>
              <span className="font-label-sm text-label-sm tracking-widest uppercase text-on-surface-variant">
                GATE PROTOCOL 0.9.4B
              </span>
            </div>
            <div className="flex items-center gap-space-lg text-on-surface-variant">
              <div className="hidden md:flex items-center gap-space-xs font-label-sm text-label-sm uppercase">
                <span className="text-outline">LATENCIA DE ADQUISICIÓN:</span>
                <span className="text-primary font-bold">1.2ms</span>
              </div>
              <div className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase">
                <span className="text-outline">CALIBRACIÓN NODO:</span>
                <span className="text-secondary-fixed">EN LÍNEA</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* COLUMNA IZQUIERDA: Telemetría de Calibración & Scan */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-space-md">
              <div className="p-space-md bg-surface-container rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-space-xs mb-1">
                    <span className="material-symbols-outlined text-secondary text-headline-sm">account_box</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                      MODO: ALTA DE NUEVO ATLETA
                    </span>
                  </div>
                  <h1 className="font-headline-md text-headline-md tracking-wider uppercase text-primary">
                    SISTEMA DE CALIBRACIÓN KINÉTICA // ONBOARDING
                  </h1>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 bg-surface-container-high rounded text-secondary font-label-md text-label-md tracking-wider uppercase shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></span>
                  PASO 01 / 03
                </div>
              </div>

              {/* Visor Biomecánico */}
              <div className="relative w-full bg-surface-container-lowest rounded-xl overflow-hidden min-h-[520px] lg:min-h-[580px] flex items-center justify-center p-space-md group border border-outline-variant/30">
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#aadd2f_1px,transparent_1px)] [background-size:24px_24px]"></div>

                {/* Reticles */}
                <div className="absolute top-4 left-4 font-label-sm text-label-sm text-on-surface-variant/70 tracking-widest select-none flex flex-col gap-1">
                  <span className="text-secondary">[HUD_SCAN_ACTIVE]</span>
                  <span>AXIS: X+44.20 Y-12.04</span>
                  <span>Z-INDEX RESOLUTION: 4K</span>
                </div>
                <div className="absolute top-4 right-4 font-label-sm text-label-sm text-on-surface-variant/70 tracking-widest select-none text-right flex flex-col gap-1">
                  <span className="text-primary">ATLAS KINEMATICS ENGINE</span>
                  <span>VERSION 4.8.1 // BUILD 902</span>
                </div>

                {/* Image Frame */}
                <div className="relative z-10 w-full max-w-[400px] flex items-center justify-center py-4">
                  <img
                    alt="Scan Biomecánico FORGE"
                    className="w-full h-auto object-contain max-h-[480px] filter drop-shadow-[0_0_24px_rgba(170,221,47,0.18)] select-none pointer-events-none"
                    src={avatarImg}
                  />
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-75 blur-sm animate-[bounce_4s_infinite] pointer-events-none"></div>

                  {/* Callout Top-Left */}
                  <div className="absolute top-8 left-0 max-w-[200px] p-2.5 bg-surface-container-high/90 backdrop-blur-md rounded-lg shadow-lg">
                    <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm tracking-wider uppercase mb-0.5">
                      <span className="material-symbols-outlined text-[14px]">tune</span>
                      OBJETIVO KINÉTICO
                    </div>
                    <p className="font-headline-sm text-headline-sm text-primary uppercase leading-tight">
                      HIPERTROFIA &amp; FUERZA
                    </p>
                    <div className="mt-1 h-0.5 w-full bg-surface-container-highest">
                      <div className="h-0.5 bg-secondary w-4/5"></div>
                    </div>
                  </div>

                  {/* Callout Mid-Right */}
                  <div className="absolute top-1/3 right-0 max-w-[190px] p-2.5 bg-surface-container-high/90 backdrop-blur-md rounded-lg shadow-lg text-right">
                    <div className="flex items-center justify-end gap-1.5 text-secondary font-label-sm text-label-sm tracking-wider uppercase mb-0.5">
                      CALIBRACIÓN EMG
                      <span className="material-symbols-outlined text-[14px]">electric_bolt</span>
                    </div>
                    <p className="font-metric-val text-metric-val text-primary uppercase leading-none">100%</p>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                      SENSORES LISTOS
                    </span>
                  </div>
                </div>

                {/* Bottom Metric Ticker */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span>SENSORES CARGADOS: 24/24 CANALES</span>
                  </div>
                  <div className="hidden sm:block">STATUS: LISTO PARA RECIBIR DATOS</div>
                </div>
              </div>

              {/* Progress Micro-Bar */}
              <div className="p-space-md bg-surface-container rounded-lg flex flex-col gap-space-xs border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-primary tracking-wider uppercase">
                    PROGRESO DEL ONBOARDING BIOMÉTRICO
                  </span>
                  <span className="font-label-md text-label-md text-secondary font-bold">33% COMPLETADO</span>
                </div>
                <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden flex">
                  <div className="h-full bg-secondary-fixed rounded-full w-1/3 shadow-[0_0_8px_#c6ff00]"></div>
                  <div className="h-full bg-transparent w-2/3"></div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  <span className="text-secondary font-semibold">1. PERFIL &amp; ACCESO</span>
                  <span className="text-center opacity-60">2. CALIBRACIÓN EMG</span>
                  <span className="text-right opacity-60">3. PLAN DE CARGA</span>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Formulario de Registro */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-space-md">
              <div className="bg-surface-container-low p-space-md sm:p-space-lg rounded-xl shadow-2xl relative overflow-hidden border border-outline-variant/30">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-container via-secondary-fixed to-secondary-container"></div>

                <div className="flex flex-col gap-space-xs mb-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[20px]">fitness_center</span>
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                        FORGE // ATHLETICS PLATFORM
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-secondary/10 text-secondary font-label-sm text-label-sm uppercase rounded tracking-widest font-bold">
                      NUEVO ATLETA
                    </span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-primary uppercase tracking-wide mt-1">
                    CREAR CUENTA // UNIRSE A FORGE
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Configura tus parámetros biométricos y comienza a registrar cada repetición con precisión milimétrica.
                  </p>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-error-container/40 border border-error/50 rounded text-error text-body-sm">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
                  {/* Nombre */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface flex items-center gap-1.5" htmlFor="fullName">
                        <span className="material-symbols-outlined text-[16px] text-secondary">badge</span>
                        NOMBRE COMPLETO DE ATLETA
                      </label>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">REQUERIDO</span>
                    </div>
                    <input
                      id="fullName"
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Marcos Vega"
                      className="w-full h-12 px-space-md bg-surface-container-high rounded text-on-surface font-body-md placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface flex items-center gap-1.5" htmlFor="athleteEmail">
                        <span className="material-symbols-outlined text-[16px] text-secondary">mail</span>
                        EMAIL DE TELEMETRÍA / ATLETA
                      </label>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">AUTH VERIFICADO</span>
                    </div>
                    <input
                      id="athleteEmail"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="marcos.vega@forge.com"
                      className="w-full h-12 px-space-md bg-surface-container-high rounded text-on-surface font-body-md placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    />
                  </div>

                  {/* Biométricos: Peso y Altura */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface flex items-center gap-1.5" htmlFor="bodyWeight">
                        <span className="material-symbols-outlined text-[16px] text-secondary">scale</span>
                        PESO CORPORAL
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="bodyWeight"
                          type="number"
                          step="0.1"
                          value={bodyWeight}
                          onChange={(e) => setBodyWeight(e.target.value)}
                          className="w-full h-12 px-space-md bg-surface-container-high rounded text-on-surface font-headline-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-secondary transition-all pr-14 tabular-nums"
                        />
                        <button
                          type="button"
                          onClick={() => setPreferredWeightUnit(preferredWeightUnit === 'kg' ? 'lb' : 'kg')}
                          className="absolute right-2 px-2 py-1 bg-surface-container rounded font-label-md text-label-md uppercase text-secondary font-bold hover:bg-surface-container-highest transition-colors select-none"
                        >
                          {preferredWeightUnit.toUpperCase()}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface flex items-center gap-1.5" htmlFor="bodyHeight">
                        <span className="material-symbols-outlined text-[16px] text-secondary">height</span>
                        ALTURA (CM)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="bodyHeight"
                          type="number"
                          step="1"
                          value={bodyHeight}
                          onChange={(e) => setBodyHeight(e.target.value)}
                          className="w-full h-12 px-space-md bg-surface-container-high rounded text-on-surface font-headline-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-secondary transition-all pr-12 tabular-nums"
                        />
                        <span className="absolute right-3 font-label-md text-label-md uppercase text-secondary font-bold select-none">
                          CM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nivel de experiencia */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-secondary">speed</span>
                        NIVEL DE ENTRENAMIENTO &amp; CONDICIÓN
                      </label>
                      <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">RPE BASE 8.5</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 bg-surface-container-lowest p-1 rounded-lg">
                      {['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setExperienceLevel(lvl)}
                          className={`py-2.5 px-2 rounded font-headline-sm text-headline-sm uppercase tracking-wider transition-colors text-center ${
                            experienceLevel === lvl
                              ? 'bg-surface-container-high text-secondary-fixed border-b-2 border-secondary font-bold shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-md text-label-md uppercase tracking-wider text-on-surface flex items-center gap-1.5" htmlFor="passCode">
                        <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
                        CONTRASEÑA DE SEGURIDAD
                      </label>
                      <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider font-bold">
                        SEGURIDAD: ALTA (256-BIT)
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        id="passCode"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full h-12 px-space-md bg-surface-container-high rounded text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-secondary transition-all pr-12 tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 mt-1">
                      <div className="h-1 bg-secondary rounded-full"></div>
                      <div className="h-1 bg-secondary rounded-full"></div>
                      <div className="h-1 bg-secondary rounded-full"></div>
                      <div className="h-1 bg-secondary rounded-full"></div>
                    </div>
                  </div>

                  {/* Términos */}
                  <div className="pt-1 flex items-start gap-3">
                    <label className="relative flex items-center cursor-pointer mt-0.5">
                      <input
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="peer sr-only"
                        id="termsCheck"
                        type="checkbox"
                      />
                      <div className="w-5 h-5 bg-surface-container-high peer-checked:bg-secondary-fixed rounded flex items-center justify-center transition-all peer-focus:ring-2 peer-focus:ring-secondary">
                        <span className="material-symbols-outlined text-[16px] text-on-secondary hidden peer-checked:block font-bold">
                          check
                        </span>
                      </div>
                    </label>
                    <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="termsCheck">
                      Acepto los términos de telemetría deportiva, sincronización continua de sensores y la política de privacidad biométrica de FORGE Athletics.
                    </label>
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-space-xs w-full h-14 bg-primary-container hover:bg-secondary-fixed text-on-primary-container hover:text-on-secondary font-headline-md text-headline-md tracking-wider uppercase font-bold rounded flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(190,245,0,0.35)] active:scale-[0.99] transition-all duration-150 cursor-pointer disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-headline-md">rocket_launch</span>
                    {submitting ? 'CALIBRANDO PERFIL...' : 'CREAR PERFIL & CALIBRAR RUTINAS // REGISTRARME'}
                  </button>
                </form>

                <div className="mt-space-md pt-space-md border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-md text-label-md">
                  <span className="text-on-surface-variant">¿YA TIENES CUENTA EN FORGE?</span>
                  <Link to="/login" className="text-secondary hover:text-primary font-bold tracking-wider uppercase flex items-center gap-1 transition-colors">
                    INICIAR SESIÓN // ACCEDER
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

              <div className="p-space-md bg-surface-container rounded-xl flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase border border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">memory</span>
                  <span>FORGE HARDWARE ECOSYSTEM</span>
                </div>
                <span className="text-primary font-mono font-bold">REGISTRATION GATE #01</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
