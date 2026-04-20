import { Request, Response, NextFunction } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";

jest.mock("../config/firebaseConfig", () => ({
    AuthorizationError: class AuthorizationError extends Error {
        code: string;
        constructor(message: string, code: string) {
            super(message);
            this.code = code;
            this.name = "AuthorizationError";
        }
    },
}));

const mockRequest = (params: Record<string, string> = {}): Request =>
    ({ params } as unknown as Request);

const mockResponse = (locals: Record<string, any> = {}): Response => {
    const res: any = {};
    res.locals = locals;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

const mockNext: NextFunction = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

// ─── isAuthorized ─────────────────────────────────────────────────────────────

describe("isAuthorized middleware", () => {

    // ─── Role checks ──────────────────────────────────────────────────────────

    it("should call next() when user has required role (admin)", () => {
        const middleware = isAuthorized({ hasRole: ["admin", "manager"] });
        const req = mockRequest();
        const res = mockResponse({ uid: "user123", role: "admin" });

        middleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
    });

    it("should call next() when user has required role (manager)", () => {
        const middleware = isAuthorized({ hasRole: ["admin", "manager"] });
        const req = mockRequest();
        const res = mockResponse({ uid: "user123", role: "manager" });

        middleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
    });

    it("should call next() with AuthorizationError when user role is not in allowed roles", () => {
        const middleware = isAuthorized({ hasRole: ["admin"] });
        const req = mockRequest();
        const res = mockResponse({ uid: "user123", role: "manager" });

        middleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: "Forbidden: Insufficient role",
            code: "INSUFFICIENT_ROLE",
        }));
    });

    it("should call next() with AuthorizationError when user has no role", () => {
        const middleware = isAuthorized({ hasRole: ["admin", "manager"] });
        const req = mockRequest();
        const res = mockResponse({ uid: "user123" });

        middleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: "Forbidden: No role found",
            code: "ROLE_NOT_FOUND",
        }));
    });

    it("should call next() with AuthorizationError when role is null", () => {
        const middleware = isAuthorized({ hasRole: ["admin", "manager"] });
        const req = mockRequest();
        const res = mockResponse({ uid: "user123", role: null });

        middleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            code: "ROLE_NOT_FOUND",
        }));
    });

    // ─── allowSameUser checks ─────────────────────────────────────────────────

    it("should call next() when allowSameUser is true and uid matches params.id", () => {
        const middleware = isAuthorized({ hasRole: ["admin"], allowSameUser: true });
        const req = mockRequest({ id: "user123" });
        const res = mockResponse({ uid: "user123", role: undefined });

        middleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
    });

    it("should deny access when allowSameUser is true but uid does not match params.id", () => {
        const middleware = isAuthorized({ hasRole: ["admin"], allowSameUser: true });
        const req = mockRequest({ id: "other-user" });
        const res = mockResponse({ uid: "user123", role: undefined });

        middleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            code: "ROLE_NOT_FOUND",
        }));
    });

    it("should not apply allowSameUser when no id param is present", () => {
        const middleware = isAuthorized({ hasRole: ["admin"], allowSameUser: true });
        const req = mockRequest({});
        const res = mockResponse({ uid: "user123", role: undefined });

        middleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            code: "ROLE_NOT_FOUND",
        }));
    });

    // ─── allowSameUser + role fallback ────────────────────────────────────────

    it("should allow access via role even when allowSameUser is true but uid does not match", () => {
        const middleware = isAuthorized({ hasRole: ["admin"], allowSameUser: true });
        const req = mockRequest({ id: "other-user" });
        const res = mockResponse({ uid: "user123", role: "admin" });

        middleware(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
    });
});