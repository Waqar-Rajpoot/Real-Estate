// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function proxy(request: NextRequest) {
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   const url = request.nextUrl;
//   const { pathname } = url;

//   if (
//     token &&
//     (pathname.startsWith("/sign-in") ||
//       pathname.startsWith("/sign-up") ||
//       pathname.startsWith("/verify"))
//   ) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // 2. PROTECT USER DASHBOARD (General authenticated routes)
//   if (!token && pathname.startsWith("/user-dashboard")) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   // 3. AGENT/AGENCY PROTECTION (Specific Real Estate roles)
//   if (pathname.startsWith("/agent-portal") || pathname.startsWith("/agency-portal")) {
//     const isAuthorized = token?.role === "Agent" || token?.role === "Agency" || token?.role === "Admin";
//     if (!token || !isAuthorized) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   // 4. ADMIN AUTHORIZATION
//   if (pathname.startsWith("/admin")) {
//     if (!token || token.role !== "Admin") {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/user-dashboard/:path*",
//     "/agent-portal/:path*",
//     "/agency-portal/:path*",
//     "/sign-in",
//     "/sign-up",
//     "/verify/:path*",
//   ],
// };







import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = request.nextUrl;
  const { pathname } = url;

  // 1. AUTH REDIRECTS
  // Redirect logged-in users away from auth pages (sign-in, sign-up, verify)
  if (
    token &&
    (pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. AGENCY FOLDER PROTECTION & REGISTRATION FLOW
  if (pathname.startsWith("/agency")) {
    // If not logged in at all, redirect to sign-in
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Only allow "Agency" role (or Admin) to access this folder
    if (token.role !== "Agency" && token.role !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const hasAgencyProfile = !!token.agencyProfile;

    // A. Logic for the registration page
    if (pathname === "/agency/agency-register") {
      if (hasAgencyProfile) {
        // Already registered? Skip registration and go to dashboard
        return NextResponse.redirect(new URL("/agency/agents", request.url));
      }
      // If no profile yet, let them stay on the registration page
      return NextResponse.next();
    }

    // B. Logic for all other agency pages (agents, add-agent, profile, etc.)
    if (!hasAgencyProfile) {
      // Trying to access internal agency pages without a profile? Force registration.
      return NextResponse.redirect(new URL("/agency/agency-register", request.url));
    }
  }

  // 3. USER DASHBOARD PROTECTION
  if (!token && pathname.startsWith("/user-dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 4. AGENT PORTAL PROTECTION
  if (pathname.startsWith("/agent-portal")) {
    const isAuthorized = token?.role === "Agent" || token?.role === "Admin";
    if (!token || !isAuthorized) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 5. ADMIN AUTHORIZATION
  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user-dashboard/:path*",
    "/agent-portal/:path*",
    "/agency/:path*",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
  ],
};