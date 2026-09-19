// Turns a submitted form into the exact shape the Registration columns expect,
// and reports what a human needs to fix. Shared by the create and the edit
// action so both agree on the rules.

// varchar(191) columns: MySQL would truncate (or error in strict mode) rather
// than tell the editor, so the limit is enforced here.
const SHORT_TEXT_LIMIT = 191;
const SHORT_TEXT_FIELDS = ["author", "email", "type", "reg_category", "topic", "orcidId"];

const LABELS = {
    author: "Author",
    email: "Email",
    type: "Presentation type",
    reg_category: "Registration category",
    topic: "Topic",
    orcidId: "ORCID iD",
    co_authors: "Co-authors",
};

function text(formData, field) {
    const value = formData.get(field);
    return typeof value === "string" ? value.trim() : "";
}

// The co-authors editor posts a JSON array of {name, organization, orcidId},
// which is the shape parseCoAuthors() in lib/abstracts.js reads back. Rows
// without a name are dropped so the column never grows empty entries.
function readCoAuthors(formData) {
    const raw = formData.get("co_authors");
    if (typeof raw !== "string" || !raw.trim()) return { value: "[]" };

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return { value: "[]", error: "Co-authors could not be read. Try again." };
    }
    if (!Array.isArray(parsed)) {
        return { value: "[]", error: "Co-authors could not be read. Try again." };
    }

    const cleaned = parsed
        .map((entry) => ({
            name: String(entry?.name ?? "").trim(),
            organization: String(entry?.organization ?? "").trim(),
            orcidId: String(entry?.orcidId ?? "").trim(),
        }))
        .filter((entry) => entry.name);

    return { value: JSON.stringify(cleaned) };
}

export function readRegistrationForm(formData) {
    const coAuthors = readCoAuthors(formData);

    return {
        values: {
            author: text(formData, "author"),
            email: text(formData, "email"),
            co_authors: coAuthors.value,
            abstract_title: text(formData, "abstract_title"),
            abstract: text(formData, "abstract"),
            institutions: text(formData, "institutions"),
            type: text(formData, "type"),
            reg_category: text(formData, "reg_category"),
            topic: text(formData, "topic"),
            paid: text(formData, "paid") === "1" ? 1 : 0,
            // Nullable column: an empty box means "no invoice", not "".
            invoiceUrl: text(formData, "invoiceUrl") || null,
            orcidId: text(formData, "orcidId"),
        },
        coAuthorsError: coAuthors.error,
    };
}

export function validateRegistration(values, { coAuthorsError } = {}) {
    const errors = {};

    if (!values.author) errors.author = "An author name is required.";

    if (!values.email) {
        errors.email = "An email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "That does not look like an email address.";
    }

    for (const field of SHORT_TEXT_FIELDS) {
        if (values[field].length > SHORT_TEXT_LIMIT) {
            errors[field] = `${LABELS[field]} is limited to ${SHORT_TEXT_LIMIT} characters.`;
        }
    }

    if (coAuthorsError) errors.co_authors = coAuthorsError;

    return errors;
}
