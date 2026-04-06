import { Request, Response } from "express";
import { getAllNovelsService, getNovelByIdService, createNovelService, updateNovelService, deleteNovelService } from "../services/novelServices";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";
import { toNovelResponse } from "../models/novelResponse";

export const getAllNovels = async (req: Request, res: Response) => {
    try {
        const result = await getAllNovelsService();
        const responses = result.novels.map(toNovelResponse);

        res.status(HTTP_STATUS.OK).json(successResponse(responses, "Novels retrieved", result.count));
        
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

export const getNovelById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await getNovelByIdService(id);

        if (!result) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Novel not found" });
        }

        const response = toNovelResponse(result);
        res.status(HTTP_STATUS.OK).json(successResponse(response, "Novel retrieved"));
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

export const createNovel = async (req: Request, res: Response) => {
    try {
        const newNovel = req.body;
        const result = await createNovelService(newNovel);
        
        const response = toNovelResponse(result);
        res.status(HTTP_STATUS.CREATED).json(successResponse(response, "Novel created"));
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

export const updateNovel = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await updateNovelService(id, req.body);
        
        if (!result) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Novel not found" });
        }
        
        const response = toNovelResponse(result);
        res.status(HTTP_STATUS.OK).json(successResponse(response, "Novel updated successfully"));
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
    
};

export const deleteNovel = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await deleteNovelService(id);

        if (!result) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Novel not found" });
        }

        res.status(HTTP_STATUS.OK).json(successResponse(undefined, "Novel deleted successfully"));       
    } catch (error: unknown) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};