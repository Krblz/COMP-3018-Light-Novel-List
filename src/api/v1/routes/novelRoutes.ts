import { Router } from "express";
import { getAllNovels, getNovelById, createNovel, updateNovel, deleteNovel } from "../controller/novelController";
import { validateRequest } from "../middleware/validate";
import { novelSchemas } from "../validation/novelSchemas";

const router: Router = Router();

/**
 * @openapi
 * /api/v1/novels:
 *   get:
 *     summary: Get all novels
 *     tags: [Novels]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1000
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Unread, Reading, Read]
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, updatedAt]
 *           default: updatedAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: List of novels retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Novels retrieved
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Novel'
 *       500:
 *         description: Internal server error
 */
router.get('/novels', getAllNovels);

/**
 * @openapi
 * /api/v1/novels/{id}:
 *   get:
 *     summary: Get a novel by ID
 *     tags: [Novels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Novel retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Novel retrieved
 *                 data:
 *                   $ref: '#/components/schemas/Novel'
 *       404:
 *         description: Novel not found
 *       500:
 *         description: Internal server error
 */
router.get('/novels/:id', validateRequest(novelSchemas.getById), getNovelById);

/**
 * @openapi
 * /api/v1/novels:
 *   post:
 *     summary: Create a new novel
 *     tags: [Novels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNovelRequest'
 *           example:
 *             title: "Sword Art Online"
 *             genres: ["Action", "Fantasy"]
 *             themes: ["Video Game", "Gaming"]
 *             status: "Unread"
 *     responses:
 *       201:
 *         description: Novel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Novel created
 *                 data:
 *                   $ref: '#/components/schemas/Novel'
 *       400:
 *         description: Validation error - title is required
 *       500:
 *         description: Internal server error
 */
router.post('/novels', validateRequest(novelSchemas.create), createNovel);

/**
 * @openapi
 * /api/v1/novels/{id}:
 *   put:
 *     summary: Update a novel by ID
 *     tags: [Novels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNovelRequest'
 *           example:
 *             status: "Reading"
 *             genres: ["Action", "Fantasy"]
 *     responses:
 *       200:
 *         description: Novel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Novel updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Novel'
 *       404:
 *         description: Novel not found
 *       500:
 *         description: Internal server error
 */
router.put('/novels/:id', validateRequest(novelSchemas.update), updateNovel);

/**
 * @openapi
 * /api/v1/novels/{id}:
 *   delete:
 *     summary: Delete a novel by ID
 *     tags: [Novels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Novel deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Novel deleted successfully
 *       404:
 *         description: Novel not found
 *       500:
 *         description: Internal server error
 */
router.delete('/novels/:id', validateRequest(novelSchemas.delete), deleteNovel);

export default router;