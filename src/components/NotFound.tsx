import { Link } from "react-router-dom";
import { Seo } from "./Seo";

export const NotFound = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-black text-gray-100 px-4 text-center">
      <Seo title="Page Not Found" noindex />
      <p className="font-mono text-blue-500 text-6xl font-bold mb-4">404</p>
      <h1 className="text-2xl font-semibold mb-2">This page doesn&apos;t exist</h1>
      <p className="text-gray-400 mb-8 max-w-md">
        The page you&apos;re looking for may have been moved or never existed.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="bg-blue-500 text-white py-2 px-5 rounded font-medium transition hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
        >
          Go Home
        </Link>
        <Link
          to="/blogs"
          className="border border-cyan-400/50 text-cyan-400 py-2 px-5 rounded font-medium transition hover:-translate-y-0.5 hover:bg-cyan-400/10"
        >
          Read the Blog
        </Link>
      </div>
    </section>
  );
};
