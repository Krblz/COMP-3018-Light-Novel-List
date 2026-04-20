export interface AuthorizationOptions {
    hasRole: Array<"admin" | "manager">;
    allowSameUser?: boolean;
}