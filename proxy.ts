import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!profile) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Student protection
    if (
      pathname.startsWith("/dashboard/student") &&
      profile.role !== "student"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Faculty protection
    if (
      pathname.startsWith("/dashboard/faculty") &&
      profile.role !== "faculty"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
