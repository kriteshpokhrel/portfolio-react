import { Link } from "react-router-dom";
import { Github, Linkedin, Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 text-gray-400">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <Link to="/" className="font-mono text-lg font-bold text-white">
            kritesh<span className="text-blue-500">.pokhrel</span>
          </Link>
          <p className="text-sm mt-1">
            © {year} Kritesh Pokhrel. All rights reserved.
          </p>
        </div>

        <nav className="flex items-center gap-5" aria-label="Footer social links">
          <a
            href="https://github.com/kriteshpokhrel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-blue-500 transition"
          >
            <Github size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/kritesh-pokhrel-91b3b4170/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-500 transition"
          >
            <Linkedin size={22} />
          </a>
          <a
            href="https://facebook.com/kritesh.pokharel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-500 transition"
          >
            <Facebook size={22} />
          </a>
          <a
            href="https://instagram.com/kritesh_pokharel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-blue-500 transition"
          >
            <Instagram size={22} />
          </a>
        </nav>
      </div>
    </footer>
  );
};
