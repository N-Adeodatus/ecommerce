import { Request, Response } from "express";
import mongoose from "mongoose";
import { Order, IOrderItem } from "../models/Order";
import { Product } from "../models/Product";

type Reservation = { productId: string; quantity: number };

async function restoreStock(reserved: Reservation[]): Promise<void> {
  for (const { productId, quantity } of reserved) {
    try {
      await Product.updateOne({ _id: productId }, { $inc: { stock: quantity } });
    } catch (error) {
      console.error(`Failed to restore stock for product ${productId}:`, error);
    }
  }
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  const reserved: Reservation[] = [];

  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const rawItems = (req.body ?? {}).items;

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      res.status(400).json({ error: "items must be a non-empty array" });
      return;
    }

    const quantities = new Map<string, number>();

    for (const item of rawItems) {
      const productId = item?.productId;
      const quantity = item?.quantity;

      if (typeof productId !== "string" || !mongoose.isObjectIdOrHexString(productId)) {
        res.status(400).json({ error: "Each item needs a valid productId" });
        return;
      }

      if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) {
        res.status(400).json({ error: "Each item needs a whole-number quantity of at least 1" });
        return;
      }

      const key = productId.toLowerCase();
      quantities.set(key, (quantities.get(key) ?? 0) + quantity);
    }

    const ids = [...quantities.keys()];
    const found = await Product.find({ _id: { $in: ids } }).select("_id");

    if (found.length !== ids.length) {
      res.status(404).json({ error: "One or more products were not found" });
      return;
    }

    const orderItems: IOrderItem[] = [];

    for (const [productId, quantity] of quantities) {
      const updated = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!updated) {
        await restoreStock(reserved);
        res.status(409).json({ error: "Not enough stock for one of the items", productId });
        return;
      }

      reserved.push({ productId, quantity });
      orderItems.push({
        product: updated._id,
        name: updated.name,
        price: updated.price,
        quantity,
      });
    }

    const totalCents = orderItems.reduce(
      (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total: totalCents / 100,
    });

    reserved.length = 0;
    res.status(201).json(order);
  } catch (error) {
    await restoreStock(reserved);

    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getMyOrders(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}