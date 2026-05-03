import React from 'react';
import { Clapperboard } from 'lucide-react';
import './BrandLoader.css';

/**
 * Branded loading indicator — the FlimFindr clapperboard icon centered
 * inside an animated ring. Use for page-level / Suspense fallbacks where
 * we want a recognizable, on-brand loading moment.
 *
 * Props:
 *   size       'sm' | 'md' | 'lg'   default 'md'
 *   fullScreen boolean              center it in the viewport
 *   label      string               accessible label, default "Loading"
 */
export const BrandLoader = ({
  size = 'md',
  fullScreen = false,
  label = 'Loading',
}) => {
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 36 : 24;

  const loader = (
    <div
      className={`brand-loader brand-loader--${size}`}
      role="status"
      aria-label={label}
    >
      <span className="brand-loader__ring" aria-hidden="true" />
      <span className="brand-loader__ring brand-loader__ring--inner" aria-hidden="true" />
      <Clapperboard
        size={iconSize}
        className="brand-loader__icon"
        aria-hidden="true"
      />
    </div>
  );

  if (!fullScreen) return loader;

  return (
    <div className="brand-loader__fullscreen">
      {loader}
    </div>
  );
};
