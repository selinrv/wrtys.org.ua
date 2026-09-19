export const metadata = {
    title: "WRT2026 admin",
    // Nothing here should ever turn up in a search result.
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
    // pt-28 clears the site navbar, which the root layout renders on every route.
    return (
        <div className="font-sans container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
            {children}
        </div>
    );
}
