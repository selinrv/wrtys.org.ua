import Link from "next/link";
import { notFound } from "next/navigation";
import { getAbstractById } from "@/app/lib/abstracts";

export const revalidate = 60;

export async function generateMetadata({ params }) {
    const { id } = await params;
    const abstract = await getAbstractById(id);

    if (!abstract) return { title: "Abstract not found" };

    const summary = abstract.abstract?.trim().replace(/\s+/g, " ") ?? "";

    return {
        title: `${abstract.abstract_title} — WRT2026`,
        description: summary.length > 180 ? `${summary.slice(0, 177)}…` : summary,
    };
}

export default async function AbstractPage({ params }) {
    // params is a Promise in Next 16 and has to be awaited.
    const { id } = await params;
    const abstract = await getAbstractById(id);

    if (!abstract) notFound();

    const authors = [
        {
            name: abstract.author,
            orcidId: abstract.orcidId,
            institutionIndex: abstract.authorInstitutionIndex,
        },
        ...abstract.co_authors,
    ].filter((author) => author.name);

    // Bodies delimit paragraphs inconsistently: 69 use a single newline, 18 use
    // a blank line, 37 have none. Split on any run of newlines so all three
    // render with the same paragraph spacing.
    const paragraphs = (abstract.abstract ?? "")
        .split(/\s*\n\s*/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    // Superscripts only earn their place when there is more than one
    // affiliation to tell apart.
    const showAffiliations = abstract.institutionList.length > 1;
    const backHref = abstract.topicSlug
        ? `/wrt2026#${abstract.topicSlug}`
        : "/wrt2026";

    return (
        <article className="font-sans container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
            <div className="max-w-[70ch]">
                <Link
                    href={backHref}
                    className="inline-block text-sm leading-snug text-[#288987] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#288987]"
                >
                    &larr; {abstract.topic?.trim() || "All abstracts"}
                </Link>

                <h1 className="mt-6 text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-[#0b3d3e]">
                    {abstract.abstract_title}
                </h1>

                <p className="mt-6 text-base leading-relaxed text-gray-800">
                    {authors.map((author, index) => (
                        <span key={`${author.name}-${index}`}>
                            {index > 0 && ", "}
                            {author.name}
                            {showAffiliations && author.institutionIndex !== undefined && (
                                <sup className="ml-0.5 text-[0.7em] text-[#288987]">
                                    {author.institutionIndex + 1}
                                </sup>
                            )}
                            {author.orcidId && (
                                <a
                                    href={`https://orcid.org/${author.orcidId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`ORCID ${author.orcidId}`}
                                    className="ml-1 text-xs text-gray-400 underline-offset-4 hover:text-[#288987] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#288987]"
                                >
                                    <img className="orcidImg" src="/assets/orcid.svg" /> {author.orcidId}
                                </a>
                            )}
                        </span>
                    ))}
                </p>

                {abstract.institutionList.length > 0 && (
                    <ol className="mt-3 space-y-1 text-sm leading-relaxed text-gray-500">
                        {abstract.institutionList.map((institution, index) => (
                            <li key={institution} className="flex gap-2">
                                {showAffiliations && (
                                    <span className="shrink-0 tabular-nums text-[#288987]">
                                        {index + 1}
                                    </span>
                                )}
                                <span>{institution}</span>
                            </li>
                        ))}
                    </ol>
                )}

                {abstract.type?.trim() && (
                    <p className="mt-6 text-sm text-gray-400">{abstract.type}</p>
                )}

                {paragraphs.length > 0 && (
                    <div className="mt-10 border-t-2 border-[#288987] pt-10">
                        <div className="space-y-5 text-[1.0625rem] leading-[1.75] text-gray-800">
                            {paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-16 border-t border-[#e6eeed] pt-6">
                    <Link
                        href={backHref}
                        className="text-sm text-[#288987] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#288987]"
                    >
                        &larr; {abstract.topic?.trim() || "All abstracts"}
                    </Link>
                </div>
            </div>
        </article>
    );
}
