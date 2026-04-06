import { Request, Response } from "express";
import {
    getAllNovels,
    getNovelById,
    createNovel,
    updateNovel,
    deleteNovel,
} from "../src/api/v1/controller/novelController";
import {
    getAllNovelsService,
    getNovelByIdService,
    createNovelService,
    updateNovelService,
    deleteNovelService,
} from "../src/api/v1/services/novelServices";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/novelServices");

const mockRequest = (overrides: Partial<Request> = {}): Request =>
    ({ params: {}, body: {}, query: {}, ...overrides } as unknown as Request);

const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNovel = {
    id: "1",
    title: "Sword Art Online",
    genres: ["Action", "Fantasy"],
    themes: ["Isekai", "Gaming"],
    status: "Unread",
    updatedAt: new Date("2026-01-01T00:00:00Z"),
};

// ─── getAllNovels ────────────────────────────────────────────────────────────

describe("getAllNovels", () => {
    it("should return 200 with novels and count", async () => {
        (getAllNovelsService as jest.Mock).mockResolvedValue({
            novels: [mockNovel],
            count: 1,
        });

        const req = mockRequest();
        const res = mockResponse();

        await getAllNovels(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ count: 1 })
        );
    });

    it("should return 500 on service error", async () => {
        (getAllNovelsService as jest.Mock).mockRejectedValue(new Error("DB error"));

        const req = mockRequest();
        const res = mockResponse();

        await getAllNovels(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
});

// ─── getNovelById ────────────────────────────────────────────────────────────

describe("getNovelById", () => {
    it("should return 200 with novel when found", async () => {
        (getNovelByIdService as jest.Mock).mockResolvedValue(mockNovel);

        const req = mockRequest({ params: { id: "1" } });
        const res = mockResponse();

        await getNovelById(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ id: "1" }) })
        );
    });

    it("should return 404 when novel not found", async () => {
        (getNovelByIdService as jest.Mock).mockResolvedValue(null);

        const req = mockRequest({ params: { id: "999" } });
        const res = mockResponse();

        await getNovelById(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ error: "Novel not found" });
    });

    it("should return 500 on service error", async () => {
        (getNovelByIdService as jest.Mock).mockRejectedValue(new Error("DB error"));

        const req = mockRequest({ params: { id: "1" } });
        const res = mockResponse();

        await getNovelById(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
});

// ─── createNovel ─────────────────────────────────────────────────────────────

describe("createNovel", () => {
    it("should return 201 with created novel", async () => {
        (createNovelService as jest.Mock).mockResolvedValue(mockNovel);

        const req = mockRequest({
            body: { title: "Sword Art Online", genres: ["Action"], themes: ["Gaming"] },
        });
        const res = mockResponse();

        await createNovel(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ title: "Sword Art Online" }) })
        );
    });

    it("should return 400 when title is missing", async () => {
        (createNovelService as jest.Mock).mockRejectedValue(new Error("Title is required"));

        const req = mockRequest({ body: {} });
        const res = mockResponse();

        await createNovel(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({ error: "Title is required" });
    });

    it("should return 500 on unexpected error", async () => {
        (createNovelService as jest.Mock).mockRejectedValue(new Error("DB error"));

        const req = mockRequest({ body: { title: "Test" } });
        const res = mockResponse();

        await createNovel(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
});

// ─── updateNovel ─────────────────────────────────────────────────────────────

describe("updateNovel", () => {
    it("should return 200 with updated novel", async () => {
        const updated = { ...mockNovel, status: "Reading" };
        (updateNovelService as jest.Mock).mockResolvedValue(updated);

        const req = mockRequest({ params: { id: "1" }, body: { status: "Reading" } });
        const res = mockResponse();

        await updateNovel(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ status: "Reading" }) })
        );
    });

    it("should return 404 when novel not found", async () => {
        (updateNovelService as jest.Mock).mockResolvedValue(null);

        const req = mockRequest({ params: { id: "999" }, body: { status: "Reading" } });
        const res = mockResponse();

        await updateNovel(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ error: "Novel not found" });
    });

    it("should return 500 on service error", async () => {
        (updateNovelService as jest.Mock).mockRejectedValue(new Error("DB error"));

        const req = mockRequest({ params: { id: "1" }, body: {} });
        const res = mockResponse();

        await updateNovel(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
});

// ─── deleteNovel ─────────────────────────────────────────────────────────────

describe("deleteNovel", () => {
    it("should return 200 on successful delete", async () => {
        (deleteNovelService as jest.Mock).mockResolvedValue(true);

        const req = mockRequest({ params: { id: "1" } });
        const res = mockResponse();

        await deleteNovel(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: "Novel deleted successfully" })
        );
    });

    it("should return 404 when novel not found", async () => {
        (deleteNovelService as jest.Mock).mockResolvedValue(false);

        const req = mockRequest({ params: { id: "999" } });
        const res = mockResponse();

        await deleteNovel(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ error: "Novel not found" });
    });

    it("should return 500 on service error", async () => {
        (deleteNovelService as jest.Mock).mockRejectedValue(new Error("DB error"));

        const req = mockRequest({ params: { id: "1" } });
        const res = mockResponse();

        await deleteNovel(req, res);

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });
});