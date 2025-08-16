import React from 'react';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import AboutUs from '../components/AboutUs';
import ContactForm from '../components/ContactForm';
import TopProjectsShowcase from '../components/TopProjectsShowcase';
import { useEffect } from 'react';

// import Layout from '../components/Layout';




const LandingPage: React.FC = () => {
  useEffect(() => {
  fetch("https://backend-estate-hood.onrender.com/ping")
}, []);

  return (
    <>
      <HeroSection />
      <Services />
      <TopProjectsShowcase />
      <AboutUs />
      <ContactForm />
    </>
  );
};

export default LandingPage;
