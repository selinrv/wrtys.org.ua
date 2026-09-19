import Link from "next/link";
import { getFieldSuggestions, listRegistrations } from "@/app/lib/admin/registrations";
import { logout } from "./actions";

export const metadata = {
    title: "Registrations — WRT2026 admin",
    robots: { index: false, follow: false },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

export default async function AdminRegistrationsPage({ searchParams }) {
    const params = await searchParams;
    const filters = {
        q: params.q ?? "",
        topic: params.topic ?? "",
        type: params.type ?? "",
        paid: params.paid ?? "",
    };

    // Both calls check the session; listRegistrations is the one that would
    // reject an unauthenticated request.
    const [registrations, suggestions] = await Promise.all([
        listRegistrations(filters),
        getFieldSuggestions(),
    ]);

    const isFiltered = Object.values(filters).some(Boolean);
    const fieldClass =
        "rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#288987] focus:outline-none focus:ring-1 focus:ring-[#288987]";

    return (
        <div>
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-[#0b3d3e]">
                        Registrations
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {registrations.length}
                        {isFiltered ? " matching" : ""} row
                        {registrations.length === 1 ? "" : "s"}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/new"
                        className="rounded-md bg-[#288987] px-4 py-2 text-sm font-medium text-white hover:bg-[#1f6f6d]"
                    >
                        New registration
                    </Link>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Sign out
                        </button>
                    </form>
                </div>
            </header>

            {params.deleted && (
                <p className="mt-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    Registration deleted.
                </p>
            )}

            {/* A plain GET form: the filters live in the URL, so a filtered list
                can be bookmarked and shared, and it works without JavaScript. */}
            <form method="get" className="mt-8 flex flex-wrap items-end gap-3">
                <div className="grow sm:grow-0">
                    <label htmlFor="q" className="block text-xs font-medium text-gray-500">
                        Search
                    </label>
                    <input
                        id="q"
                        name="q"
                        type="search"
                        defaultValue={filters.q}
                        placeholder="Author, email, title, institution"
                        className={`mt-1 w-full sm:w-72 ${fieldClass}`}
                    />
                </div>

                <div>
                    <label htmlFor="topic" className="block text-xs font-medium text-gray-500">
                        Topic
                    </label>
                    <select
                        id="topic"
                        name="topic"
                        defaultValue={filters.topic}
                        className={`mt-1 max-w-56 ${fieldClass}`}
                    >
                        <option value="">All topics</option>
                        {suggestions.topics.map((topic) => (
                            <option key={topic} value={topic}>
                                {topic}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="type" className="block text-xs font-medium text-gray-500">
                        Type
                    </label>
                    <select
                        id="type"
                        name="type"
                        defaultValue={filters.type}
                        className={`mt-1 ${fieldClass}`}
                    >
                        <option value="">All types</option>
                        {suggestions.types.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="paid" className="block text-xs font-medium text-gray-500">
                        Payment
                    </label>
                    <select
                        id="paid"
                        name="paid"
                        defaultValue={filters.paid}
                        className={`mt-1 ${fieldClass}`}
                    >
                        <option value="">Any</option>
                        <option value="1">Paid</option>
                        <option value="0">Unpaid</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="rounded-md border border-[#288987] px-4 py-2 text-sm font-medium text-[#288987] hover:bg-[#288987]/5"
                >
                    Apply
                </button>

                {isFiltered && (
                    <Link
                        href="/admin"
                        className="px-2 py-2 text-sm text-gray-500 underline-offset-4 hover:underline"
                    >
                        Clear
                    </Link>
                )}
            </form>

            <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[56rem] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">ID</th>
                            <th className="px-4 py-3 font-medium">Author</th>
                            <th className="px-4 py-3 font-medium">Abstract title</th>
                            <th className="px-4 py-3 font-medium">Topic</th>
                            <th className="px-4 py-3 font-medium">Type</th>
                            <th className="px-4 py-3 font-medium">Cat.</th>
                            <th className="px-4 py-3 font-medium">Paid</th>
                            <th className="px-4 py-3 font-medium">Submitted</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {registrations.map((registration) => (
                            <tr key={registration.id} className="hover:bg-[#288987]/5">
                                <td className="px-4 py-3 tabular-nums text-gray-400">
                                    {registration.id}
                                </td>
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/admin/${registration.id}`}
                                        className="font-medium text-[#288987] underline-offset-4 hover:underline"
                                    >
                                        {registration.author || "—"}
                                    </Link>
                                    <span className="block text-xs text-gray-400">
                                        {registration.email}
                                    </span>
                                </td>
                                <td className="max-w-md px-4 py-3 text-gray-700">
                                    {registration.abstract_title?.trim() || (
                                        <span className="text-gray-400">No abstract</span>
                                    )}
                                </td>
                                <td className="max-w-48 px-4 py-3 text-gray-500">
                                    {registration.topic?.trim() || "—"}
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {registration.type?.trim() || "—"}
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {registration.reg_category?.trim() || "—"}
                                </td>
                                <td className="px-4 py-3">
                                    {registration.paid ? (
                                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                            Paid
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">No</span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                                    {dateFormat.format(registration.createdAt)}
                                </td>
                            </tr>
                        ))}

                        {registrations.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                                    Nothing matches those filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
