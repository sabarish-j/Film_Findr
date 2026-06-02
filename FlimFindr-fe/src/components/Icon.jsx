import React from 'react';

export const Icon = ({ name, size = 24, color = 'currentColor' }) => {
  const getSvg = () => {
    const svgProps = {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    };

    const icons = {
      movie: (
        <svg {...svgProps}>
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
      ),
      search: (
        <svg {...svgProps}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
      trending: (
        <svg {...svgProps}>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      star: (
        <svg {...svgProps} fill={color} stroke={color}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      upcoming: (
        <svg {...svgProps}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      watchlist: (
        <svg {...svgProps}>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      ),
      check: (
        <svg {...svgProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    };

    return icons[name] || null;
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {getSvg()}
    </span>
  );
};
