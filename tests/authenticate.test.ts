import { Request, Response, NextFunction } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { auth } from "../config/firebaseConfig";

jest.mock("../config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));

jest.mock("../src/api/v1/errors/errors", () => ({
    AuthenticationError: class AuthenticationError extends Error {
        code: string;
        constructor(message: string, code: string) {
            super(message);
            this.code = code;
            this.name = "AuthenticationError";
        }
    },
}));

const mockRequest = (headers: Record<string, string> = {}): Request =>
    ({ headers } as unknown as Request);

const mockResponse = (): Response => {
    const res: any = {};
    res.locals = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

const mockNext: NextFunction = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

// ─── authenticate ─────────────────────────────────────────────────────────────

describe("authenticate middleware", () => {
    it("should call next() and set uid and role on res.locals when token is valid", async () => {
        (auth.verifyIdToken as jest.Mock).mockResolvedValue({
            uid: "user123",
            role: "admin",
        });

        const req = mockRequest({ authorization: "Bearer valid-token" });
        const res = mockResponse();

        await authenticate(req, res, mockNext);

        expect(auth.verifyIdToken).toHaveBeenCalledWith("valid-token");
        expect(res.locals.uid).toBe("user123");
        expect(res.locals.role).toBe("admin");
        expect(mockNext).toHaveBeenCalledWith();
    });

    it("should call next() with AuthenticationError when no token is provided", async () => {
        const req = mockRequest({});
        const res = mockResponse();

        await authenticate(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: "Unauthorized: No token provided",
            code: "TOKEN_NOT_FOUND",
        }));
    });

    it("should call next() with AuthenticationError when Authorization header is missing Bearer prefix", async () => {
        const req = mockRequest({ authorization: "invalid-token" });
        const res = mockResponse();

        await authenticate(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: "Unauthorized: No token provided",
            code: "TOKEN_NOT_FOUND",
        }));
    });

    it("should call next() with AuthenticationError when token is invalid", async () => {
        (auth.verifyIdToken as jest.Mock).mockRejectedValue(new Error("Firebase error"));

        const req = mockRequest({ authorization: "Bearer invalid-token" });
        const res = mockResponse();

        await authenticate(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: "Unauthorized: Invalid token",
            code: "TOKEN_INVALID",
        }));
    });

    it("should re-throw AuthenticationError if already an AuthenticationError", async () => {
        const { AuthenticationError } = require("../src/api/v1/errors/errors");
        (auth.verifyIdToken as jest.Mock).mockRejectedValue(
            new AuthenticationError("Unauthorized: No token provided", "TOKEN_NOT_FOUND")
        );

        const req = mockRequest({ authorization: "Bearer some-token" });
        const res = mockResponse();

        await authenticate(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            code: "TOKEN_NOT_FOUND",
        }));
    });

    it("should set role as undefined when token has no role claim", async () => {
        (auth.verifyIdToken as jest.Mock).mockResolvedValue({
            uid: "user123",
        });

        const req = mockRequest({ authorization: "Bearer valid-token" });
        const res = mockResponse();

        await authenticate(req, res, mockNext);

        expect(res.locals.uid).toBe("user123");
        expect(res.locals.role).toBeUndefined();
        expect(mockNext).toHaveBeenCalledWith();
    });
});