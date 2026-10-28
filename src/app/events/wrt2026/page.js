import { getAbstracts, getSessions } from "@/app/lib/abstracts";
import AbstractsView from "./AbstractsView";

// Without this the route is prerendered once at build time and newly submitted
// abstracts never appear. Re-query at most once a minute instead.
export const revalidate = 60;

export default async function AboutConfPage() {
    const [abstracts, sessions] = await Promise.all([getAbstracts(), getSessions()]);

    // The navigation only needs the counts; sending every session's abstracts
    // to the client as well would ship the whole list twice.
    return (
        <AbstractsView
            abstracts={abstracts}
            sessions={sessions.map(({ topic, slug, items }) => ({ topic, slug, count: items.length }))}
        />
    );
}
