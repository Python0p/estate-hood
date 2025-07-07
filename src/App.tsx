import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ContactUsPage from './pages/ContactUsPage';
import Footer from './components/Footer';
import Layout from './components/Layout';
import MobileSearchPage from './pages/MobileSearchPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/search" element={<MobileSearchPage />} />
        </Routes>
        <Footer />
      </Layout>
    </Router>
  );
};

export default App;
