import React, { useState } from 'react';
import { User, Mail, Scale, Save, CheckCircle, Database, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updatePreferences, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [preferredWeightUnit, setPreferredWeightUnit] = useState(
    user?.preferredWeightUnit || 'kg'
  );
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      setSaving(true);
      await updatePreferences({ name, preferredWeightUnit });
      setSuccessMsg('Preferencias guardadas exitosamente');
    } catch (err) {
      setErrorMsg(err.message || 'Error al actualizar preferencias');
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Atleta Activo';

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
            Ajustes del Atleta
          </span>
          <h1 className="display-title">PERFIL Y CONFIGURACIÓN</h1>
          <p className="page-subtitle">
            Administra tus preferencias de cuenta, unidades de peso y credenciales.
          </p>
        </div>
      </div>

      {successMsg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: 'var(--success)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}
        >
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            backgroundColor: 'var(--danger-muted)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}
        >
          {errorMsg}
        </div>
      )}

      <div className="forge-grid-2">
        {/* Formulario de Ajustes */}
        <div className="forge-card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Datos del Atleta
          </h3>

          <form onSubmit={handleSave}>
            <div className="forge-input-group">
              <label className="forge-label">Nombre del Atleta</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="forge-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
              </div>
            </div>

            <div className="forge-input-group">
              <label className="forge-label">Correo Electrónico (Solo Lectura)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  disabled
                  className="forge-input"
                  style={{ width: '100%', paddingLeft: '2.5rem', opacity: 0.6 }}
                  value={user?.email || ''}
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
              </div>
            </div>

            <div className="forge-input-group">
              <label className="forge-label">Unidad de Peso para Cálculos y Gráficos</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  marginTop: '0.2rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => setPreferredWeightUnit('kg')}
                  className={`forge-btn ${
                    preferredWeightUnit === 'kg' ? 'forge-btn-primary' : 'forge-btn-secondary'
                  }`}
                  style={{ padding: '0.65rem' }}
                >
                  <Scale size={16} /> Kilogramos (kg)
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredWeightUnit('lb')}
                  className={`forge-btn ${
                    preferredWeightUnit === 'lb' ? 'forge-btn-primary' : 'forge-btn-secondary'
                  }`}
                  style={{ padding: '0.65rem' }}
                >
                  <Scale size={16} /> Libras (lb)
                </button>
              </div>
            </div>

            <div style={{ marginTop: '1.75rem' }}>
              <button
                type="submit"
                disabled={saving}
                className="forge-btn forge-btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                <Save size={18} />
                {saving ? 'Guardando en Atlas...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>

        {/* Resumen de Cuenta e Integración con Atlas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="forge-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
              Estado de la Membresía
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fecha de Ingreso:</span>
                <span style={{ fontWeight: 600 }}>{formattedDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Nivel de Acceso:</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>ATLETA PRO FORGE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Seguridad de Sesión:</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>JWT HttpOnly Cookie</span>
              </div>
            </div>
          </div>

          <div
            className="forge-card"
            style={{
              borderLeft: '4px solid var(--accent)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Database size={20} color="var(--accent)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                Base de Datos PostgreSQL y DBeaver
              </h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Toda la información de este perfil, así como tus rutinas y entrenamientos, persiste en tu base de datos PostgreSQL (<code>forge_gym</code>). Puedes conectar <strong>DBeaver</strong> o <strong>pgAdmin</strong> en el puerto 5432 para explorar las tablas relacionales directamente en tu equipo.
            </p>
          </div>

          <button
            onClick={logout}
            className="forge-btn forge-btn-danger"
            style={{ padding: '0.75rem' }}
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

