const eurofinsTechnologies = [
    "Angular",
    "NgRx",
    "TypeScript",
    "PWA",
    "C#",
    ".NET",
    "Microservices",
    "MSSQL",
    "NUnit",
    "Azure DevOps",
];

const quickfoxTechnologies = [
    "C#",
    ".NET",
    "ASP.NET Core",
    "Azure",
    "REST APIs",
    "Microservices",
    "PostgreSQL",
    "Terraform",
    "Azure DevOps",
    "AI Agents",
    "GitHub Copilot",
];

const TimelineItem = ({
    company,
    role,
    duration,
    description,
    technologies,
    isCurrent,
}: {
    company: string;
    role: string;
    duration: string;
    description: string;
    technologies: string[];
    isCurrent?: boolean;
}) => (
    <div className={`relative pl-10 ${isCurrent ? "" : "mt-10"}`}>
        {/* Dot */}
        <div
            className={`absolute left-1 top-2 w-3 h-3 rounded-full 
            ${isCurrent ? "bg-blue-500" : "bg-gray-400"}`}
        />

        <div className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                    <h4 className="font-semibold text-white">
                        {company}
                    </h4>
                    <p className="text-sm text-blue-400">{role}</p>
                </div>
                <span className="text-sm text-gray-400">
                    {duration}
                </span>
            </div>

            <p className="text-gray-300 mt-2 mb-3 leading-relaxed">
                {description}
            </p>

            <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                    <span
                        key={index}
                        className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

export const Experience = () => {
    return (
        <div className="p-6 rounded-xl border border-white/10 hover:-translate-y-1 transition-all">
            <h3 className="text-xl font-bold mb-6">Work Experience</h3>

            <div className="relative mt-10">
                {/* Vertical line */}
                <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-blue-500/60 to-transparent" />

                <div className="space-y-5">
                    {/* QuickFox */}
                    <TimelineItem
                        company="QuickFox Consulting"
                        role="Software Engineer"
                        duration="Dec 2025 - Present"
                        description="Building .NET and ASP.NET Core applications and REST APIs with C#, following Clean Architecture and SOLID principles. Designing cloud-native systems on Azure and building AI coding agents and developer workflows to improve how the team builds and ships software."
                        technologies={quickfoxTechnologies}
                        isCurrent
                    />

                    {/* Eurofins */}
                    <TimelineItem
                        company="Eurofins IT Solutions India Pvt Ltd"
                        role="Software Engineer"
                        duration="Aug 2022 - Sep 2025"
                        description="Worked full-stack on the Off Site Management platform. Built REST APIs and microservices in C# and .NET, and delivered an Angular PWA for offline field sample collection. Optimized the sync and parcel modules, cutting execution times by about 85%."
                        technologies={eurofinsTechnologies}
                    />
                </div>
            </div>
        </div>
    );
};
