import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const pathname = req.nextUrl.pathname;
    const role = payload.role as string;

    const accessRules: Record<string, string[]> = {
      "/admin": ["admin", "super-admin"],
      "/user": ["user"],
      "/super-admin": ["super-admin"],
    };

    const matchedPath = Object.keys(accessRules).find((prefix) =>
      pathname.startsWith(prefix)
    );

    if (matchedPath && !accessRules[matchedPath].includes(role)) {
      return NextResponse.redirect(new URL("/404", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
