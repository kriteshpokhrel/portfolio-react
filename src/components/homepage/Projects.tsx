import { RevealOnScroll } from "../RevealOnScroll";
import { Project } from "../interfaces/Project";
const projects: Project[] = [
  {
    title: "Book My Flight",
    description:
      "Flight booking system with secure RESTful APIs, JWT authentication, and Angular frontend. Led a team of 5 from design to deployment.",
    techStack: ["Angular", ".Net Core", "JWT", "REST API"],
    link: "https://github.com/notyetgrounded/FlightBooking",
  },
  {
    title: "SEVA: Secure E-Voting Application",
    description:
      "Blockchain-based e-voting system ensuring secure, anonymous, and tamper-proof voting using Ethereum and Machine Learning.",
    techStack: ["React", "Node.js", "Ethereum", "Solidity", "Truffle", "Ganache"],
    link: "https://github.com/kriteshpokhrel/SEVA-Secure_E-Voting_Appliacation",
  },
  {
    title: "VisionEd",
    description:
      "Android assistant for visually impaired users providing communication, multimedia, and safety features.",
    techStack: ["Java", "Android Studio", "Google Text-to-Speech", "Firebase"],
    link: "https://github.com/kriteshpokhrel/VisionEd",
  },
  {
    title: "SearchTap",
    description:
      "Kid-safe search engine using NLP and keyword filtering to block inappropriate content.",
    techStack: ["Python", "TensorFlow", "Flask", "Firebase"],
    link: "https://github.com/kriteshpokhrel/SearchTap",
  },
  {
    title: "DigiCollege",
    description:
      "Education management platform integrating student records, image recognition, and DBMS principles.",
    techStack: ["Python", "OpenCV", "SQLite", "Tkinter"],
    link: "https://github.com/kriteshpokhrel/DigiCollege",
  },
];

// Reusable Project Card
const ProjectCard = ({ project }: { project: Project }) => (
  <div className="glass p-6 rounded-xl border border-white/10 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)] transition-all">
    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
    <p className="text-gray-400 mb-4">{project.description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {project.techStack.map((tech, key) => (
        <span
          key={key}
          className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm transition hover:bg-blue-500/20 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)]"
        >
          {tech}
        </span>
      ))}
    </div>
    <div className="flex justify-between items-center">
      <a
        href={project.link}
        target="_blank"
        className="text-blue-400 hover:text-blue-300 transition-colors my-4"
      >
        View Project →
      </a>
    </div>
  </div>
);

export const Projects = () => {
  return (
    <section id="projects" className="min-h-screen flex items-center justify-center py-20">
      <RevealOnScroll>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <ProjectCard key={idx} project={project} />
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
