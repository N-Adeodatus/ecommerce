import { Schema, model } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "stock must be a whole number",
      },
    },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);