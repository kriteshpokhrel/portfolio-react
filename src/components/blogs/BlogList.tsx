import { usePosts } from "../../utilities/MarkdownImport";
import BlogCard from "./BlogCard";

export default function BlogList() {
  const posts = usePosts();

  return (
    <section className="min-h-screen flex justify-center py-24 bg-black text-white">
      <div className="w-full max-w-[75%]">

        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-base sm:text-sm md:text-base font-semibold mb-1 text-white line-clamp-2">
            Blog Space
          </h2>
          <p className="text-neutral-400 text-lg max-w-3xl mx-auto">
            I write about ideas, insights, and anything that sparks my curiosity.
          </p>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-neutral-700 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post: any) => (
            <div
              key={post.slug}
              className="transition-all duration-300 hover:scale-105 hover:translate-y-[-4px]"
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
