import { Router } from "express";
import { getProducts, getProductById } from "../controllers/productController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64b7f0c2e4b0a1a2b3c4d5e6
 *         name:
 *           type: string
 *           example: Wireless Mouse
 *         description:
 *           type: string
 *           example: Ergonomic 2.4GHz mouse
 *         price:
 *           type: number
 *           example: 19.99
 *         stock:
 *           type: integer
 *           example: 50
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List all products (newest first)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: An array of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get one product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product's MongoDB id
 *     responses:
 *       200:
 *         description: The product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product id
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

export default router;