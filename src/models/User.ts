import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  createdAt: Date;
}


const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'الاسم مطلوب'],
    },
    email: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;