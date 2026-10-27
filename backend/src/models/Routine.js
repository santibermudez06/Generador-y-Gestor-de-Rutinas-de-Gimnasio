import mongoose from 'mongoose';

const routineExerciseSchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: [true, 'El ejercicio es obligatorio']
    },
    order: {
      type: Number,
      default: 0
    },
    targetSets: {
      type: Number,
      required: [true, 'El número de series objetivo es obligatorio'],
      min: [1, 'Debe haber al menos 1 serie'],
      max: [20, 'El número de series no puede exceder 20'],
      default: 3
    },
    targetReps: {
      type: Number,
      required: [true, 'El número de repeticiones objetivo es obligatorio'],
      min: [1, 'Debe haber al menos 1 repetición'],
      max: [100, 'Las repeticiones no pueden exceder 100'],
      default: 10
    },
    targetWeight: {
      type: Number,
      min: [0, 'El peso no puede ser negativo'],
      default: 0
    },
    restSeconds: {
      type: Number,
      min: [0, 'El descanso no puede ser negativo'],
      max: [600, 'El descanso no puede exceder 600 segundos'],
      default: 90
    }
  },
  { _id: true }
);

const routineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario propietario es obligatorio'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'El nombre de la rutina es obligatorio'],
      trim: true,
      maxlength: [80, 'El nombre de la rutina no puede exceder 80 caracteres']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    difficulty: {
      type: String,
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'La dificultad debe ser beginner, intermediate o advanced'
      },
      default: 'intermediate'
    },
    estimatedDuration: {
      type: Number,
      min: [5, 'La duración mínima estimada es de 5 minutos'],
      max: [300, 'La duración máxima estimada es de 300 minutos'],
      default: 60
    },
    exercises: {
      type: [routineExerciseSchema],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Índice compuesto para consultas rápidas de rutinas por usuario
routineSchema.index({ user: 1, createdAt: -1 });

export const Routine = mongoose.model('Routine', routineSchema);

