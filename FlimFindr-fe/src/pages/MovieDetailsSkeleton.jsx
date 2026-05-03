import React from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import { PageWrapper } from '../components/layout/PageWrapper';
import './MovieDetails.css';

/**
 * Page-level skeleton for MovieDetails — backdrop hero + poster + info column +
 * cast row, mirroring the real layout to avoid jank when content swaps in.
 */
export const MovieDetailsSkeleton = () => {
  return (
    <>
      {/* Hero backdrop placeholder */}
      <div
        className="movie-details__hero"
        style={{
          background:
            'linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-surface) 100%)',
        }}
        aria-busy="true"
      >
        <div className="movie-details__hero-overlay" />
      </div>

      <PageWrapper maxWidth="content">
        <div className="movie-details__content">
          {/* Header: poster + info column */}
          <div className="movie-details__header">
            <div className="movie-details__poster-wrapper">
              <Skeleton width="100%" height="100%" borderRadius="var(--radius-lg)" />
            </div>

            <div className="movie-details__info">
              <div>
                <Skeleton width="70%" height="48px" />
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <Skeleton width="40%" height="20px" />
                </div>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Skeleton width="80px" height="32px" borderRadius="var(--radius-full)" />
                <Skeleton width="120px" height="20px" />
              </div>

              {/* Genres */}
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <Skeleton width="80px" height="28px" borderRadius="var(--radius-full)" />
                <Skeleton width="100px" height="28px" borderRadius="var(--radius-full)" />
                <Skeleton width="70px" height="28px" borderRadius="var(--radius-full)" />
              </div>

              {/* Detail rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <Skeleton width="200px" height="20px" />
                <Skeleton width="160px" height="20px" />
                <Skeleton width="180px" height="20px" />
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <Skeleton width="100%" height="48px" borderRadius="var(--radius-md)" />
                <Skeleton width="100%" height="48px" borderRadius="var(--radius-md)" />
              </div>
            </div>
          </div>

          {/* Overview section */}
          <section className="movie-details__section">
            <Skeleton width="160px" height="32px" />
            <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Skeleton width="100%" height="20px" />
              <Skeleton width="95%" height="20px" />
              <Skeleton width="98%" height="20px" />
              <Skeleton width="60%" height="20px" />
            </div>
          </section>

          {/* Cast section */}
          <section className="movie-details__section">
            <Skeleton width="100px" height="32px" />
            <div className="movie-details__cast-grid" style={{ marginTop: 'var(--space-6)' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ width: '100%', aspectRatio: '2/3' }}>
                    <Skeleton width="100%" height="100%" borderRadius="var(--radius-lg)" />
                  </div>
                  <Skeleton width="80%" height="16px" />
                  <Skeleton width="60%" height="14px" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </PageWrapper>
    </>
  );
};
