import { Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";

type ProductFields = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
};

function parseProductFields(body: unknown): { fields?: ProductFields; problem?: string } {
  const data = (body ?? {}) as Record<string, unknown>;
  const fields: ProductFields = {};

  if (data.name !== undefined) {
    if (typeof data.name !== "string" || !data.name.trim()) {
      return { problem: "name must be a non-empty string" };
    }
    fields.name = data.name;
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string") {
      return { problem: "description must be a string" };
    }
    fields.description = data.description;
  }

  if (data.price !== undefined) {
    if (typeof data.price !== "number" || !Number.isFinite(data.price)) {
      return { problem: "price must be a number" };
    }
    fields.price = data.price;
  }

  if (data.stock !== undefined) {
    if (typeof data.stock !== "number" || !Number.isFinite(data.stock)) {
      return { problem: "stock must be a number" };
    }
    fields.stock = data.stock;
  }

  return { fields };
}

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

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const { fields, problem } = parseProductFields(req.body);

    if (problem || !fields) {
      res.status(400).json({ error: problem });
      return;
    }

    if (fields.name === undefined || fields.price === undefined) {
      res.status(400).json({ error: "name and price are required" });
      return;
    }

    const product = await Product.create(fields);
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }

    const { fields, problem } = parseProductFields(req.body);

    if (problem || !fields) {
      res.status(400).json({ error: problem });
      return;
    }

    if (Object.keys(fields).length === 0) {
      res.status(400).json({ error: "Provide at least one of name, description, price, stock" });
      return;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: fields },
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}