import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CompanyLogo from "./components/CompanyLogo";
import PurposeSection from "./components/PurposeSection";
import FeaturesSection from "./components/FeaturesSection";
import ScheduleSection from "./components/ScheduleSection";
import MonitorSection from "./components/MonitorSection";
import NewsletterSection from "./components/NewsletterSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
      <>
          <Hero />
          <CompanyLogo />
          <PurposeSection />
          <FeaturesSection />
          <ScheduleSection />
          <MonitorSection />

          {/*<TestimonialsSection />*/}
          <NewsletterSection />
          <Footer />
      </>
  )
}
