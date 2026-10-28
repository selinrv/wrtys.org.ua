"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveRegistration } from "./actions";

const initialState = { errors: {}, message: "" };

const FIELD_CLASS =
    "mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#288987] focus:outline-none focus:ring-1 focus:ring-[#288987]";
const LABEL_CLASS = "block text-sm font-medium text-gray-700";

function Field({ label, htmlFor, error, hint, children }) {
    return (
        <div>
            <label htmlFor={htmlFor} className={LABEL_CLASS}>
                {label}
            </label>
            {children}
            {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
            {error && (
                <p aria-live="polite" className="mt-1 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

// Co-authors are stored as a JSON array in a longtext column. Editing that JSON
// by hand is how it got three different shapes in the first place, so the form
// edits rows and posts the canonical array in a hidden field.
function CoAuthorsEditor({ rows, onChange, error }) {
    const update = (index, field, value) =>
        onChange(rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));

    return (
        <fieldset>
            <legend className={LABEL_CLASS}>Co-authors</legend>

            <input type="hidden" name="co_authors" value={JSON.stringify(rows)} />

            <div className="mt-2 space-y-3">
                {rows.map((row, index) => (
                    <div
                        key={index}
                        className="grid gap-2 rounded-md border border-gray-200 p-3 sm:grid-cols-[1fr_1fr_12rem_auto]"
                    >
                        <input
                            aria-label={`Co-author ${index + 1} name`}
                            value={row.name}
                            onChange={(event) => update(index, "name", event.target.value)}
                            placeholder="Name"
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#288987] focus:outline-none focus:ring-1 focus:ring-[#288987]"
                        />
                        <input
                            aria-label={`Co-author ${index + 1} organization`}
                            value={row.organization}
                            onChange={(event) => update(index, "organization", event.target.value)}
                            placeholder="Organization"
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#288987] focus:outline-none focus:ring-1 focus:ring-[#288987]"
                        />
                        <input
                            aria-label={`Co-author ${index + 1} ORCID iD`}
                            value={row.orcidId}
                            onChange={(event) => update(index, "orcidId", event.target.value)}
                            placeholder="ORCID iD"
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#288987] focus:outline-none focus:ring-1 focus:ring-[#288987]"
                        />
                        <button
                            type="button"
                            onClick={() => onChange(rows.filter((_, i) => i !== index))}
                            className="justify-self-start rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={() => onChange([...rows, { name: "", organization: "", orcidId: "" }])}
                className="mt-3 rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-[#288987] hover:text-[#288987]"
            >
                Add co-author
            </button>

            <p className="mt-1 text-xs text-gray-400">
                Rows left without a name are dropped when you save.
            </p>
            {error && (
                <p aria-live="polite" className="mt-1 text-xs text-red-600">
                    {error}
                </p>
            )}
        </fieldset>
    );
}

export default function RegistrationForm({ registration, coAuthors, suggestions }) {
    const [state, formAction, pending] = useActionState(saveRegistration, initialState);

    // Controlled fields: React resets a form after its action runs, which would
    // otherwise wipe a long abstract the moment validation rejects something.
    const [values, setValues] = useState(() => ({
        author: registration?.author ?? "",
        email: registration?.email ?? "",
        institutions: registration?.institutions ?? "",
        orcidId: registration?.orcidId ?? "",
        abstract_title: registration?.abstract_title ?? "",
        abstract: registration?.abstract ?? "",
        topic: registration?.topic ?? "",
        type: registration?.type ?? "",
        reg_category: registration?.reg_category ?? "",
        paid: registration?.paid ? "1" : "0",
        invoiceUrl: registration?.invoiceUrl ?? "",
    }));
    const [rows, setRows] = useState(coAuthors ?? []);

    const bind = (field) => ({
        id: field,
        name: field,
        value: values[field],
        onChange: (event) =>
            setValues((current) => ({ ...current, [field]: event.target.value })),
        className: FIELD_CLASS,
    });

    const errors = state?.errors ?? {};

    return (
        <form action={formAction} className="mt-8 space-y-8">
            {registration && <input type="hidden" name="id" value={registration.id} />}

            {state?.message && (
                <p
                    aria-live="polite"
                    className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                    {state.message}
                </p>
            )}

            <section className="grid gap-5 sm:grid-cols-2">
                <Field label="Author *" htmlFor="author" error={errors.author}>
                    <input {...bind("author")} required autoComplete="off" />
                </Field>

                <Field label="Email *" htmlFor="email" error={errors.email}>
                    <input {...bind("email")} type="email" required autoComplete="off" />
                </Field>

                <Field
                    label="Institution"
                    htmlFor="institutions"
                    error={errors.institutions}
                    hint="The submitting author's affiliation."
                >
                    <textarea {...bind("institutions")} rows={2} />
                </Field>

                <Field label="ORCID iD" htmlFor="orcidId" error={errors.orcidId}>
                    <input {...bind("orcidId")} placeholder="0000-0000-0000-0000" />
                </Field>
            </section>

            <CoAuthorsEditor rows={rows} onChange={setRows} error={errors.co_authors} />

            <section className="space-y-5">
                <Field
                    label="Abstract title"
                    htmlFor="abstract_title"
                    error={errors.abstract_title}
                    hint="Leave empty for an attendee with no abstract — the public pages skip those rows."
                >
                    <textarea {...bind("abstract_title")} rows={2} />
                </Field>

                <Field label="Abstract" htmlFor="abstract" error={errors.abstract}>
                    <textarea {...bind("abstract")} rows={14} className={`${FIELD_CLASS} leading-relaxed`} />
                </Field>
            </section>

            <section className="grid gap-5 sm:grid-cols-2">
                <Field label="Topic" htmlFor="topic" error={errors.topic}>
                    <input {...bind("topic")} list="topic-options" />
                    <datalist id="topic-options">
                        {suggestions.topics.map((topic) => (
                            <option key={topic} value={topic} />
                        ))}
                    </datalist>
                </Field>

                <Field label="Presentation type" htmlFor="type" error={errors.type}>
                    <input {...bind("type")} list="type-options" />
                    <datalist id="type-options">
                        {suggestions.types.map((type) => (
                            <option key={type} value={type} />
                        ))}
                    </datalist>
                </Field>

                <Field
                    label="Registration category"
                    htmlFor="reg_category"
                    error={errors.reg_category}
                >
                    <input {...bind("reg_category")} list="category-options" />
                    <datalist id="category-options">
                        {suggestions.categories.map((category) => (
                            <option key={category} value={category} />
                        ))}
                    </datalist>
                </Field>

                <Field label="Payment" htmlFor="paid" error={errors.paid}>
                    <select {...bind("paid")}>
                        <option value="0">Unpaid</option>
                        <option value="1">Paid</option>
                    </select>
                </Field>

                {/* Read-only here, but the save action writes every column, so the
                    stored value has to travel with the form or saving clears it.
                    A new registration has no invoice yet. */}
                <div>
                    <p className={LABEL_CLASS}>Invoice</p>
                    <input type="hidden" name="invoiceUrl" value={values.invoiceUrl} />
                    {registration?.invoiceUrl ? (
                        <Link className="mt-1.5 inline-block rounded-md bg-[#288987] px-5 py-2 text-sm font-medium text-white hover:bg-[#1f6f6d]" href={`https://wrt2026.com.ua/invoices/invoice-${registration.invoiceUrl}.pdf`}>Download</Link>
                    ) : (
                        <p className="mt-1.5 text-sm text-gray-400">No invoice.</p>
                    )}
                </div>

            </section>

            <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-md bg-[#288987] px-5 py-2 text-sm font-medium text-white hover:bg-[#1f6f6d] disabled:opacity-60"
                >
                    {pending ? "Saving…" : registration ? "Save changes" : "Create registration"}
                </button>
                <Link
                    href="/admin"
                    className="text-sm text-gray-500 underline-offset-4 hover:underline"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}
