import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowCampWorks from "@/components/HowCampWorks";
import TodaysChallenge from "@/components/TodaysChallenge";
import CreateProject from "@/components/CreateProject";
import CampPath from "@/components/CampPath";
import CampfireCommunity from "@/components/CampfireCommunity";
import ProgressRewards from "@/components/ProgressRewards";
import WhyJoinCamp from "@/components/WhyJoinCamp";
import CampActivities from "@/components/CampActivities";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <HowCampWorks />
      <TodaysChallenge />
      <CreateProject />
      <CampPath />
      <CampfireCommunity />
      <ProgressRewards />
      <WhyJoinCamp />
      <CampActivities />
      <Footer />
    </main>
  );
};

export default Index;
