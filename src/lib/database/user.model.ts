import { Document, model, models, Schema } from 'mongoose';
import { beautyProfileType, messageSchematype } from '../types';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  creditBalance?: number;
  beautyProfile?: beautyProfileType;
  chatHistory?: {
    title: string;
    messages: messageSchematype[];
  }[];
}

const messageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  experimental_attachments: {
    type: String,
    required: false,
  },
  id: {
    type: String,
    required: true, // Adjust based on your application logic
  },
  role: {
    type: String,
    enum: ["assistant", "user"],
    required: true, // Adjust based on your application logic
  },
});

const BeautyProfileSchema = new Schema({
  hairColor: {
    type: String,
    required: true,
  },
  hairType: {
    type: String,
    required: true,
  },
  strandThickness: {
    type: String,
    required: true,
  },
  chemicalTreatment: {
    type: String,
    required: true,
  },
  hairVolume: {
    type: String,
    required: true,
  },
  skinColor: {
    type: String,
    required: true,
  },
  skinType: {
    type: String,
    required: true,
  },
  sensitivity: {
    type: String,
    required: true,
  },
  albino: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  creditBalance: {
    type: Number,
    default: 20,
  },
  beautyProfile: BeautyProfileSchema,
  chatHistory: [
    {
      title: String,
      messages: [messageSchema],
    },
  ],
});

const User = models.User || model<IUser>('User', userSchema);
export default User;
