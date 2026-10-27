import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [60, 'El nombre no puede exceder 60 caracteres']
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor proporcione un correo electrónico válido']
    },
    passwordHash: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
    },
    preferredWeightUnit: {
      type: String,
      enum: {
        values: ['kg', 'lb'],
        message: 'La unidad de peso debe ser kg o lb'
      },
      default: 'kg'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Método estático para verificar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Método para hashear contraseñas estáticamente o antes de guardar
userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

export const User = mongoose.model('User', userSchema);

