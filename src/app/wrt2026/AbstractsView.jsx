"use client";

import React from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { fadeIn } from "@/app/utils/motion";

const slugify = (value) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

// The conference programme is organised by session, so the topic column is the
// page's structure rather than a label. Largest sessions first.
function groupByTopic(abstracts) {
    const groups = new Map();

    for (const abstract of abstracts) {
        const topic = abstract.topic?.trim() || "Other contributions";
        if (!groups.has(topic)) groups.set(topic, []);
        groups.get(topic).push(abstract);
    }

    return [...groups.entries()]
        .map(([topic, items]) => ({ topic, slug: slugify(topic), items }))
        .sort((a, b) => b.items.length - a.items.length);
}

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

export default function AbstractsView({ abstracts }) {
    const sessions = groupByTopic(abstracts);

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
                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#0b3d3e]">
                        WRT2026 abstracts
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        {abstracts.length} accepted abstracts across {sessions.length}{" "}
                        sessions. Choose a session to jump to it, or read straight through.
                    </p>
                </motion.header>

                <div className="mt-16 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-16">
                    <nav
                        aria-label="Sessions"
                        className="mb-12 lg:mb-0 lg:sticky lg:top-28 lg:self-start"
                    >
                        <h2 className="text-sm font-semibold text-[#0b3d3e]">Sessions</h2>
                        <ul className="mt-4 space-y-2.5 border-l border-[#dbe8e7] pl-4">
                            {sessions.map(({ topic, slug, items }) => (
                                <li key={slug}>
                                    <a
                                        href={`#${slug}`}
                                        className="group flex gap-3 text-sm leading-snug text-gray-600 hover:text-[#288987] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#288987]"
                                    >
                                        <span className="flex-1">{topic}</span>
                                        <span className="shrink-0 tabular-nums text-gray-400 group-hover:text-[#288987]">
                                            {items.length}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="min-w-0 space-y-20">
                        {sessions.map(({ topic, slug, items }) => (
                            <section key={slug} id={slug} aria-labelledby={`${slug}-heading`}>
                                <div className="border-t-2 border-[#288987] pt-4">
                                    <div className="flex items-baseline justify-between gap-6">
                                        <h2
                                            id={`${slug}-heading`}
                                            className="text-xl font-semibold leading-snug text-[#0b3d3e]"
                                        >
                                            {topic}
                                        </h2>
                                        <span className="shrink-0 tabular-nums text-sm text-gray-400">
                                            {items.length}
                                        </span>
                                    </div>
                                </div>

                                <ul>
                                    {items.map((abstract) => (
                                        <li
                                            key={abstract.id}
                                            className="border-t border-[#e6eeed] py-6 first:border-t-0"
                                        >
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                                                <div className="min-w-0 max-w-[68ch]">
                                                    <h3 className="text-[1.0625rem] font-medium leading-snug text-[#0b3d3e]">
                                                        <Link
                                                            href={`/wrt2026/abstracts/${abstract.id}`}
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
                                                </div>

                                                {abstract.type?.trim() && (
                                                    <span className="shrink-0 text-sm text-gray-400 sm:text-right">
                                                        {abstract.type}
                                                    </span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                </div>
            </section>
        </MotionConfig>
    );
}
