import { About } from "./About";
import { Projects } from "./Projects";
import { Contact } from "./Contact";
import { Introduction } from "./Introduction";
import { useState } from "react";
import { LoadingScreen } from "../LoadingScreen";

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
