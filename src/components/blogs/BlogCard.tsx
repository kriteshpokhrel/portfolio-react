import { Link } from "react-router-dom";

export default function BlogCard({ post }: any) {
  return (
    <Link
      to={`/blogs/${post.slug}`}
      className="
        relative block rounded-xl overflow-hidden 
        bg-[#1f1f1f] 
        border border-neutral-800 
        hover:border-neutral-600 
        hover:shadow-lg 
        transition
        group
      "
    >
      {/* Image */}
      <div className="w-full aspect-square overflow-hidden relative">
        <img
          src={post.meta.coverImage}
          alt={post.meta.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover overlay: blur + tint */}
        {post.meta.excerpt && (
          <div className="
            absolute inset-0 
            bg-black bg-opacity-50 
            backdrop-blur-sm
            opacity-0 group-hover:opacity-90 
            transition-opacity duration-300
            flex items-center justify-center p-4
          ">
            <p className="text-sm text-neutral-200 line-clamp-5 text-center">
              {post.meta.excerpt}
            </p>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="p-3">
        <h2 className="text-base font-semibold mb-1 text-white line-clamp-2">
          {post.meta.title}
        </h2>
        <p className="text-sm text-neutral-400">
          {new Date(post.meta.date).toDateString()}
        </p>
      </div>
    </Link>
  );
}
