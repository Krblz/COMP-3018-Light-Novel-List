import {
    getAllNovelsService,
    getNovelByIdService,
    createNovelService,
    updateNovelService,
    deleteNovelService,
} from "../src/api/v1/services/novelServices";
import {
    getAllNovels,
    getNovelById,
    addNovel,
    updateNovel,
    deleteNovel,
} from "../src/api/v1/repositories/novelRepository";

jest.mock("../src/api/v1/repositories/novelRepository");

const mockNovel = {
    id: "1",
    title: "Sword Art Online",
    genres: ["Action", "Fantasy"],
    themes: ["Video Game", "Gaming"],
    status: "Unread",
    updatedAt: new Date("2026-01-01T00:00:00Z"),
};

// ─── getAllNovelsService ──────────────────────────────────────────────────────

describe("getAllNovelsService", () => {
    it("should return novels with count", async () => {
        (getAllNovels as jest.Mock).mockResolvedValue([mockNovel]);

        const result = await getAllNovelsService();

        expect(result.count).toBe(1);
        expect(result.novels).toHaveLength(1);
        expect(result.novels[0].title).toBe("Sword Art Online");
    });

    it("should return empty list when no novels exist", async () => {
        (getAllNovels as jest.Mock).mockResolvedValue([]);

        const result = await getAllNovelsService();

        expect(result.count).toBe(0);
        expect(result.novels).toHaveLength(0);
    });
});

// ─── getNovelByIdService ──────────────────────────────────────────────────────

describe("getNovelByIdService", () => {
    it("should return a novel when found", async () => {
        (getNovelById as jest.Mock).mockResolvedValue(mockNovel);

        const result = await getNovelByIdService("1");

        expect(result).not.toBeNull();
        expect(result?.id).toBe("1");
        expect(result?.title).toBe("Sword Art Online");
    });

    it("should return null when novel not found", async () => {
        (getNovelById as jest.Mock).mockResolvedValue(null);

        const result = await getNovelByIdService("999");

        expect(result).toBeNull();
    });
});

// ─── createNovelService ───────────────────────────────────────────────────────

describe("createNovelService", () => {
    it("should create a novel with provided fields", async () => {
        (addNovel as jest.Mock).mockResolvedValue({ id: "1" });

        const result = await createNovelService({
            title: "Sword Art Online",
            genres: ["Action"],
            themes: ["Gaming"],
            status: "Unread",
        });

        expect(result.id).toBe("1");
        expect(result.title).toBe("Sword Art Online");
        expect(result.genres).toEqual(["Action"]);
    });

    it("should default genres and themes to [N/A] when not provided", async () => {
        (addNovel as jest.Mock).mockResolvedValue({ id: "2" });

        const result = await createNovelService({
            title: "No Genre Novel",
            genres: [],
            themes: [],
            status: "Unread",
        });

        expect(result.genres).toEqual(["N/A"]);
        expect(result.themes).toEqual(["N/A"]);
    });

    it("should default status to Unread when not provided", async () => {
        (addNovel as jest.Mock).mockResolvedValue({ id: "3" });

        const result = await createNovelService({
            title: "No Status Novel",
            genres: ["Fantasy"],
            themes: ["Adventure"],
            status: "",
        });

        expect(result.status).toBe("Unread");
    });

    it("should throw an error when title is missing", async () => {
        await expect(
            createNovelService({
                title: "",
                genres: [],
                themes: [],
                status: "Unread",
            })
        ).rejects.toThrow("Title is required");
    });

    it("should throw an error when title is whitespace only", async () => {
        await expect(
            createNovelService({
                title: "   ",
                genres: [],
                themes: [],
                status: "Unread",
            })
        ).rejects.toThrow("Title is required");
    });
});

// ─── updateNovelService ───────────────────────────────────────────────────────

describe("updateNovelService", () => {
    it("should return updated novel", async () => {
        const updated = { ...mockNovel, status: "Reading" };
        (updateNovel as jest.Mock).mockResolvedValue(updated);

        const result = await updateNovelService("1", { status: "Reading" });

        expect(result?.status).toBe("Reading");
    });

    it("should return null when novel not found", async () => {
        (updateNovel as jest.Mock).mockResolvedValue(null);

        const result = await updateNovelService("999", { status: "Reading" });

        expect(result).toBeNull();
    });
});

// ─── deleteNovelService ───────────────────────────────────────────────────────

describe("deleteNovelService", () => {
    it("should return true on successful delete", async () => {
        (deleteNovel as jest.Mock).mockResolvedValue(true);

        const result = await deleteNovelService("1");

        expect(result).toBe(true);
    });

    it("should return false when novel not found", async () => {
        (deleteNovel as jest.Mock).mockResolvedValue(false);

        const result = await deleteNovelService("999");

        expect(result).toBe(false);
    });
});