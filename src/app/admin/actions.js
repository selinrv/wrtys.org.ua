"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { endSession, requireSession, startSession } from "@/app/lib/admin/session";
import { isAdminPasswordConfigured, verifyAdminPassword } from "@/app/lib/admin/token";
import {
    createRegistration,
    deleteRegistration,
    updateRegistration,
} from "@/app/lib/admin/registrations";
import {
    readRegistrationForm,
    validateRegistration,
} from "@/app/lib/admin/registration-form";

// A single shared password is one guessable secret on a public URL, so failed
// attempts are counted per client address. pm2 runs one instance of this app
// (see ecosystem.config.js), so module state is the whole picture; behind
// several instances this would need to move into the database.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 10;
const failures = new Map();

async function clientAddress() {
    const requestHeaders = await headers();
    const forwarded = requestHeaders.get("x-forwarded-for") ?? "";
    return forwarded.split(",")[0].trim() || requestHeaders.get("x-real-ip") || "unknown";
}

function isLockedOut(address) {
    const record = failures.get(address);
    if (!record) return false;
    if (Date.now() - record.firstAt > LOGIN_WINDOW_MS) {
        failures.delete(address);
        return false;
    }
    return record.count >= LOGIN_MAX_FAILURES;
}

function recordFailure(address) {
    const now = Date.now();
    const record = failures.get(address);
    if (!record || now - record.firstAt > LOGIN_WINDOW_MS) {
        failures.set(address, { count: 1, firstAt: now });
        return;
    }
    record.count += 1;
}

// Only same-site admin paths, so a crafted ?next= cannot bounce someone off to
// another host after they sign in.
function safeNext(value) {
    const target = typeof value === "string" ? value : "";
    return target.startsWith("/admin") && !target.startsWith("//") ? target : "/admin";
}

export async function login(prevState, formData) {
    if (!isAdminPasswordConfigured()) {
        return { error: "ADMIN_PASSWORD is not set on this server, so nobody can sign in." };
    }

    const address = await clientAddress();
    if (isLockedOut(address)) {
        return { error: "Too many failed attempts. Try again in fifteen minutes." };
    }

    if (!verifyAdminPassword(String(formData.get("password") ?? ""))) {
        recordFailure(address);
        // Blunts online guessing; unnoticeable on a real sign-in.
        await new Promise((resolve) => setTimeout(resolve, 400));
        return { error: "Wrong password." };
    }

    failures.delete(address);
    await startSession();
    redirect(safeNext(formData.get("next")));
}

export async function logout() {
    await endSession();
    redirect("/admin/login");
}

// The public pages are ISR (revalidate = 60 in events/wrt2026/page.js), so an
// edit would otherwise take up to a minute to show. Drop every cache on each
// write: a changed topic moves the abstract between two session pages.
function revalidatePublicPages(id) {
    revalidatePath("/events/wrt2026");
    revalidatePath("/events/wrt2026/sessions/[slug]", "page");
    if (id) revalidatePath(`/events/wrt2026/abstracts/${id}`);
}

export async function saveRegistration(prevState, formData) {
    await requireSession();

    const id = formData.get("id");
    const { values, coAuthorsError } = readRegistrationForm(formData);
    const errors = validateRegistration(values, { coAuthorsError });

    if (Object.keys(errors).length > 0) {
        return { errors, message: "Nothing was saved — check the fields marked below." };
    }

    let savedId;
    if (id) {
        const updated = await updateRegistration(id, values);
        if (!updated) return { errors: {}, message: "That registration no longer exists." };
        savedId = String(id);
    } else {
        savedId = String(await createRegistration(values));
    }

    revalidatePublicPages(savedId);
    // redirect() throws to unwind, so it stays outside any try/catch.
    redirect(`/admin/${savedId}?saved=1`);
}

export async function removeRegistration(formData) {
    await requireSession();

    const id = formData.get("id");
    const deleted = await deleteRegistration(id);
    revalidatePublicPages(deleted ? id : null);

    redirect(deleted ? "/admin?deleted=1" : "/admin");
}
