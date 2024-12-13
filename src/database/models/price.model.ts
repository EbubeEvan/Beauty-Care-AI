import { Document, model, models, Schema } from 'mongoose';

export interface IPrice extends Document {
  credits : number,
  p1 : number,
  p2 : number,
  p3 : number,
  discount : number
}

const priceSchema = new Schema<IPrice>({
    credits: { type: Number, required: true },
    p1: { type: Number, required: true },
    p2: { type: Number, required: true, unique: true },
    p3: { type: Number, required: true },
    discount: { type: Number, required: true },
});

const Price = models.Price || model<IPrice>('Price', priceSchema);
export default Price;
