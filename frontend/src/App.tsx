import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/landing/LandingPage';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Production } from './pages/Production';
import { WhatIf } from './pages/WhatIf';
import { Methodology } from './pages/Methodology';
import { ModelPerformance } from './pages/ModelPerformance';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Landing page renders completely standalone (own header, no Footer)
  if (currentPath === '/') {
    return <LandingPage navigate={navigate} />;
  }

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/explore':
        return <Explore />;
      case '/production':
        return <Production />;
      case '/what-if':
        return <WhatIf />;
      case '/methodology':
        return <Methodology />;
      case '/model-performance':
      case '/performance':
        return <ModelPerformance />;
      case '/app':
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-900 selection:bg-[#c26d3a] selection:text-white"
      style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
    >
      <Header currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">{renderCurrentPage()}</main>
      <Footer />
    </div>
  );
}
