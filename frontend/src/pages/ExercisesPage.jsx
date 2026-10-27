import React, { useEffect, useState } from 'react';
import { exerciseService } from '../services/exerciseService';
import ExerciseDetailModal from '../components/exercises/ExerciseDetailModal';
import { getExerciseImage } from '../utils/exerciseImages';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('ALL');
  const [selectedEquipment, setSelectedEquipment] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const mgRes = await exerciseService.getMuscleGroups();
        setMuscleGroups(mgRes.data || []);
      } catch (err) {
        console.error('Error al cargar grupos musculares:', err);
      }
    }
    loadInitialData();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedMuscle !== 'ALL') params.muscleGroup = selectedMuscle;
      if (selectedEquipment !== 'ALL') params.equipment = selectedEquipment;
      if (selectedDifficulty !== 'ALL') params.difficulty = selectedDifficulty;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await exerciseService.getExercises(params);
      setExercises(res.data?.exercises || res.data || []);
    } catch (err) {
      console.error('Error al cargar ejercicios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [selectedMuscle, selectedEquipment, selectedDifficulty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExercises();
  };

  return (
    <div className="flex flex-col gap-space-lg w-full">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-DEFAULT bg-primary-fixed"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">
              ENCICLOPEDIA TÉCNICA // POSTGRESQL ATLAS
            </span>
            <span className="text-outline text-label-sm font-label-sm">/ 30 EJERCICIOS CANÓNICOS</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary uppercase tracking-tight leading-none">
            BIBLIOTECA DE EJERCICIOS
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Catálogo biomecánico con guías anatómicas, activación neuromuscular y requerimientos de equipamiento.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="BUSCAR POR NOMBRE O MÚSCULO..."
            className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-10 pr-4 py-3 rounded-DEFAULT placeholder:text-outline focus:bg-surface-container focus:outline-none uppercase tracking-wider border border-outline-variant/30"
          />
        </form>
      </div>

      {/* Category Pills (Muscle Groups) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedMuscle('ALL')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-DEFAULT font-headline-sm text-headline-sm uppercase tracking-wider transition-all whitespace-nowrap ${
            selectedMuscle === 'ALL'
              ? 'bg-primary-fixed text-on-primary-fixed font-bold'
              : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container border border-outline-variant/20'
          }`}
        >
          <span>TODOS</span>
        </button>

        {muscleGroups.map((mg) => {
          const mgId = mg.id || mg._id;
          const isSelected = selectedMuscle === mgId;
          return (
            <button
              key={mgId}
              onClick={() => setSelectedMuscle(isSelected ? 'ALL' : mgId)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-DEFAULT font-headline-sm text-headline-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container border border-outline-variant/20'
              }`}
            >
              <span>{mg.name}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Filter Toolbar */}
      <div className="p-space-sm bg-surface-container-low rounded-DEFAULT flex flex-wrap items-center justify-between gap-space-md border border-outline-variant/30">
        <div className="flex items-center gap-space-md flex-wrap">
          {/* Equipment */}
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">EQUIPO:</span>
            <div className="flex items-center gap-1 flex-wrap">
              {['ALL', 'Barra', 'Mancuernas', 'Polea', 'Máquina', 'Peso corporal'].map((eq) => (
                <button
                  key={eq}
                  onClick={() => setSelectedEquipment(eq)}
                  className={`px-2.5 py-1 rounded-DEFAULT font-label-md text-label-md uppercase transition-colors ${
                    selectedEquipment === eq
                      ? 'bg-surface-container-highest text-primary-fixed font-bold border border-primary-fixed/40'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {eq === 'ALL' ? 'Todos' : eq}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">DIFICULTAD:</span>
            <div className="flex items-center gap-1">
              {['ALL', 'Principiante', 'Intermedio', 'Avanzado'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-2.5 py-1 rounded-DEFAULT font-label-sm text-label-sm uppercase transition-colors ${
                    selectedDifficulty === d
                      ? 'bg-surface-container-highest text-secondary font-bold border border-secondary/40'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {d === 'ALL' ? 'Todos' : d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <span className="font-label-sm text-label-sm uppercase text-outline">
          {exercises.length} RESULTADOS DISPONIBLES
        </span>
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-3xl text-primary-fixed">progress_activity</span>
          <p className="mt-2 font-label-md uppercase">Cargando biblioteca kinética...</p>
        </div>
      ) : exercises.length === 0 ? (
        <div className="bg-surface-container-low p-12 text-center rounded-DEFAULT border border-outline-variant/30">
          <span className="material-symbols-outlined text-5xl text-outline mb-2">fitness_center</span>
          <h3 className="font-headline-md text-headline-md uppercase text-primary">No se encontraron ejercicios</h3>
          <p className="font-body-md text-on-surface-variant max-w-md mx-auto mt-1">
            Intenta cambiar los filtros de búsqueda o el grupo muscular seleccionado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
          {exercises.map((exercise) => {
            const mgName = exercise.muscleGroup?.name || exercise.category || 'Músculo';
            const diff = exercise.difficulty || 'Intermedio';
            const equip = exercise.equipment || 'Libre';
            const cardImg = getExerciseImage(exercise);

            return (
              <div
                key={exercise.id || exercise._id}
                onClick={() => setSelectedExercise(exercise)}
                className="group relative bg-surface-container p-space-md rounded-DEFAULT shadow-xl transition-all cursor-pointer border border-outline-variant/30 hover:border-primary-fixed/50 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-fixed opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div>
                  <div className="flex items-start justify-between gap-space-sm mb-space-xs">
                    <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-mono">
                      {mgName.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded-DEFAULT bg-surface-container-high text-on-surface font-label-sm text-[10px] uppercase">
                      {diff}
                    </span>
                  </div>

                  <h3 className="font-headline-md text-headline-md text-primary uppercase group-hover:text-primary-fixed transition-colors">
                    {exercise.name}
                  </h3>

                  {/* Technical Image Schematic Preview */}
                  <div className="relative w-full h-36 bg-surface-container-lowest rounded-DEFAULT overflow-hidden my-space-sm border border-outline-variant/20">
                    <img
                      src={cardImg}
                      alt={exercise.name}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-surface-container-lowest/90 rounded-DEFAULT font-label-sm text-[10px] text-primary-fixed font-mono uppercase">
                      ROM ÓPTIMO
                    </div>
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-surface-container-lowest/90 rounded-DEFAULT font-label-sm text-[10px] text-on-surface-variant uppercase">
                      {equip}
                    </div>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                    {exercise.description || 'Ejercicio de alta demanda neuromuscular y desarrollo de fuerza.'}
                  </p>
                </div>

                <div className="mt-space-md pt-space-xs border-t border-outline-variant/20 flex items-center justify-between font-label-sm text-label-sm text-outline">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">fitness_center</span>
                    <span>{equip}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExercise(exercise);
                    }}
                    className="text-primary-fixed font-bold flex items-center gap-1 hover:underline uppercase"
                  >
                    <span>Ver Técnica</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Technique Modal with Visual Execution */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}
