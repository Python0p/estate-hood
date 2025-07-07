import React from 'react';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import AboutUs from '../components/AboutUs';
import ContactForm from '../components/ContactForm';
// import Layout from '../components/Layout';


const LandingPage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <Services />
      <AboutUs />
      <ContactForm />
    </>
  );
};

export default LandingPage;
