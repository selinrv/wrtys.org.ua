import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// One shared password (ADMIN_PASSWORD) guards the admin area. The session
// cookie is signed with a key derived from that password, so changing the
// password in .env.local invalidates every outstanding session for free.
//
// No "server-only" import here on purpose: proxy.js needs these helpers too,
// and it runs outside the React server module graph.

export const SESSION_COOKIE = "wrtys_admin";
export const SESSION_MAX_AGE = 60 * 60 * 8; // seconds

function adminPassword() {
    const value = process.env.ADMIN_PASSWORD ?? "";
    return value.length > 0 ? value : null;
}

// Both sides are hashed before comparison so timingSafeEqual always sees two
// equal-length buffers, whatever was submitted.
function digest(value) {
    return createHash("sha256").update(String(value), "utf8").digest();
}

export function isAdminPasswordConfigured() {
    return adminPassword() !== null;
}

export function verifyAdminPassword(candidate) {
    const password = adminPassword();
    // Fail closed: with no password configured nobody gets in, rather than
    // everybody.
    if (password === null || typeof candidate !== "string") return false;
    return timingSafeEqual(digest(candidate), digest(password));
}

function signingKey(password) {
    return createHash("sha256")
        .update(`wrtys-admin-session-v1:${password}`, "utf8")
        .digest();
}

function sign(payload, password) {
    return createHmac("sha256", signingKey(password))
        .update(payload, "utf8")
        .digest("base64url");
}

export function createSessionToken(now = Date.now()) {
    const password = adminPassword();
    if (password === null) return null;

    const expiresAt = now + SESSION_MAX_AGE * 1000;
    return `${expiresAt}.${sign(String(expiresAt), password)}`;
}

export function verifySessionToken(token, now = Date.now()) {
    const password = adminPassword();
    if (password === null || typeof token !== "string") return false;

    const separator = token.indexOf(".");
    if (separator < 1) return false;

    const expiresAt = Number(token.slice(0, separator));
    const signature = token.slice(separator + 1);
    if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false;

    const expected = sign(String(expiresAt), password);
    if (expected.length !== signature.length) return false;
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
