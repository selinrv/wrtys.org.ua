import LoginForm from "./LoginForm";

export const metadata = {
    title: "Sign in — WRT2026 admin",
    robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }) {
    // searchParams is a Promise in Next 16 and has to be awaited.
    const { next = "" } = await searchParams;
    return <LoginForm next={next} />;
}
