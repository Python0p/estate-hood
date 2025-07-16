import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ContactUsPage from './pages/ContactUsPage';
import Footer from './components/Footer';
import Layout from './components/Layout';
import MobileSearchPage from './pages/MobileSearchPage';
import LoginPage from './pages/LoginPage';

import SearchResultsPage from './pages/SearchResultsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';

import SignupPage from './pages/SignupPage';


const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/search" element={<MobileSearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />

          <Route path="/results" element={<SearchResultsPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />


        </Routes>
        <Footer />
      </Layout>
    </Router>
  );
};

export default App;
