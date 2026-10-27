import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Layers,
  Flame,
  Award,
  Filter,
  Dumbbell
} from 'lucide-react';
import { statsService } from '../services/statsService';
import { exerciseService } from '../services/exerciseService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

// Paleta atlética para gráficos circulares
const CHART_COLORS = [
  '#C6FF00', // Lime
  '#38BDF8', // Cyan
  '#F43F5E', // Rose
  '#A855F7', // Purple
  '#EAB308', // Amber
  '#10B981', // Emerald
  '#F97316', // Orange
  '#6366F1'  // Indigo
];

export default function ProgressPage() {
  const { user } = useAuth();
  const [daysRange, setDaysRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);

  // Análisis por ejercicio específico (1RM)
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [exerciseProgression, setExerciseProgression] = useState(null);
  const [loadingExercise, setLoadingExercise] = useState(false);

  // Cargar estadísticas generales de progreso
  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        const res = await statsService.getProgressStats({ days: daysRange });
        setProgressData(res.data);
      } catch (err) {
        console.error('Error al cargar progreso:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [daysRange]);

  // Cargar lista de ejercicios para el selector de 1RM
  useEffect(() => {
    async function loadExercises() {
      try {
        const res = await exerciseService.getExercises();
        const list = res.data?.exercises || res.data || [];
        setAllExercises(list);
        if (list.length > 0 && !selectedExerciseId) {
          setSelectedExerciseId(list[0].id || list[0]._id);
        }
      } catch (err) {
        console.error('Error al cargar lista de ejercicios:', err.message);
      }
    }
    loadExercises();
  }, []);

  // Cargar evolución específica del ejercicio seleccionado
  useEffect(() => {
    if (!selectedExerciseId) return;

    async function loadExerciseHistory() {
      try {
        setLoadingExercise(true);
        const res = await statsService.getExerciseStats(selectedExerciseId);
        setExerciseProgression(res.data);
      } catch (err) {
        console.error('Error al cargar historial del ejercicio:', err.message);
      } finally {
        setLoadingExercise(false);
      }
    }
    loadExerciseHistory();
  }, [selectedExerciseId]);

  if (loading) {
    return <LoadingSpinner text="Calculando agregaciones de volumen y rendimiento..." />;
  }

  const unit = progressData?.preferredUnit || user?.preferredWeightUnit || 'kg';
  const dailyVolume = progressData?.dailyVolume || [];
  const frequencyChart = progressData?.frequencyChart || [];
  const muscleDistribution = progressData?.muscleDistribution || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            fontSize: '0.8rem'
          }}
        >
          <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            {label}
          </p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color || 'var(--accent)', margin: 0 }}>
              {entry.name}: <strong>{entry.value.toLocaleString()} {entry.unit || ''}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--accent)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            Métricas de Sobrecarga
          </span>
          <h1 className="display-title">PROGRESO Y ANALÍTICAS</h1>
          <p className="page-subtitle">
            Visualiza tu evolución en volumen, frecuencia semanal y estimación de 1RM.
          </p>
        </div>

        {/* Selector de Rango Temporal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-secondary)" />
          <select
            value={daysRange}
            onChange={(e) => setDaysRange(e.target.value)}
            className="forge-select"
            style={{ padding: '0.55rem 1rem' }}
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
            <option value="365">Último año</option>
          </select>
        </div>
      </div>

      {/* Gráfico 1: Evolución de Volumen a lo largo del tiempo */}
      <div className="forge-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Flame size={20} color="var(--accent)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            Evolución del Volumen Levantado ({unit})
          </h3>
        </div>

        {dailyVolume.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Aún no hay suficiente historial de entrenamientos en este periodo para graficar el volumen.
          </div>
        ) : (
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyVolume} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6FF00" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C6FF00" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262E26" vertical={false} />
                <XAxis dataKey="date" stroke="#969D96" fontSize={11} tickLine={false} />
                <YAxis stroke="#969D96" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="volume"
                  name="Volumen"
                  unit={unit}
                  stroke="#C6FF00"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#volumeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Grid en 2 columnas: Frecuencia Semanal y Distribución Muscular */}
      <div className="forge-grid-2" style={{ marginBottom: '2rem' }}>
        {/* Gráfico 2: Frecuencia por día de la semana */}
        <div className="forge-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Calendar size={20} color="var(--accent)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Frecuencia Semanal</h3>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262E26" vertical={false} />
                <XAxis dataKey="day" stroke="#969D96" fontSize={11} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#969D96" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="workouts" name="Entrenamientos" fill="#C6FF00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 3: Distribución por Grupos Musculares */}
        <div className="forge-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Layers size={20} color="var(--accent)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Distribución Muscular</h3>
          </div>

          {muscleDistribution.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Sin datos de series completadas en este periodo.
            </div>
          ) : (
            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={muscleDistribution}
                    dataKey="sets"
                    nameKey="muscle"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={50}
                    paddingAngle={3}
                  >
                    {muscleDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', color: '#969D96' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico 4: Analizador de Progresión 1RM por Ejercicio */}
      <div className="forge-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="var(--accent)" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                Evolución de Carga y 1RM Estimado
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Fórmula de Brzycki para cuantificar tu ganancia de fuerza máxima
              </span>
            </div>
          </div>

          {/* Selector de Ejercicio */}
          <select
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="forge-select"
            style={{ minWidth: '240px' }}
          >
            {allExercises.map((ex) => {
              const exId = ex.id || ex._id;
              return (
                <option key={exId} value={exId}>
                  {ex.name}
                </option>
              );
            })}
          </select>
        </div>

        {loadingExercise ? (
          <LoadingSpinner text="Calculando progresión del ejercicio..." size="sm" />
        ) : !exerciseProgression || exerciseProgression.progression?.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No se han registrado series completadas para este ejercicio todavía.
          </div>
        ) : (
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={exerciseProgression.progression}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#262E26" vertical={false} />
                <XAxis dataKey="date" stroke="#969D96" fontSize={11} tickLine={false} />
                <YAxis stroke="#969D96" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="maxWeight"
                  name={`Peso Máximo (${unit})`}
                  stroke="#38BDF8"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#38BDF8' }}
                />
                <Line
                  type="monotone"
                  dataKey="estimated1RM"
                  name={`1RM Estimado (${unit})`}
                  stroke="#C6FF00"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#C6FF00' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

