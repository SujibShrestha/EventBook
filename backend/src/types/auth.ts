export type AuthRole = "USER" | "ADMIN";

export type AuthUser = {
  id: string;
  role: AuthRole;
};
