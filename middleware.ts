import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "./app/lib/auth"; // adjust path if needed

// Routes that require login
const protectedRoutes = ["/tutorials", "/materials"];
// Routes only Radu can access
const raduOnlyRoutes = ["/tutorials/new"];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Get token from cookie
  const token = req.cookies.get("auth-token")?.value;

  // If no token → redirect to login on protected routes
  if (!token) {
    if (
      protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) ||
      raduOnlyRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
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
    // If invalid token → redirect to login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Protect Radu-only routes
  if (
    raduOnlyRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) &&
    (user.name?.toLowerCase() !== "radu" || user.email?.toLowerCase() !== "radu@gmail.com")
  ) {
    // Redirect non-Radu users to tutorials
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
