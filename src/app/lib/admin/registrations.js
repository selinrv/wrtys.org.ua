import "server-only";
import { db } from "@/app/lib/db";
import { requireSession } from "./session";

// Every column except `password`: the admin screens never read, show or write
// the registrant's own credential.
const COLUMNS = `id, author, email, co_authors, abstract_title, abstract,
                 institutions, type, reg_category, topic, paid, invoiceUrl,
                 orcidId, createdAt`;

// The columns a form submission is allowed to touch, in one place so INSERT and
// UPDATE can never drift apart. `id` and `createdAt` are the database's.
export const WRITABLE_COLUMNS = [
    "author",
    "email",
    "co_authors",
    "abstract_title",
    "abstract",
    "institutions",
    "type",
    "reg_category",
    "topic",
    "paid",
    "invoiceUrl",
    "orcidId",
];

// params and form fields arrive as strings; anything that is not a plain
// integer id is rejected before it reaches a query.
function toId(value) {
    const numericId = Number.parseInt(value, 10);
    if (!Number.isInteger(numericId) || String(numericId) !== String(value).trim()) {
        return null;
    }
    return numericId;
}

export async function listRegistrations({ q = "", topic = "", type = "", paid = "" } = {}) {
    await requireSession();

    const conditions = [];
    const params = [];

    const search = q.trim();
    if (search) {
        const like = `%${search}%`;
        conditions.push(
            `(author LIKE ? OR email LIKE ? OR abstract_title LIKE ? OR institutions LIKE ? OR co_authors LIKE ?)`
        );
        params.push(like, like, like, like, like);
    }
    if (topic) {
        conditions.push("topic = ?");
        params.push(topic);
    }
    if (type) {
        conditions.push("type = ?");
        params.push(type);
    }
    if (paid === "0" || paid === "1") {
        conditions.push("paid = ?");
        params.push(Number(paid));
    }

    const [rows] = await db.query(
        `SELECT ${COLUMNS}
         FROM Registration
         ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
         ORDER BY createdAt DESC`,
        params
    );
    return rows;
}

export async function getRegistration(id) {
    await requireSession();

    const numericId = toId(id);
    if (numericId === null) return null;

    const [rows] = await db.query(
        `SELECT ${COLUMNS} FROM Registration WHERE id = ? LIMIT 1`,
        [numericId]
    );
    return rows[0] ?? null;
}

export async function createRegistration(values) {
    await requireSession();

    const [result] = await db.execute(
        `INSERT INTO Registration (${WRITABLE_COLUMNS.join(", ")})
         VALUES (${WRITABLE_COLUMNS.map(() => "?").join(", ")})`,
        WRITABLE_COLUMNS.map((column) => values[column])
    );
    return result.insertId;
}

export async function updateRegistration(id, values) {
    await requireSession();

    const numericId = toId(id);
    if (numericId === null) return false;

    const [result] = await db.execute(
        `UPDATE Registration
         SET ${WRITABLE_COLUMNS.map((column) => `${column} = ?`).join(", ")}
         WHERE id = ?`,
        [...WRITABLE_COLUMNS.map((column) => values[column]), numericId]
    );
    return result.affectedRows > 0;
}

export async function deleteRegistration(id) {
    await requireSession();

    const numericId = toId(id);
    if (numericId === null) return false;

    const [result] = await db.execute(`DELETE FROM Registration WHERE id = ?`, [
        numericId,
    ]);
    return result.affectedRows > 0;
}

// Topic, type and reg_category are free-text columns in practice, so the form
// offers what the table already contains as suggestions rather than forcing a
// fixed list.
export async function getFieldSuggestions() {
    await requireSession();

    const [rows] = await db.query(
        `SELECT DISTINCT topic, type, reg_category FROM Registration`
    );

    const collect = (key) =>
        [...new Set(rows.map((row) => row[key]).filter((value) => value?.trim()))].sort(
            (a, b) => a.localeCompare(b)
        );

    return {
        topics: collect("topic"),
        types: collect("type"),
        categories: collect("reg_category"),
    };
}
