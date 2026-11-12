import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import Dock from "@/components/Dock";
import ScrollTop from "@/components/ScrollTop";

export default function Home() {
  return (
    <main>
      <ScrollTop />
      <Hero />
      <Dock />
      <Experience />
      <Projects />
      <About />
      <Footer />
    </main>
  );
}
