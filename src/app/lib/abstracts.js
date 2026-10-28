import { cache } from "react";
import { db } from "./db";
import { BOOK_ORDER } from "./abstracts-book";

// co_authors is a longtext column holding three historical formats: a JSON array
// of {name, organization, orcidId} objects (84 rows), "[]" (25), and a plain
// comma/semicolon-separated string (24). Normalize all of them to one array shape
// so the view only ever sees an array.
export function parseCoAuthors(value) {
    if (typeof value !== "string") return [];
    const raw = value.trim();
    if (!raw) return [];

    if (raw.startsWith("[")) {
        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed
                .map((entry) =>
                    typeof entry === "string"
                        ? { name: entry.trim(), organization: "", orcidId: "" }
                        : {
                              name: String(entry?.name ?? "").trim(),
                              organization: String(entry?.organization ?? "").trim(),
                              orcidId: String(entry?.orcidId ?? "").trim(),
                          }
                )
                .filter((entry) => entry.name);
        } catch {
            // Malformed JSON — fall through and treat the value as plain text.
        }
    }

    return raw
        .split(/[,;]/)
        .map((name) => ({ name: name.trim(), organization: "", orcidId: "" }))
        .filter((entry) => entry.name);
}

// Institution names are free text, so the same organization can arrive with
// different case, punctuation, smart quotes or a leading "The". Compare on a
// normalized form rather than the raw string. Titles are matched against the
// printed book the same way, since the book sets them in capitals.
function normalizeText(value) {
    return String(value ?? "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/gu, "")                              // combining diacritics
        .replace(/[\u2018\u2019\u201c\u201d\u201e\u00ab\u00bb]/gu, '"') // smart quotes
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")                              // punctuation -> space
        .trim()
        .replace(/^the\s+/u, "");
}

export const slugify = (value) =>
    String(value ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

// Each topic is a conference session with its own page. Abstracts submitted
// without one still need a session to belong to.
const OTHER_SESSION = "Other contributions";

// Position in the printed book, by registration id first and then by title, for
// an abstract resubmitted under an id the book never saw. Anything the book
// does not contain sorts after it.
const bookPositionById = new Map();
const bookPositionByTitle = new Map();
BOOK_ORDER.forEach(({ ids, title }, position) => {
    for (const id of ids) bookPositionById.set(id, position);
    bookPositionByTitle.set(normalizeText(title), position);
});

function bookPosition(row) {
    return (
        bookPositionById.get(row.id) ??
        bookPositionByTitle.get(normalizeText(row.abstract_title)) ??
        BOOK_ORDER.length
    );
}

const ABSTRACT_COLUMNS = `id, abstract_title, abstract, author, institutions, co_authors, orcidId, topic, type`;

// Only rows marked active and with a usable title are public. Everything else is
// treated as non-existent everywhere, so the list and the detail page agree on
// which abstracts are public.
const PUBLISHED = `active = 1 AND abstract_title IS NOT NULL AND TRIM(abstract_title) <> ''`;

function normalizeRow(row) {
    const coAuthors = parseCoAuthors(row.co_authors);

    // One ordered affiliation list for the whole paper: the submitting author's
    // institution first, then each distinct co-author organization. Authors
    // carry an index into it, the way an abstracts book prints superscripts.
    // Keying on the normalized form collapses "E. O. Paton" and "E.O. Paton".
    const institutionList = [];
    const indexByKey = new Map();

    const addInstitution = (value) => {
        const key = normalizeText(value);
        if (!key) return undefined;
        if (!indexByKey.has(key)) {
            indexByKey.set(key, institutionList.length);
            institutionList.push(String(value).trim());
        }
        return indexByKey.get(key);
    };

    const authorInstitutionIndex = addInstitution(row.institutions);
    const session = row.topic?.trim() || OTHER_SESSION;

    return {
        ...row,
        session,
        sessionSlug: slugify(session),
        co_authors: coAuthors.map((coAuthor) => ({
            ...coAuthor,
            institutionIndex: addInstitution(coAuthor.organization),
        })),
        authorInstitutionIndex,
        institutionList,
        // Everything the co-authors add on top of the submitting author's own
        // institution, which the list view prints after it.
        co_authors_institutions: institutionList.filter(
            (_, index) => index !== authorInstitutionIndex
        ),
    };
}

export const getAbstracts = cache(async () => {
    // The order of the printed abstracts book. It is close to newest first but
    // not quite, so the book decides; the sort is stable, so abstracts it does
    // not contain keep the newest-first order from the query.
    const [rows] = await db.query(
        `SELECT ${ABSTRACT_COLUMNS}
         FROM Registration
         WHERE ${PUBLISHED}
         ORDER BY id DESC`
    );
    return rows
        .sort((a, b) => bookPosition(a) - bookPosition(b))
        .map(normalizeRow);
});

// Grouped on the slug rather than the raw topic, so two spellings of the same
// free-text topic share one page instead of colliding on one URL. Largest
// sessions first; abstracts keep the book order within each.
export const getSessions = cache(async () => {
    const groups = new Map();

    for (const abstract of await getAbstracts()) {
        const slug = abstract.sessionSlug;
        if (!groups.has(slug)) groups.set(slug, { topic: abstract.session, slug, items: [] });
        groups.get(slug).items.push(abstract);
    }

    return [...groups.values()].sort((a, b) => b.items.length - a.items.length);
});

export const getAbstractById = cache(async (id) => {
    // params values are strings; reject anything that is not a plain integer id
    // before it reaches the query.
    const numericId = Number.parseInt(id, 10);
    if (!Number.isInteger(numericId) || String(numericId) !== String(id).trim()) {
        return null;
    }

    const [rows] = await db.query(
        `SELECT ${ABSTRACT_COLUMNS}
         FROM Registration
         WHERE id = ? AND ${PUBLISHED}
         LIMIT 1`,
        [numericId]
    );
    return rows.length > 0 ? normalizeRow(rows[0]) : null;
});
