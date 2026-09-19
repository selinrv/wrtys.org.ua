import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/app/lib/admin/token";

// Next 16 renamed middleware.js to proxy.js; the behaviour is unchanged.
//
// This is an optimistic check: it keeps signed-out visitors off the admin
// screens without a database round trip. The real authorization lives in
// requireSession(), which every admin page and Server Action calls.
export function proxy(request) {
    const { pathname, search } = request.nextUrl;
    const isLoginRoute = pathname === "/admin/login";
    const signedIn = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

    if (!signedIn && !isLoginRoute) {
        const url = new URL("/admin/login", request.url);
        // Send them back where they were headed once they are through.
        if (pathname !== "/admin") url.searchParams.set("next", `${pathname}${search}`);
        return NextResponse.redirect(url);
    }

    if (signedIn && isLoginRoute) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/admin/:path*",
};
