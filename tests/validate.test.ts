import { novelSchemas } from "../src/api/v1/validation/novelSchemas";

// ─── create ───────────────────────────────────────────────────────────────────

describe("novelSchemas.create.body", () => {
    const schema = novelSchemas.create.body;

    it("should pass with title only", () => {
        const { error, value } = schema.validate({ title: "Sword Art Online" });

        expect(error).toBeUndefined();
        expect(value.status).toBe("Unread");     // default
    });

    it("should pass with all fields provided", () => {
        const { error } = schema.validate({
            title: "Sword Art Online",
            genres: ["Action", "Fantasy"],
            themes: ["Video Game", "Gaming"],
            status: "Reading",
        });

        expect(error).toBeUndefined();
    });

    it("should fail when title is missing", () => {
        const { error } = schema.validate({ genres: ["Action"] });

        expect(error).toBeDefined();
        expect(error?.message).toContain("title");
    });

    it("should fail when title is empty string", () => {
        const { error } = schema.validate({ title: "" });

        expect(error).toBeDefined();
        expect(error?.message).toContain("title");
    });

    it("should fail with invalid status", () => {
        const { error } = schema.validate({ title: "Test Novel", status: "Dropped" });

        expect(error).toBeDefined();
        expect(error?.message).toContain("status");
    });

    it("should fail when genres is not an array", () => {
        const { error } = schema.validate({ title: "Test Novel", genres: "Action" });

        expect(error).toBeDefined();
        expect(error?.message).toContain("genres");
    });

    it("should fail when themes is not an array", () => {
        const { error } = schema.validate({ title: "Test Novel", themes: "Isekai" });

        expect(error).toBeDefined();
        expect(error?.message).toContain("themes");
    });

    it("should default status to Unread when not provided", () => {
        const { value } = schema.validate({ title: "Test Novel" });

        expect(value.status).toBe("Unread");
    });

    it("should allow empty genres array", () => {
        const { error } = schema.validate({ title: "Test Novel", genres: [] });

        expect(error).toBeUndefined();
    });
});

// ─── getById ──────────────────────────────────────────────────────────────────

describe("novelSchemas.getById.params", () => {
    const schema = novelSchemas.getById.params;

    it("should pass with valid id", () => {
        const { error } = schema.validate({ id: "1" });

        expect(error).toBeUndefined();
    });

    it("should fail when id is missing", () => {
        const { error } = schema.validate({});

        expect(error).toBeDefined();
        expect(error?.message).toContain("Novel ID is required");
    });

    it("should fail when id is empty string", () => {
        const { error } = schema.validate({ id: "" });

        expect(error).toBeDefined();
        expect(error?.message).toContain("Novel ID cannot be empty");
    });
});

// ─── update ───────────────────────────────────────────────────────────────────

describe("novelSchemas.update", () => {
    const paramsSchema = novelSchemas.update.params;
    const bodySchema = novelSchemas.update.body;

    it("should pass params with valid id", () => {
        const { error } = paramsSchema.validate({ id: "1" });

        expect(error).toBeUndefined();
    });

    it("should fail params when id is missing", () => {
        const { error } = paramsSchema.validate({});

        expect(error).toBeDefined();
    });

    it("should pass body with partial fields", () => {
        const { error } = bodySchema.validate({ status: "Reading" });

        expect(error).toBeUndefined();
    });

    it("should pass body with all fields", () => {
        const { error } = bodySchema.validate({
            title: "Updated Title",
            genres: ["Drama"],
            themes: ["Loss"],
            status: "Read",
        });

        expect(error).toBeUndefined();
    });

    it("should fail body with invalid status", () => {
        const { error } = bodySchema.validate({ status: "Dropped" });

        expect(error).toBeDefined();
        expect(error?.message).toContain("status");
    });

    it("should fail body when title is empty string", () => {
        const { error } = bodySchema.validate({ title: "" });

        expect(error).toBeDefined();
        expect(error?.message).toContain("title");
    });
});

// ─── delete ───────────────────────────────────────────────────────────────────

describe("novelSchemas.delete.params", () => {
    const schema = novelSchemas.delete.params;

    it("should pass with valid id", () => {
        const { error } = schema.validate({ id: "1" });

        expect(error).toBeUndefined();
    });

    it("should fail when id is missing", () => {
        const { error } = schema.validate({});

        expect(error).toBeDefined();
        expect(error?.message).toContain("Novel ID is required");
    });
});

// ─── list ────────────────────────────────────────────────────────────────────

describe("novelSchemas.list.query", () => {
    const schema = novelSchemas.list.query;

    it("should pass with no filters", () => {
        const { error, value } = schema.validate({});

        expect(error).toBeUndefined();
        expect(value.page).toBe(1);
        expect(value.limit).toBe(10);
        expect(value.sortBy).toBe("updatedAt");
        expect(value.sortOrder).toBe("desc");
    });

    it("should pass with valid status filter", () => {
        const { error } = schema.validate({ status: "Reading" });

        expect(error).toBeUndefined();
    });

    it("should fail with invalid status filter", () => {
        const { error } = schema.validate({ status: "Dropped" });

        expect(error).toBeDefined();
        expect(error?.message).toContain("status");
    });

    it("should fail when page is less than 1", () => {
        const { error } = schema.validate({ page: 0 });

        expect(error).toBeDefined();
    });

    it("should fail when limit exceeds 100", () => {
        const { error } = schema.validate({ limit: 101 });

        expect(error).toBeDefined();
    });

    it("should fail with invalid sortBy field", () => {
        const { error } = schema.validate({ sortBy: "title_invalid" });

        expect(error).toBeDefined();
    });

    it("should pass with valid genre filter", () => {
        const { error } = schema.validate({ genre: "Fantasy" });

        expect(error).toBeUndefined();
    });
});