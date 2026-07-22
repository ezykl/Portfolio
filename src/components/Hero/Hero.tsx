import React from 'react';

/**
 * Hero section for the portfolio.
 * Displays a heading and the extracted Framer component (`Me`).
 */
export const Hero: React.FC = () => {
  return (
    <section
      style={{
        padding: '4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h1 style={{ marginBottom: '1rem' }}>Welcome to My Portfolio</h1>
      {/* Replace the src and poster with your real assets when available */}
    </section>
  );
};
