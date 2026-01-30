import { RevealOnScroll } from "../RevealOnScroll";
import { Summary } from "./Summary";
import { Education } from "./Education";
import { Experience } from "./Experience";

export const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center py-20"
    >
      <RevealOnScroll>
        <div className="max-w-4xl mx-auto px-4">
          <Summary />
          <div className="pt-5 pb-5">
            <Education />
          </div>
          <div className="">
            <Experience />
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
