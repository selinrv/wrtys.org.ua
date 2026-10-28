import Link from "next/link";
import { notFound } from "next/navigation";
import { getFieldSuggestions, getRegistration } from "@/app/lib/admin/registrations";
import { parseCoAuthors } from "@/app/lib/abstracts";
import RegistrationForm from "../RegistrationForm";
import DeleteRegistration from "../DeleteRegistration";

export const metadata = {
    title: "Edit registration — WRT2026 admin",
    robots: { index: false, follow: false },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
});

export default async function EditRegistrationPage({ params, searchParams }) {
    // params and searchParams are Promises in Next 16 and have to be awaited.
    const [{ id }, query] = await Promise.all([params, searchParams]);

    const [registration, suggestions] = await Promise.all([
        getRegistration(id),
        getFieldSuggestions(),
    ]);

    if (!registration) notFound();

    // The same reader the public pages use, so the editor shows exactly what
    // /events/wrt2026 will render — including the legacy comma-separated rows.
    const coAuthors = parseCoAuthors(registration.co_authors);
    const isPublished = Boolean(registration.abstract_title?.trim());

    return (
        <div className="max-w-4xl">
            <Link
                href="/admin"
                className="text-sm text-[#288987] underline-offset-4 hover:underline"
            >
                &larr; All registrations
            </Link>

            <header className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-[#0b3d3e]">
                    {registration.author || `Registration ${registration.id}`}
                </h1>
                <p className="text-sm text-gray-400">
                    #{registration.id} · submitted {dateFormat.format(registration.createdAt)}
                </p>
            </header>

            {isPublished && (
                <p className="mt-2 text-sm text-gray-500">
                    Public page:{" "}
                    <Link
                        href={`/events/wrt2026/abstracts/${registration.id}`}
                        className="text-[#288987] underline-offset-4 hover:underline"
                    >
                        /events/wrt2026/abstracts/{registration.id}
                    </Link>
                </p>
            )}

            {query.saved && (
                <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    Saved. The public pages were refreshed.
                </p>
            )}

            <RegistrationForm
                registration={registration}
                coAuthors={coAuthors}
                suggestions={suggestions}
            />

            <section className="mt-12 border-t border-gray-200 pt-8">
                <h2 className="text-sm font-semibold text-gray-700">Danger zone</h2>
                <div className="mt-3">
                    <DeleteRegistration
                        id={registration.id}
                        label={registration.author || `registration ${registration.id}`}
                    />
                </div>
            </section>
        </div>
    );
}
