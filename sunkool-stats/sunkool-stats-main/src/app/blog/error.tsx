"use client";

import Link from "next/link";

export default function BlogError() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-4">The Journal</p>
      <h1 className="headline mb-4 text-3xl text-white">Something went wrong loading this page.</h1>
      <p className="mb-8 max-w-md text-white">
        Please try again in a moment, or head back to the homepage.
      </p>
      <Link href="/" className="rounded-full bg-electric px-6 py-3 text-sm font-medium text-black">
        Back to home
      </Link>
    </div>
  );
}
