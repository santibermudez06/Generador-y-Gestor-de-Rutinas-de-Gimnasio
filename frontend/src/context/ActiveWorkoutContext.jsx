import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { workoutService } from '../services/workoutService';
import { useAuth } from './AuthContext';

const ActiveWorkoutContext = createContext(null);

export function ActiveWorkoutProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loadingActive, setLoadingActive] = useState(false);

  // Estado del temporizador de descanso
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [totalRestTarget, setTotalRestTarget] = useState(90);

  const restIntervalRef = useRef(null);

  // Reproducir sonido beep sintetizado de alta frecuencia al terminar el descanso
  const playAlertSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Nota A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.log('Audio no disponible o bloqueado por interacción previa');
    }
  };

  // Cargar sesión activa al iniciar o autenticarse
  const fetchActiveWorkout = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingActive(true);
      const res = await workoutService.getActiveWorkout();
      if (res.data) {
        setActiveWorkout(res.data);
      } else {
        setActiveWorkout(null);
      }
    } catch (err) {
      console.error('Error al recuperar sesión activa:', err.message);
    } finally {
      setLoadingActive(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchActiveWorkout();
    } else {
      setActiveWorkout(null);
      stopRestTimer();
    }
  }, [isAuthenticated]);

  // Manejo del temporizador de descanso con cuenta regresiva
  useEffect(() => {
    if (isResting && restSecondsLeft > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(restIntervalRef.current);
            setIsResting(false);
            playAlertSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(restIntervalRef.current);
    }

    return () => clearInterval(restIntervalRef.current);
  }, [isResting, restSecondsLeft]);

  const startRestTimer = (seconds = 90) => {
    const sec = Math.max(5, Number(seconds) || 90);
    setTotalRestTarget(sec);
    setRestSecondsLeft(sec);
    setIsResting(true);
  };

  const stopRestTimer = () => {
    clearInterval(restIntervalRef.current);
    setIsResting(false);
    setRestSecondsLeft(0);
  };

  const addRestSeconds = (extraSeconds = 15) => {
    setRestSecondsLeft((prev) => prev + extraSeconds);
    setTotalRestTarget((prev) => prev + extraSeconds);
  };

  // Iniciar entrenamiento con rutina o libre
  const startWorkout = async ({ routineId, name }) => {
    const res = await workoutService.createWorkout({ routineId, name });
    setActiveWorkout(res.data);
    return res.data;
  };

  // Finalizar entrenamiento activo
  const finishActiveWorkout = async (durationSeconds) => {
    if (!activeWorkout) return null;
    stopRestTimer();
    const id = activeWorkout.id || activeWorkout._id;
    const res = await workoutService.finishWorkout(id, { durationSeconds });
    setActiveWorkout(null);
    return res.data;
  };

  return (
    <ActiveWorkoutContext.Provider
      value={{
        activeWorkout,
        setActiveWorkout,
        loadingActive,
        fetchActiveWorkout,
        startWorkout,
        finishActiveWorkout,
        isResting,
        restSecondsLeft,
        totalRestTarget,
        startRestTimer,
        stopRestTimer,
        addRestSeconds
      }}
    >
      {children}
    </ActiveWorkoutContext.Provider>
  );
}

export function useActiveWorkout() {
  const context = useContext(ActiveWorkoutContext);
  if (!context) {
    throw new Error('useActiveWorkout debe usarse dentro de un ActiveWorkoutProvider');
  }
  return context;
}

