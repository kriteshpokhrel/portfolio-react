import { RevealOnScroll } from "../RevealOnScroll";

export const Introduction = () => {
    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center relative px-4 py-20"
        >
            <RevealOnScroll>
                <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto">
                    {/* Text Section */}
                    <div className="text-center z-10 flex-1 md:pl-[100px] order-2 md:order-1">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent leading-tight">
                            Hi, I&apos;m Kritesh Pokhrel
                        </h1>

                        <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                            I&apos;m a full-stack developer who loves crafting clean, scalable web
                            applications. My goal is to build solutions that offer both
                            exceptional performance and a delightful user experience.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3">
                            <a
                                href="#projects"
                                className="bg-blue-500 text-white py-2 px-4 sm:py-3 sm:px-6 rounded font-medium text-sm sm:text-base transition hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                            >
                                View Projects
                            </a>

                            <a
                                href="#contact"
                                className="border border-blue-500/50 text-blue-500 py-2 px-4 sm:py-3 sm:px-6 rounded font-medium text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:bg-blue-500/10"
                            >
                                Contact Me
                            </a>

                            <a
                                href="/blogs"
                                className="border border-cyan-400/50 text-cyan-400 py-2 px-4 sm:py-3 sm:px-6 rounded font-medium text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:bg-cyan-400/10"
                            >
                                Read my stuffs ✍️
                            </a>
                        </div>

                    </div>

                    {/* Image Section */}
                    <div className="flex-1 flex justify-center mb-8 md:mb-0 order-1 md:order-2">
                        <img
                            src="/kritesh.jpg"
                            alt="Kritesh Pokhrel"
                            className="w-48 h-48 md:w-90 md:h-90 rounded-full object-cover shadow-lg"
                        />
                    </div>
                </div>
            </RevealOnScroll>
        </section>)
};