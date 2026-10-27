import mongoose from 'mongoose';

const workoutSetSchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: [true, 'El ejercicio de la serie es obligatorio']
    },
    setNumber: {
      type: Number,
      required: [true, 'El número de serie es obligatorio'],
      min: [1, 'El número de serie debe ser al menos 1']
    },
    weight: {
      type: Number,
      min: [0, 'El peso debe ser mayor o igual a 0'],
      default: 0
    },
    repetitions: {
      type: Number,
      min: [0, 'Las repeticiones deben ser mayores o iguales a 0'],
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    recordedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const workoutSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
      index: true
    },
    routine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Routine',
      default: null
    },
    name: {
      type: String,
      required: [true, 'El nombre del entrenamiento es obligatorio'],
      trim: true,
      default: 'Entrenamiento Libre'
    },
    startedAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    completedAt: {
      type: Date,
      default: null
    },
    durationSeconds: {
      type: Number,
      min: [0, 'La duración no puede ser negativa'],
      default: 0
    },
    status: {
      type: String,
      enum: {
        values: ['in_progress', 'completed'],
        message: 'El estado debe ser in_progress o completed'
      },
      default: 'in_progress',
      index: true
    },
    sets: {
      type: [workoutSetSchema],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Virtual para calcular el volumen total levantado en series completadas
workoutSessionSchema.virtual('totalVolume').get(function () {
  if (!this.sets || !Array.isArray(this.sets)) return 0;
  return this.sets.reduce((sum, s) => {
    if (s.completed && s.weight > 0 && s.repetitions > 0) {
      return sum + s.weight * s.repetitions;
    }
    return sum;
  }, 0);
});

// Virtual para calcular el número de series completadas
workoutSessionSchema.virtual('completedSetsCount').get(function () {
  if (!this.sets || !Array.isArray(this.sets)) return 0;
  return this.sets.filter((s) => s.completed).length;
});

// Índice compuesto para consultar entrenamientos de un usuario ordenados por fecha
workoutSessionSchema.index({ user: 1, startedAt: -1 });
workoutSessionSchema.index({ user: 1, status: 1 });

export const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

