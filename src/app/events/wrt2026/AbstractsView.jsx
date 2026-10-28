"use client";

import React from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { fadeIn } from "@/app/utils/motion";

const sessionHref = (slug) => `/events/wrt2026/sessions/${slug}`;

function authorLine(abstract) {
    return [abstract.author, ...abstract.co_authors.map((c) => c.name)]
        .filter(Boolean)
        .join(", ");
}

function institutionLine(abstract) {
    return [abstract.institutions, ...abstract.co_authors_institutions]
        .filter(Boolean)
        .join("; ");
}

const navLinkClass =
    "group flex gap-3 text-sm leading-snug text-gray-600 hover:text-[#288987] aria-[current=page]:font-medium aria-[current=page]:text-[#0b3d3e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#288987]";

function NavItem({ href, label, count, current }) {
    return (
        <li className="relative">
            {current && (
                <span
                    aria-hidden="true"
                    className="absolute -left-[17px] inset-y-0 w-0.5 bg-[#288987]"
                />
            )}
            <Link href={href} aria-current={current ? "page" : undefined} className={navLinkClass}>
                <span className="flex-1">{label}</span>
                <span className="shrink-0 tabular-nums text-gray-400 group-hover:text-[#288987]">
                    {count}
                </span>
            </Link>
        </li>
    );
}

// Serves both the full listing and a single session's page. `sessions` is the
// navigation summary ({ topic, slug, count }); `current` is the session being
// shown, or null on the full listing. `abstracts` arrive in book order.
export default function AbstractsView({ abstracts, sessions, current = null }) {
    const total = sessions.reduce((sum, session) => sum + session.count, 0);

    return (
        <MotionConfig reducedMotion="user">
            <section
                className="font-sans container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24"
                id="abstracts"
            >
                <motion.header
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    animate="show"
                    className="max-w-2xl"
                >
                    {current ? (
                        <>
                            <Link
                                href="/events/wrt2026"
                                className="inline-block text-sm leading-snug text-[#288987] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#288987]"
                            >
                                &larr; All WRT2026 abstracts
                            </Link>
                            <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-[#0b3d3e]">
                                {current.topic}
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                {abstracts.length} {abstracts.length === 1 ? "abstract" : "abstracts"} in
                                this session, in the order of the printed abstracts book.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#0b3d3e]">
                                WRT2026 abstracts
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                {abstracts.length} accepted abstracts, in the order of the printed
                                abstracts book. Each of the {sessions.length} sessions also has its
                                own page.
                            </p>
                        </>
                    )}
                </motion.header>

                <div className="mt-16 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-16">
                    <nav
                        aria-label="Sessions"
                        className="mb-12 lg:mb-0 lg:sticky lg:top-28 lg:self-start"
                    >
                        <h2 className="text-sm font-semibold text-[#0b3d3e]">Sessions</h2>
                        <ul className="mt-4 space-y-2.5 border-l border-[#dbe8e7] pl-4">
                            <NavItem
                                href="/events/wrt2026"
                                label="All abstracts"
                                count={total}
                                current={!current}
                            />
                            {sessions.map(({ topic, slug, count }) => (
                                <NavItem
                                    key={slug}
                                    href={sessionHref(slug)}
                                    label={topic}
                                    count={count}
                                    current={current?.slug === slug}
                                />
                            ))}
                        </ul>
                    </nav>

                    <ol className="min-w-0 border-t-2 border-[#288987]">
                        {abstracts.map((abstract) => (
                            <li
                                key={abstract.id}
                                className="border-t border-[#e6eeed] py-6 first:border-t-0"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                                    <div className="min-w-0 max-w-[68ch]">
                                        <h3 className="text-[1.0625rem] font-medium leading-snug text-[#0b3d3e]">
                                            <Link
                                                href={`/events/wrt2026/abstracts/${abstract.id}`}
                                                className="underline-offset-4 hover:text-[#288987] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#288987]"
                                            >
                                                {abstract.abstract_title}
                                            </Link>
                                        </h3>

                                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                                            {authorLine(abstract)}
                                        </p>

                                        {institutionLine(abstract) && (
                                            <p className="mt-1 text-sm leading-relaxed text-gray-500">
                                                {institutionLine(abstract)}
                                            </p>
                                        )}

                                        {/* On a session page every row would repeat the heading. */}
                                        {!current && (
                                            <p className="mt-2 text-sm leading-snug">
                                                <Link
                                                    href={sessionHref(abstract.sessionSlug)}
                                                    className="text-[#288987] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#288987]"
                                                >
                                                    {abstract.session}
                                                </Link>
                                            </p>
                                        )}
                                    </div>

                                    {abstract.type?.trim() && (
                                        <span className="shrink-0 text-sm text-gray-400 sm:text-right">
                                            {abstract.type}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
        </MotionConfig>
    );
}
