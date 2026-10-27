import mongoose from 'mongoose';

const muscleGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del grupo muscular es obligatorio'],
      unique: true,
      trim: true,
      maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    description: {
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

export const MuscleGroup = mongoose.model('MuscleGroup', muscleGroupSchema);

