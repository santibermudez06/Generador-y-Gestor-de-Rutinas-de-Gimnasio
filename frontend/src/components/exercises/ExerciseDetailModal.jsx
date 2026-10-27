import React from 'react';
import Modal from '../common/Modal';
import { getExerciseImage } from '../../utils/exerciseImages';

export default function ExerciseDetailModal({ exercise, isOpen, onClose }) {
  if (!exercise) return null;

  const difficultyVariant = {
    beginner: 'bg-green-950/80 text-green-400 border-green-800/50',
    intermediate: 'bg-yellow-950/80 text-yellow-400 border-yellow-800/50',
    advanced: 'bg-red-950/80 text-red-400 border-red-800/50',
    Principiante: 'bg-green-950/80 text-green-400 border-green-800/50',
    Intermedio: 'bg-yellow-950/80 text-yellow-400 border-yellow-800/50',
    Avanzado: 'bg-red-950/80 text-red-400 border-red-800/50'
  }[exercise.difficulty] || 'bg-surface-container text-primary-fixed border-primary-fixed/40';

  const muscleName = exercise.muscleGroup?.name || exercise.category || 'Músculo Principal';
  const imgUrl = getExerciseImage(exercise);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={exercise.name.toUpperCase()}
      maxWidth="780px"
    >
      <div className="flex flex-col gap-space-md text-on-surface">
        {/* Top Meta Ribbons */}
        <div className="flex flex-wrap items-center justify-between gap-space-xs pb-1 border-b border-outline-variant/30">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="px-2.5 py-1 rounded-DEFAULT bg-primary-fixed/15 border border-primary-fixed/40 text-primary-fixed font-label-md text-label-md uppercase font-bold tracking-wider">
              {muscleName}
            </span>
            <span className="px-2.5 py-1 rounded-DEFAULT bg-surface-container-high border border-outline-variant/40 text-on-surface font-label-md text-label-md uppercase">
              {exercise.equipment || 'Equipamiento Estándar'}
            </span>
            <span className={`px-2.5 py-1 rounded-DEFAULT border font-label-md text-label-md uppercase font-bold ${difficultyVariant}`}>
              {exercise.difficulty || 'Intermedio'}
            </span>
          </div>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline hidden sm:inline-block">
            MOTOR ATLAS V4.8
          </span>
        </div>

        {/* ======================================================== */}
        {/* VISUAL LARGE TECHNICAL EXECUTION IMAGE BANNER             */}
        {/* ======================================================== */}
        <div className="relative w-full h-64 sm:h-80 bg-surface-container-lowest rounded-DEFAULT overflow-hidden border border-outline-variant/40 shadow-2xl group">
          <img
            src={imgUrl}
            alt={`Técnica de ejecución: ${exercise.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent"></div>

          {/* Top-Right Badge */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded-DEFAULT bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant/50 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed font-bold">
              TÉCNICA &bull; ALTA PRECISIÓN
            </span>
          </div>

          {/* Bottom Title Bar on Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-surface-container-lowest/85 backdrop-blur-md p-2.5 rounded-DEFAULT border border-outline-variant/40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">fitness_center</span>
              <div>
                <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider block">
                  PATRÓN BIOMECÁNICO
                </span>
                <span className="font-headline-sm text-headline-sm uppercase text-primary leading-tight">
                  {exercise.name}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-label-sm text-[10px] text-primary-fixed font-mono uppercase block">
                ACTIVACIÓN EMG
              </span>
              <span className="font-headline-sm text-headline-sm text-primary-fixed font-bold">
                92% EFICACIA
              </span>
            </div>
          </div>
        </div>

        {/* Descripción general */}
        {exercise.description && (
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            {exercise.description}
          </p>
        )}

        {/* Músculos Secundarios Involucrados */}
        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <div className="bg-surface-container-low p-space-sm rounded-DEFAULT border border-outline-variant/30 flex flex-col gap-1.5">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              MÚSCULOS SECUNDARIOS Y SINERGISTAS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {exercise.secondaryMuscles.map((sec, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-DEFAULT bg-surface-container-high border border-outline-variant/40 text-primary text-body-sm font-medium"
                >
                  {sec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Protocolo de Ejecución Paso a Paso */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed text-[20px]">format_list_numbered</span>
            <h4 className="font-headline-sm text-headline-sm text-primary uppercase tracking-wide">
              PROTOCOLO DE EJECUCIÓN (PASO A PASO)
            </h4>
          </div>

          {exercise.instructions && exercise.instructions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {exercise.instructions.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-surface-container-low rounded-DEFAULT border border-outline-variant/20 flex items-start gap-3 hover:bg-surface-container transition-colors"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-DEFAULT bg-primary-fixed/20 text-primary-fixed font-headline-sm text-headline-sm flex items-center justify-center font-bold">
                    0{idx + 1}
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface leading-snug pt-0.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Mantén el core activado, columna en alineación neutra y controla la fase excéntrica del movimiento (2-3 segundos de descenso).
            </p>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/30 mt-2">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase">
            <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
            <span>Rango de Movimiento Completo (ROM)</span>
          </div>

          <button
            onClick={onClose}
            className="px-space-lg py-2.5 bg-surface-container-high hover:bg-surface-bright text-primary font-headline-sm text-headline-sm uppercase tracking-wider rounded-DEFAULT transition-colors"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </Modal>
  );
}
