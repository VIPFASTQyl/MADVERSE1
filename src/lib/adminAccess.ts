export const ADMIN_EMAIL = "klestdrancolli@gmail.com";

export const isAdminEmail = (email?: string | null) =>
  email?.trim().toLowerCase() === ADMIN_EMAIL;
