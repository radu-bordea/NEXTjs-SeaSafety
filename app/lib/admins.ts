export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();

  const admins = process.env.ADMIN_EMAILS?.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);

  return admins?.includes(normalizedEmail) ?? false;
}
