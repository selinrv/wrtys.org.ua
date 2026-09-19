import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NGO 'WRTYS'",
  description: "Website of NGO WRTYSp",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (Grammarly, password
          managers, dark-mode tools) inject attributes into <body> before
          React hydrates, which React reports as an attribute mismatch.
          This suppresses it for <body> only, not its children. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
      <main className="relative min-h-screen overflow-x-clip">
        <div
            className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
        <div className="overflow-clip">
          <Navbar/>
          {children}
        </div>
      </main>
      </body>
    </html>
);
}
