export interface JwtPayload {
  userId: string;
  role: "admin" | "student" | "instructor";
  iat?: number;
  exp?: number;
}
