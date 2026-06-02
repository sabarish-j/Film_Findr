import React from 'react';
import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { RatingBadge } from '../movie/RatingBadge';
import { TMDB_BACKDROP } from '../../constants';
import './HeroSection.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const HeroSection = ({
  movie,
  onPlayClick,
  onDetailsClick,
  isLoading = false,
}) => {
  if (!movie || isLoading) {
    return <div className="hero-section hero-section--loading" />;
  }

  const backdropUrl = `${TMDB_BACKDROP}${movie.backdrop_path}`;
  const genres = movie.genre_ids?.slice(0, 3).join(' • ') || 'N/A';

  return (
    <motion.section
      className="hero-section"
      style={{
        backgroundImage: `url(${backdropUrl})`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Gradient Overlay */}
      <div className="hero-section__overlay" />

      {/* Content */}
      <motion.div
        className="hero-section__content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="hero-section__title" variants={itemVariants}>
          {movie.title || movie.name}
        </motion.h1>

        <motion.div className="hero-section__meta" variants={itemVariants}>
          <RatingBadge rating={movie.vote_average} size="md" />
          <span className="hero-section__genres">{genres}</span>
        </motion.div>

        <motion.p className="hero-section__overview" variants={itemVariants}>
          {movie.overview}
        </motion.p>

        <motion.div className="hero-section__actions" variants={itemVariants}>
          <Button
            variant="primary"
            size="lg"
            icon={<Play size={20} />}
            onClick={onPlayClick}
          >
            Watch Now
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={<Info size={20} />}
            onClick={onDetailsClick}
          >
            More Info
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};
