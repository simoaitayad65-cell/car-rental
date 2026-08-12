import Hero from "../components/home/Hero";
import PopularCars from "../components/home/PopularCars";
import WhyUs from "../components/home/WhyUs";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularCars />
      <WhyUs />
      <HowItWorks />
      <Testimonials />
    </>
  );
}
