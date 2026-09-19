import Link from "next/link";
import { getFieldSuggestions } from "@/app/lib/admin/registrations";
import RegistrationForm from "../RegistrationForm";

export const metadata = {
    title: "New registration — WRT2026 admin",
    robots: { index: false, follow: false },
};

export default async function NewRegistrationPage() {
    // Checks the session before anything renders.
    const suggestions = await getFieldSuggestions();

    return (
        <div className="max-w-4xl">
            <Link
                href="/admin"
                className="text-sm text-[#288987] underline-offset-4 hover:underline"
            >
                &larr; All registrations
            </Link>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#0b3d3e]">
                New registration
            </h1>

            <RegistrationForm registration={null} coAuthors={[]} suggestions={suggestions} />
        </div>
    );
}
