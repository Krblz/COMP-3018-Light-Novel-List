import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Novel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         title:
 *           type: string
 *           example: "Sword Art Online"
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Action", "Fantasy"]
 *         themes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Video Game", "Gaming"]
 *         link:
 *           type: string
 *           example: "https://j-novel.club/series/sword-art-online"
 *         status:
 *           type: string
 *           enum: [Unread, Reading, Read]
 *           example: Unread
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-05-01T10:00:00Z"
 *
 *     CreateNovelRequest:
 *       type: object
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         themes:
 *           type: array
 *           items:
 *             type: string
 *         link:
 *           type: string
 *         status:
 *           type: string
 *           enum: [Unread, Reading, Read]
 *
 *     UpdateNovelRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         themes:
 *           type: array
 *           items:
 *             type: string
 *         link:
 *           type: string
 *         status:
 *           type: string
 *           enum: [Unread, Reading, Read]
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Validation error
 *         details:
 *           type: array
 *           items:
 *             type: string
 */

export const novelSchemas = {
    // POST /novels - Create new novel
    create: {
        body: Joi.object({
            title: Joi.string().required().min(1).messages({
                "any.required": "Validation error: \"title\" is required",
                "string.empty": "Validation error: \"title\" is required",
                "string.min": "Validation error: \"title\" must not be empty"
            }),
            genres: Joi.array().items(Joi.string()).optional().messages({
                "array.base": "Validation error: \"genres\" must be an array of strings"
            }),
            themes: Joi.array().items(Joi.string()).optional().messages({
                "array.base": "Validation error: \"themes\" must be an array of strings"
            }),
            link: Joi.string().uri().optional().allow("").messages({
                "string.uri": "Validation error: \"link\" must be a valid URL"
            }),
            status: Joi.string().valid("Unread", "Reading", "Read").default("Unread").messages({
                "any.only": "Validation error: \"status\" must be one of [Unread, Reading, Read]"
            }),
        }),
    },

    // GET /novels/:id - Get single novel
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Novel ID is required",
                "string.empty": "Novel ID cannot be empty",
            }),
        }),
    },

    // PUT /novels/:id - Update novel
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Novel ID is required",
                "string.empty": "Novel ID cannot be empty",
            }),
        }),
        body: Joi.object({
            title: Joi.string().min(1).messages({
                "string.empty": "Validation error: \"title\" must not be empty",
                "string.min": "Validation error: \"title\" must not be empty"
            }),
            genres: Joi.array().items(Joi.string()).optional().messages({
                "array.base": "Validation error: \"genres\" must be an array of strings"
            }),
            themes: Joi.array().items(Joi.string()).optional().messages({
                "array.base": "Validation error: \"themes\" must be an array of strings"
            }),
            link: Joi.string().uri().optional().allow("").messages({
                "string.uri": "Validation error: \"link\" must be a valid URL"
            }),
            status: Joi.string().valid("Unread", "Reading", "Read").messages({
                "any.only": "Validation error: \"status\" must be one of [Unread, Reading, Read]"
            }),
        }),
    },

    // DELETE /novels/:id - Delete novel
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Novel ID is required",
                "string.empty": "Novel ID cannot be empty",
            }),
        }),
    },

    // GET /novels - List novels with filtering
    list: {
        query: Joi.object({
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(10),
            status: Joi.string().valid("Unread", "Reading", "Read").optional(),
            genre: Joi.string().optional(),
            sortBy: Joi.string()
                .valid("title", "updatedAt")
                .default("updatedAt"),
            sortOrder: Joi.string().valid("asc", "desc").default("desc"),
        }),
    },
};