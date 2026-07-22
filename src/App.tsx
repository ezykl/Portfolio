import React from 'react';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState<'home' | 'about'>('home');

  // Simulate an async init (e.g., asset preload). Replace with real logic.
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    isLoading ? (
      <LoadingScreen />
    ) : (
      <>
        {/* Simple navigation */}
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
          <button onClick={() => setPage('home')} style={{ marginRight: '1rem' }}>
            Home
          </button>
          <button onClick={() => setPage('about')}>About</button>
          <div className="p-4 bg-indigo-100 rounded-lg shadow-md">
  Tailwind is working!
</div>
        </nav>
        {/* Page rendering */}
        {page === 'home' && <HomePage />}
        {page === 'about' && <AboutPage />}
        
      </>
    )
  );
}

export default App;
