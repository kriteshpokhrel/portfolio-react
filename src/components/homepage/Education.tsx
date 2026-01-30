export const Education = () => {
    const skills = [
        "Data Structures",
        "Web Development",
        "Cloud Computing",
        "Machine Learning & AI",
        "Software Architecture",
    ];

    return (
        <div className="p-6 rounded-xl border-white/10 border hover:-translate-y-1 transition-all">
            <h3 className="text-xl font-bold mb-4">🏫 Education</h3>

            {/* Degree section */}
            <div className="mb-3">
                <h4 className="text-lg font-semibold text-white">
                    B.E. in Computer Science & Engineering
                </h4>
                    <p className="text-sm text-blue-400">
                        Visvesvaraya Technological University | 2018–2022
                    </p>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed mb-3">
                Gained strong foundations in algorithms, data structures, web development,
                cloud computing, and machine learning. Completed projects involving full-stack
                development and modern software architectures.
            </p>

            {/* Skill badges */}
            <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, idx) => (
                    <span
                        key={idx}
                        className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs hover:bg-blue-500/20 transition"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
};
