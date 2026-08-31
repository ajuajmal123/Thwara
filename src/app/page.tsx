import Hero from "@/components/home/Hero";
import Featured from "@/components/home/Featured";
import LatestArticles from "@/components/home/LatestArticles";
import FormsSection from "@/components/home/FormsSection";
import MeaningSection from "@/components/home/MeaningSection";
import AboutPreview from "@/components/home/AboutPreview";
import ContributorsPreview from "@/components/home/ContributorsPreview";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <LatestArticles />
      <FormsSection />
      <MeaningSection />
      <AboutPreview />
      <ContributorsPreview />
      <Newsletter />
    </>
  );
}
