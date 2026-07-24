import React from 'react';
import { Hero } from '../components/Hero/Hero';

interface HomePageProps {
  revealed?: boolean;
}

/**
 * Home page – currently a placeholder.
 * Replace with whatever sections you need (hero, portfolio items, etc.).
 */
export const HomePage: React.FC<HomePageProps> = ({ revealed }) => (
  <Hero revealed={revealed} />
);
