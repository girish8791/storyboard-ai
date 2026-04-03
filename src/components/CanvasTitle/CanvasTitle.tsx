import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../stores/useStore';
import type { CanvasTitle as CanvasTitleType } from '../../types';
import styles from './CanvasTitle.module.css';

interface CanvasTitleProps {
  title: CanvasTitleType;
  isSelected: boolean;
  isDragging: boolean;
}

export default function CanvasTitle({ title, isSelected, isDragging }: CanvasTitleProps) {
  const { updateCanvasTitle, deleteCanvasTitle, selectCanvasTitle } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSize, setIsEditingSize] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sizeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditingSize && sizeInputRef.current) {
      sizeInputRef.current.focus();
      sizeInputRef.current.select();
    }
  }, [isEditingSize]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCanvasTitle(title.id, { text: e.target.value });
  };

  const handleTextBlur = () => {
    setIsEditing(false);
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectCanvasTitle(title.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCanvasTitle(title.id);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    if (!isNaN(size) && size > 0) {
      updateCanvasTitle(title.id, { fontSize: size });
    }
  };

  const handleSizeBlur = () => {
    setIsEditingSize(false);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCanvasTitle(title.id, { color: e.target.value });
  };

  return (
    <div
      className={`${styles.container} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      style={{
        left: `${title.x}px`,
        top: `${title.y}px`,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={title.text}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          onKeyDown={handleTextKeyDown}
          className={styles.textInput}
          style={{ fontSize: title.fontSize, color: title.color }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div 
          className={styles.text}
          style={{ fontSize: title.fontSize, color: title.color }}
        >
          {title.text}
        </div>
      )}

      {isSelected && (
        <div className={styles.controls}>
          <button className={styles.deleteBtn} onClick={handleDelete}>×</button>
          
          <div className={styles.sizeControl}>
            <label>Size:</label>
            <input
              ref={sizeInputRef}
              type="number"
              value={title.fontSize}
              onChange={handleSizeChange}
              onBlur={handleSizeBlur}
              onClick={(e) => e.stopPropagation()}
              min={8}
              max={200}
              className={styles.sizeInput}
            />
          </div>
          
          <div className={styles.colorControl}>
            <label>Color:</label>
            <input
              type="color"
              value={title.color}
              onChange={handleColorChange}
              onClick={(e) => e.stopPropagation()}
              className={styles.colorInput}
            />
          </div>
        </div>
      )}
    </div>
  );
}
