import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import './HeroSection.css';
import './HeroSectionSkeleton.css';

/**
 * Skeleton placeholder for the home hero — same height/layout so the
 * page doesn't jump when the real hero replaces it.
 */
export const HeroSectionSkeleton = () => {
  return (
    <div className="hero-section hero-section--skeleton" aria-busy="true">
      <div className="hero-section__overlay" />

      <div className="hero-section__content">
        <Skeleton width="60%" height="56px" />
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
          <Skeleton width="100px" height="28px" borderRadius="var(--radius-full)" />
          <Skeleton width="180px" height="20px" />
        </div>
        <div style={{ marginTop: 'var(--space-4)' }}>
          <Skeleton width="80%" height="20px" />
        </div>
        <div style={{ marginTop: 'var(--space-2)' }}>
          <Skeleton width="60%" height="20px" />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <Skeleton width="160px" height="48px" borderRadius="var(--radius-md)" />
          <Skeleton width="160px" height="48px" borderRadius="var(--radius-md)" />
        </div>
      </div>
    </div>
  );
};
