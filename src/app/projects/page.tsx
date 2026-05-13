import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ProjectsClient from "@/components/ProjectsClient";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Projects — DESIGN NADEUL",
  description: "Browse all interior design projects by DESIGN NADEUL",
};

export default function ProjectsPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <ProjectsClient />
      <Footer />
    </>
  );
}
