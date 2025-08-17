import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "./app/lib/auth"; // adjust path if needed
import { isAdmin } from "./app/lib/admins"; // make sure this points to the helper

// Routes that require any logged-in user
const protectedRoutes = ["/tutorials", "/materials"];

// Routes only admins can access
const adminOnlyRoutes = ["/tutorials/new"];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Get token from cookie
  const token = req.cookies.get("auth-token")?.value;

  // If no token → redirect to login on protected/admin routes
  if (!token) {
    if (
      protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) ||
      adminOnlyRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
    ) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Verify JWT
  let user;
  try {
    user = await verifyAuthToken<{
      userId: string;
      name: string;
      email: string;
    }>(token);
  } catch {
    // Invalid token → redirect to login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Protect admin-only routes
  if (
    adminOnlyRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) &&
    !isAdmin(user.email)
  ) {
    // Redirect non-admins to tutorials
    url.pathname = "/tutorials";
    return NextResponse.redirect(url);
  }

  // ✅ All good → allow access
  return NextResponse.next();
}

// Apply middleware only to these paths
export const config = {
  matcher: ["/tutorials/:path*", "/materials/:path*"],
};
