import React from 'react';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import AboutUs from '../components/AboutUs';
import ContactForm from '../components/ContactForm';
import TopProjectsShowcase from '../components/TopProjectsShowcase';

// import Layout from '../components/Layout';


const LandingPage: React.FC = () => {
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
