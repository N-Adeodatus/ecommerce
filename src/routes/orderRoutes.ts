import { Router } from "express";
import { createOrder, getMyOrders } from "../controllers/orderController";
import { protect } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           example: 64b7f0c2e4b0a1a2b3c4d5e6
 *         name:
 *           type: string
 *           example: Wireless Mouse
 *         price:
 *           type: number
 *           example: 19.99
 *         quantity:
 *           type: integer
 *           example: 2
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         total:
 *           type: number
 *           example: 49.97
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place an order (prices and total are computed by the server)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Replace with a real product id from GET /products
 *                       example: 64b7f0c2e4b0a1a2b3c4d5e6
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid items
 *       401:
 *         description: Missing, invalid or expired token
 *       404:
 *         description: One or more products were not found
 *       409:
 *         description: Not enough stock
 */
router.post("/", protect, createOrder);

/**
 * @swagger
 * /orders/my:
 *   get:
 *     summary: List the logged-in user's orders (newest first)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of the caller's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Missing, invalid or expired token
 */
router.get("/my", protect, getMyOrders);

export default router;