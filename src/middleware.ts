import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isLoginPage = pathname === "/super-admin/login";

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      // ✅ Prevent logged-in user from accessing login page
      if (isLoginPage && role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/super-admin/dashboard", req.url));
      }

      // ✅ Access control
      const accessRules: Record<string, string[]> = {
        "/admin": ["ADMIN", "SUPER_ADMIN"],
        "/user": ["USER"],
        "/super-admin": ["SUPER_ADMIN"],
      };

      const matchedPath = Object.keys(accessRules).find((prefix) =>
        pathname.startsWith(prefix)
      );

      if (matchedPath && !accessRules[matchedPath].includes(role)) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

    } catch (err) {
      console.error("Invalid token:", err);
      // Invalid token, clear cookie and redirect to login
      const res = NextResponse.redirect(new URL("/super-admin/login", req.url));
      res.cookies.set("token", "", { maxAge: 0 });
      return res;
    }
  } else {
    // No token and trying to access protected route (but not login page)
    const protectedPaths = ["/dashboard", "/admin", "/user", "/super-admin"];
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected && !isLoginPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// ✅ Don't run middleware on login page
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/user/:path*",
    "/super-admin/:path*",
  ],
};
