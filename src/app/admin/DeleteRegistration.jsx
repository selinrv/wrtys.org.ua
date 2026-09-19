import { removeRegistration } from "./actions";

// A <details> disclosure rather than a client-side confirm step, so deleting
// still works with JavaScript off, like the other forms in the admin area.
export default function DeleteRegistration({ id, label }) {
    return (
        <details className="group">
            <summary className="inline-flex cursor-pointer list-none items-center rounded-md border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50 group-open:bg-red-50">
                Delete registration
            </summary>

            <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">
                    Delete <strong>{label}</strong> permanently? The wrt2026.com.ua
                    registration app reads this same row, and there is no undo.
                </p>
                <form action={removeRegistration} className="mt-3">
                    <input type="hidden" name="id" value={id} />
                    <button
                        type="submit"
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Yes, delete it
                    </button>
                </form>
            </div>
        </details>
    );
}
