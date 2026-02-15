import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found",
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>
        <p className="mb-8 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
