"use client";

import { useActionState } from "react";
import { login } from "../actions";

const initialState = { error: "" };

export default function LoginForm({ next }) {
    const [state, formAction, pending] = useActionState(login, initialState);

    return (
        <div className="mx-auto max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight text-[#0b3d3e]">
                WRT2026 admin
            </h1>
            <p className="mt-2 text-sm text-gray-500">
                Enter the admin password to edit registrations.
            </p>

            <form action={formAction} className="mt-8 space-y-4">
                <input type="hidden" name="next" value={next} />

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        autoFocus
                        required
                        className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#288987] focus:outline-none focus:ring-1 focus:ring-[#288987]"
                    />
                </div>

                {state?.error && (
                    <p
                        aria-live="polite"
                        className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
                    >
                        {state.error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-md bg-[#288987] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f6f6d] disabled:opacity-60"
                >
                    {pending ? "Signing in…" : "Sign in"}
                </button>
            </form>
        </div>
    );
}
