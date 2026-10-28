import { notFound } from "next/navigation";
import { getSessions } from "@/app/lib/abstracts";
import AbstractsView from "../../AbstractsView";

export const revalidate = 60;

// Without this the route renders on every request instead of being cached. A
// session that appears after the build is still rendered on its first visit.
export async function generateStaticParams() {
    const sessions = await getSessions();
    return sessions.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const session = (await getSessions()).find((s) => s.slug === slug);

    if (!session) return { title: "Session not found" };

    return {
        title: `${session.topic} — WRT2026`,
        description: `${session.items.length} abstracts presented in the ${session.topic} session of WRT2026.`,
    };
}

export default async function SessionPage({ params }) {
    // params is a Promise in Next 16 and has to be awaited.
    const { slug } = await params;
    const sessions = await getSessions();
    const session = sessions.find((s) => s.slug === slug);

    if (!session) notFound();

    return (
        <AbstractsView
            abstracts={session.items}
            sessions={sessions.map(({ topic, slug, items }) => ({ topic, slug, count: items.length }))}
            current={{ topic: session.topic, slug: session.slug }}
        />
    );
}
