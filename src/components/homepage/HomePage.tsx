import { About } from "./About";
import { Projects } from "./Projects";
import { Contact } from "./Contact";
import { Introduction } from "./Introduction";
import { useState } from "react";
import { LoadingScreen } from "../LoadingScreen";
import { Seo } from "../Seo";
import { siteConfig, absoluteUrl } from "../../utilities/siteConfig";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.author,
  url: siteConfig.url,
  jobTitle: "Full-Stack Software Engineer",
  image: absoluteUrl("/kritesh.jpg"),
  sameAs: [
    "https://github.com/kriteshpokhrel",
    "https://www.linkedin.com/in/kritesh-pokhrel-91b3b4170/",
  ],
};

export const HomePage = () => {
  // Initialize state based on sessionStorage
  const [isLoaded, setIsLoaded] = useState(
    () => !!sessionStorage.getItem("homeLoaded")
  );

  const handleLoadComplete = () => {
    setIsLoaded(true);
    sessionStorage.setItem("homeLoaded", "true");
  };

  return (
    <>
      <Seo path="/" jsonLd={personJsonLd} />
      {!isLoaded && <LoadingScreen onComplete={handleLoadComplete} />}

      <div
        className={`min-h-screen transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"
          } bg-black text-gray-100`}
      >
        <Introduction />
        <About />
        <Projects />
        <Contact />
      </div>
    </>
  );
};
