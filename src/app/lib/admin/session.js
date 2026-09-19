import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    SESSION_COOKIE,
    SESSION_MAX_AGE,
    createSessionToken,
    verifySessionToken,
} from "./token";

export const isAuthenticated = cache(async () => {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    return verifySessionToken(token);
});

export async function startSession() {
    const token = createSessionToken();
    if (token === null) return false;

    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE,
    });
    return true;
}

export async function endSession() {
    (await cookies()).delete(SESSION_COOKIE);
}

// The gate every admin page and Server Action goes through. Server Actions are
// reachable by direct POST, not only through the UI, so the cookie check in
// proxy.js is a first filter and never the authorization itself.
export async function requireSession() {
    if (!(await isAuthenticated())) redirect("/admin/login");
}
