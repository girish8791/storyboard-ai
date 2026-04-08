import { useStore } from '../../stores/useStore';
import type { CustomImage as CustomImageType } from '../../types';
import styles from './CustomImage.module.css';

interface CustomImageProps {
  image: CustomImageType;
  isSelected: boolean;
  isDragging: boolean;
}

export default function CustomImage({ image, isSelected, isDragging }: CustomImageProps) {
  const { selectCustomImage, deleteCustomImage, updateCustomImage } = useStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectCustomImage(image.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomImage(image.id);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = image.width;
    const startHeight = image.height;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(50, startHeight + (moveEvent.clientY - startY));
      updateCustomImage(image.id, { width: newWidth, height: newHeight });
    };
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`${styles.container} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      style={{
        left: `${image.x}px`,
        top: `${image.y}px`,
        width: `${image.width}px`,
        height: `${image.height}px`,
      }}
      onClick={handleClick}
    >
      <img src={image.url} alt="Custom" className={styles.image} draggable={false} />
      
      {isSelected && (
        <>
          <button className={styles.deleteBtn} onClick={handleDelete}>×</button>
          <div className={styles.resizeHandle} onMouseDown={handleResizeStart} />
        </>
      )}
    </div>
  );
}
