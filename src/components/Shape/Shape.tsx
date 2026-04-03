import { useRef } from 'react';
import { useStore } from '../../stores/useStore';
import type { Shape as ShapeType } from '../../types';
import styles from './Shape.module.css';

interface ShapeProps {
  shape: ShapeType;
  isSelected: boolean;
}

export default function Shape({ shape, isSelected }: ShapeProps) {
  const { selectShape, deleteShape, updateShape } = useStore();
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectShape(shape.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteShape(shape.id);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    resizeStartRef.current = { x: e.clientX, y: e.clientY, width: shape.width, height: shape.height };
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - resizeStartRef.current.x;
      const dy = moveEvent.clientY - resizeStartRef.current.y;
      updateShape(shape.id, { 
        width: Math.max(20, resizeStartRef.current.width + dx),
        height: Math.max(20, resizeStartRef.current.height + dy)
      });
    };
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value, 10);
    if (!isNaN(width) && width > 0) {
      updateShape(shape.id, { width });
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value, 10);
    if (!isNaN(height) && height > 0) {
      updateShape(shape.id, { height });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateShape(shape.id, { color: e.target.value });
  };

  const handleFillOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fillOpacity = parseFloat(e.target.value);
    if (!isNaN(fillOpacity) && fillOpacity >= 0 && fillOpacity <= 1) {
      updateShape(shape.id, { fillOpacity });
    }
  };

  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateShape(shape.id, { borderColor: e.target.value });
  };

  const handleBorderWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const borderWidth = parseInt(e.target.value, 10);
    if (!isNaN(borderWidth) && borderWidth >= 0) {
      updateShape(shape.id, { borderWidth });
    }
  };

  return (
    <div
      className={`${styles.container} ${isSelected ? styles.selected : ''}`}
      style={{
        left: `${shape.x}px`,
        top: `${shape.y}px`,
        width: `${shape.width}px`,
        height: `${shape.height}px`,
        backgroundColor: shape.color,
        opacity: shape.fillOpacity,
        border: `${shape.borderWidth}px solid ${shape.borderColor}`,
      }}
      onClick={handleClick}
    >
      {isSelected && (
        <>
          <button className={styles.deleteBtn} onClick={handleDelete}>×</button>
          <div className={styles.resizeHandle} onMouseDown={handleResizeStart} />
          <div className={styles.controls}>
            <div className={styles.control}>
              <label>W:</label>
              <input type="number" value={shape.width} onChange={handleWidthChange} min={20} onClick={(e) => e.stopPropagation()} />
            </div>
            <div className={styles.control}>
              <label>H:</label>
              <input type="number" value={shape.height} onChange={handleHeightChange} min={20} onClick={(e) => e.stopPropagation()} />
            </div>
            <div className={styles.control}>
              <label>Fill:</label>
              <input type="color" value={shape.color} onChange={handleColorChange} onClick={(e) => e.stopPropagation()} />
            </div>
            <div className={styles.control}>
              <label>Opacity:</label>
              <input type="number" value={shape.fillOpacity} onChange={handleFillOpacityChange} min={0} max={1} step={0.1} onClick={(e) => e.stopPropagation()} />
            </div>
            <div className={styles.control}>
              <label>Border:</label>
              <input type="color" value={shape.borderColor} onChange={handleBorderColorChange} onClick={(e) => e.stopPropagation()} />
            </div>
            <div className={styles.control}>
              <label>B Width:</label>
              <input type="number" value={shape.borderWidth} onChange={handleBorderWidthChange} min={0} onClick={(e) => e.stopPropagation()} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
