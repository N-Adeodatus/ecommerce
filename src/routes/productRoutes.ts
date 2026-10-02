import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { protect } from "../middleware/auth";
import { adminOnly } from "../middleware/admin";

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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Webcam HD
 *               description:
 *                 type: string
 *                 example: 1080p USB webcam
 *               price:
 *                 type: number
 *                 example: 49.9
 *               stock:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing or invalid fields
 *       401:
 *         description: Missing, invalid or expired token
 *       403:
 *         description: Admin access required
 */
router.post("/", protect, adminOnly, createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product (admin only, send only the fields to change)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product's MongoDB id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 24.99
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: The updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid id or invalid fields
 *       401:
 *         description: Missing, invalid or expired token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.put("/:id", protect, adminOnly, updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product's MongoDB id
 *     responses:
 *       200:
 *         description: Product deleted
 *       400:
 *         description: Invalid product id
 *       401:
 *         description: Missing, invalid or expired token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;