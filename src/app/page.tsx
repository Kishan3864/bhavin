import { Cursor } from "@/components/chrome/Cursor";
import { Grain, Vignette } from "@/components/chrome/Grain";
import { Navigation } from "@/components/chrome/Navigation";
import { SmoothScroll } from "@/components/chrome/SmoothScroll";
import { About } from "@/components/sections/About";
import { Apps } from "@/components/sections/Apps";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Expertise } from "@/components/sections/Expertise";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Metrics } from "@/components/sections/Metrics";
import { Process } from "@/components/sections/Process";
import { Stack } from "@/components/sections/Stack";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <Vignette />
      <Grain />
      <Cursor />
      <Navigation />

      <main id="main" className="relative z-[2]">
        <Hero />
        <Metrics />
        <About />
        <Expertise />
        <Stack />
        <Apps />
        <Experience />
        <Process />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
