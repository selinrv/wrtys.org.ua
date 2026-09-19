import { getAbstracts } from "@/app/lib/abstracts";
import AbstractsView from "./AbstractsView";

// Without this the route is prerendered once at build time and newly submitted
// abstracts never appear. Re-query at most once a minute instead.
export const revalidate = 60;

export default async function AboutConfPage() {
    const abstracts = await getAbstracts();
    return <AbstractsView abstracts={abstracts} />;
}
