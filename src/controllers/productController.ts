import { Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";

export async function getProducts(_req: Request, res: Response): Promise<void> {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}