import React from 'react';
import Navbar, { HashRouter as Router, Routes, Route, useLocation } from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import DesignerPage from './pages/DesignerPage';
import PricingPage from './pages/PricingPage';

// Simple Footer Component
const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-200">
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
      <div className="flex justify-center space-x-6 md:order-2">
        <a href="#" className="text-gray-400 hover:text-gray-500">Privacy</a>
        <a href="#" className="text-gray-400 hover:text-gray-500">Terms</a>
        <a href="#" className="text-gray-400 hover:text-gray-500">Contact</a>
      </div>
      <div className="mt-8 md:mt-0 md:order-1">
        <p className="text-center text-base text-gray-400">
          &copy; 2024 Clo Vsual. University Startup Prototype.
        </p>
      </div>
    </div>
  </footer>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  // Don't show footer on the designer page to maximize workspace
  const showFooter = location.pathname !== '/designer';

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/projects" element={<DashboardPage />} />
          <Route path="/designer" element={<DesignerPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;