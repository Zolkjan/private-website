import HeroSection from "@/components/HeroSection";
import dynamic from "next/dynamic";

const AboutSection = dynamic(() => import("@/components/AboutSection"));
const SkillsSection = dynamic(() => import("@/components/SkillsSection"));
const ProjectsSection = dynamic(() => import("@/components/ProjectsSection"));
const VideoSection = dynamic(() => import("@/components/video/VideoSection"));
const ProcessSection = dynamic(() => import("@/components/ProcessSection"));
const ContactSection = dynamic(() => import("@/components/ContactSection"));

const MainPage = () => {
  return (
    <main className="flex flex-col w-full">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <VideoSection />
      <SkillsSection />
      <ProcessSection />
      <ContactSection />
    </main>
  );
};

export default MainPage;
