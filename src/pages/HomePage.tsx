import React from 'react';
import { ZykCoding } from '../components/ZykCoding/ZykCoding';
import { RoomScene } from '../components/RoomScene/RoomScene';
import { OutsideScene } from '../components/OutsideScene/OutsideScene';

/**
 * Home page – currently a placeholder.
 * Replace with whatever sections you need (hero, portfolio items, etc.).
 */
export const HomePage: React.FC = () => (
  <section style={{ padding: '2rem' }}>
    <h1>Welcome to My Portfolio</h1>
    <p>This is the home page. Add your content here.</p>
    {/* Individual scenes stacked manually */}
    <OutsideScene />
      <RoomScene />
      <ZykCoding />
  </section>
);
