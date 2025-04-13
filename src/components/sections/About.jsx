import { RevealOnScroll } from "../RevealOnScroll";

export const About = () => {
  const frontendSkills = ["Angular", "Redux", "PWA", "TypeScript"];
  const eurofinsTechnologies = ["Angular", "C#", "TypeScript", "ASP .Net", "Redux", "Jasmine & Karma", "Service Worker", "Azure", "Octopus Deploy", "Grafana" ];
  const additionalSkills = [
    "React",
    "Next.js",
    "Azure",
    "Octopus Deploy",
    "Python",
    "Java",
    "Firebase",
    "TensorFlow",
    "Data Visualization",
    "SpecFlow",
    'Grafana',
  ];  

  const backendSkills = [
    "C#",
    "ASP .Net",
    "Microservices",
    "MySQL",
    "SQL Server",
  ];

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center py-20"
    >
      <RevealOnScroll>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
            {" "}
            About Me
          </h2>

          <div className="rounded-xl p-8 border-white/10 border hover:-translate-y-1 transition-all">
            <p className="text-gray-300 mb-6">
              Passionate software developer with a strong interest in scalable
              architecture, system design & performance optimization. Skilled in
              full-stack development, automation, and debugging.
              <br />
              Focused on writing clean, maintainable code and continuously
              improving through learning and best practices.
            </p>

            {/* First row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl p-2 hover:-translate-y-1 transition-all">
                <h3 className="text-xl font-bold mb-4"> Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {frontendSkills.map((tech, key) => (
                    <span
                      key={key}
                      className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 
                                    hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition
                    "
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-2 hover:-translate-y-1 transition-all">
                <h3 className="text-xl font-bold mb-4"> Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {backendSkills.map((tech, key) => (
                    <span
                      key={key}
                      className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 
                                    hover:shadow-[0_2px_8px_rgba(59,130,2246,0.2)] transition
                    "
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Download Resume */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="rounded-xl p-2 hover:-translate-y-1 transition-all">
                <h3 className="text-xl font-bold mb-4"> Additional Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {additionalSkills.map((tech, key) => (
                    <span
                      key={key}
                      className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 
                    hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition
                    "
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-10">
              <a
                href="/Kritesh-Pokhrel_Resume.pdf"
                download
                className="bg-blue-500 text-white py-2 px-6 rounded font-medium transition hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              >
                Download Resume
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-xl border-white/10 border hover:-translate-y-1 transition-all">
              <h3 className="text-xl font-bold mb-4"> 🏫 Education </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  <strong> B.S. in Computer Science </strong> - Visvesvaraya
                  Technological University (2018-2022)
                </li>
                <li>
                  Relevant Coursework: Data Structures, Web Development, Machine
                  Learning & AI, Cloud Computing...
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border-white/10 border hover:-translate-y-1 transition-all">
              <h3 className="text-xl font-bold mb-4"> 💼 Work Experience </h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-semibold">
                    {" "}
                    Software Engineer at Eurofins IT Solutions India Pvt Ltd.
                    (2022 - Present){" "}
                  </h4>
                  <p>
                    <br />
                    Full-stack developer for the Off-site Management project,
                    building a PWA for field operators and robust backend
                    APIs/microservices.
                  </p>
                </div>
                <div className="grid grid-cols-1 ">
                  <div className="rounded-xl p-1 hover:-translate-y-1 transition-all">
                    <h4 className="text-xl font-bold mb-3">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {eurofinsTechnologies.map((tech, key) => (
                        <span
                          key={key}
                          className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 
                                    hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition
                    "
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
