import { useState } from 'react';
import { useStore } from '../../stores/useStore';
import type { Frame } from '../../types';
import styles from './FrameCard.module.css';

interface FrameCardProps {
  frame: Frame;
  isSelected: boolean;
  isDragging: boolean;
}

export default function FrameCard({ frame, isSelected, isDragging }: FrameCardProps) {
  const { selectFrame, generateImage } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentImage = frame.currentImageIndex >= 0 ? frame.images[frame.currentImageIndex] : null;
  const currentImageUrl = currentImage?.url || null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectFrame(frame.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectFrame(frame.id);
  };

  const handleGenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (frame.prompt.trim()) {
      await generateImage(frame.id);
    }
  };

  const handleImageError = () => {
    setImageLoaded(true);
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered && !isSelected ? 'scale(1.02)' : undefined,
      }}
    >
      <div className={styles.header}>
        <span className={styles.frameNumber}>#{frame.order}</span>
        <span className={styles.title}>{frame.title}</span>
      </div>

      <div 
        className={`${styles.imageArea} ${frame.isGenerating ? styles.generating : ''}`}
        onClick={handleClick}
      >
        {currentImageUrl ? (
          <>
            {!imageLoaded && (
              <div className={styles.imageLoading}>
                <div className={styles.spinner} />
              </div>
            )}
            <img 
              src={currentImageUrl} 
              alt={frame.title}
              className={`${styles.image} ${imageLoaded ? styles.loaded : ''}`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
            {frame.images.length > 1 && (
              <div className={styles.revisionCount}>
                {frame.images.length} revisions
              </div>
            )}
          </>
        ) : frame.isGenerating ? (
          <div className={styles.generatingState}>
            <div className={styles.spinner} />
            <span>Generating...</span>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <span>No image</span>
            {frame.prompt && (
              <button 
                className={styles.generateBtn}
                onClick={handleGenerate}
              >
                Generate
              </button>
            )}
          </div>
        )}
      </div>

      {frame.description && (
        <div className={styles.description}>
          {frame.description}
        </div>
      )}
    </div>
  );
}
