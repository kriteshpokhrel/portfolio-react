const frontendSkills = ["React", "Angular", "NgRx", "TypeScript", "JavaScript", "HTML", "CSS"];
const additionalSkills = [
    "Microsoft Azure",
    "Azure DevOps",
    "Terraform",
    "PowerShell",
    "CI/CD",
    "Infrastructure as Code",
    "Grafana",
    "Octopus Deploy",
    "AI Agents",
    "LLMs",
    "MCP",
    "GitHub Copilot",
    "Claude",
    "Ollama",
  ];

const backendSkills = [
    "C#",
    "ASP.NET Core",
    "REST APIs",
    "Microservices",
    "PostgreSQL",
    "MSSQL",
    "SQL",
  ];

export const Summary = () => {
    return (<>
    <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
            {" "}
            About Me
          </h2>

          <div className="rounded-xl p-8 border-white/10 border hover:-translate-y-1 transition-all">
            <p className="text-gray-300 mb-6">
              I&apos;m a software engineer with 4 years of experience in .NET, cloud
              modernization, and cloud-native development on Azure. I build scalable
              back-end services with C#, ASP.NET Core, REST APIs, and microservices,
              and front ends with React and Angular.
              <br />
              Lately I&apos;ve been working a lot with AI agents and LLM-based tools to
              improve how our team builds and ships software.
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
                                    hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition
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
                <h3 className="text-xl font-bold mb-4"> Cloud, DevOps & AI</h3>
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
                href="/Kritesh-Pokhrel-Resume.pdf"
                download
                className="bg-blue-500 text-white py-2 px-6 rounded font-medium transition hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              >
                Download Resume
              </a>
            </div>
          </div>
    </>);
}