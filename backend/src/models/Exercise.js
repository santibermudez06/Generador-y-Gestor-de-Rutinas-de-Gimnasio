import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del ejercicio es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    muscleGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MuscleGroup',
      required: [true, 'El grupo muscular principal es obligatorio'],
      index: true
    },
    secondaryMuscles: {
      type: [String],
      default: []
    },
    equipment: {
      type: String,
      required: [true, 'El equipamiento es obligatorio'],
      trim: true,
      default: 'Peso corporal'
    },
    difficulty: {
      type: String,
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'La dificultad debe ser beginner, intermediate o advanced'
      },
      default: 'intermediate'
    },
    instructions: {
      type: [String],
      default: []
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
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

// Índice de texto para búsqueda ágil por nombre
exerciseSchema.index({ name: 'text', description: 'text' });

export const Exercise = mongoose.model('Exercise', exerciseSchema);

