import { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../stores/useStore';
import FrameCard from '../FrameCard/FrameCard';
import StickyNote from '../StickyNote/StickyNote';
import CustomImageComponent from '../CustomImage/CustomImage';
import CanvasTitleComponent from '../CanvasTitle/CanvasTitle';
import ShapeComponent from '../Shape/Shape';
import styles from './Canvas.module.css';

interface ProjectTitleProps {
  title: string;
  onChange: (title: string) => void;
}

function ProjectTitle({ title, onChange }: ProjectTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setValue(title);
  }, [title]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setValue(title);
      setIsEditing(false);
    }
  };

  return (
    <div className={styles.projectTitle} onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={styles.titleInput}
        />
      ) : (
        <h2 className={styles.titleText}>{title || 'Double-click to add title'}</h2>
      )}
    </div>
  );
}

export default function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingItem, setDraggingItem] = useState<{ id: string; type: 'frame' | 'note' | 'image' | 'title' | 'shape'; } | null>(null);
  
  const draggingItemRef = useRef<{ id: string; type: 'frame' | 'note' | 'image' | 'title' | 'shape'; } | null>(null);
  const itemDragStartRef = useRef({ x: 0, y: 0, itemX: 0, itemY: 0 });

  const { 
    storyboard, 
    canvas, 
    setPan, 
    setZoom, 
    selectFrame,
    selectedFrameId,
    updateFrame,
    selectedNoteId,
    selectNote,
    updateStickyNote,
    selectedCustomImageId,
    selectCustomImage,
    updateCustomImage,
    updateStoryboardTitle,
    selectedCanvasTitleId,
    selectCanvasTitle,
    updateCanvasTitle,
    selectedShapeId,
    selectShape,
    updateShape,
  } = useStore();

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggingItemRef.current) {
        const dx = (e.clientX - itemDragStartRef.current.x) / canvas.zoom;
        const dy = (e.clientY - itemDragStartRef.current.y) / canvas.zoom;
        const newX = itemDragStartRef.current.itemX + dx;
        const newY = itemDragStartRef.current.itemY + dy;
        
        const item = draggingItemRef.current;
        if (item.type === 'frame') {
          updateFrame(item.id, { x: newX, y: newY });
        } else if (item.type === 'note') {
          updateStickyNote(item.id, { x: newX, y: newY });
        } else if (item.type === 'image') {
          updateCustomImage(item.id, { x: newX, y: newY });
        } else if (item.type === 'title') {
          updateCanvasTitle(item.id, { x: newX, y: newY });
        } else if (item.type === 'shape') {
          updateShape(item.id, { x: newX, y: newY });
        }
      }
    };

    const handleGlobalMouseUp = () => {
      draggingItemRef.current = null;
      setDraggingItem(null);
      setIsPanning(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [canvas.zoom, updateFrame, updateStickyNote, updateCustomImage, updateCanvasTitle, updateShape]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains(styles.grid)) {
      if (e.button === 0 || e.button === 1) {
        setIsPanning(true);
        setDragStart({ x: e.clientX - canvas.panX, y: e.clientY - canvas.panY });
      }
    }
  }, [canvas.panX, canvas.panY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPan(newX, newY);
    }
  }, [isPanning, dragStart, setPan]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.min(Math.max(canvas.zoom + delta, 0.1), 4);
    setZoom(newZoom);
  }, [canvas.zoom, setZoom]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains(styles.grid)) {
      selectFrame(null);
      selectNote(null);
      selectCustomImage(null);
      selectCanvasTitle(null);
      selectShape(null);
    }
  }, [selectFrame, selectNote, selectCustomImage, selectCanvasTitle, selectShape]);

  const handleFrameMouseDown = useCallback((e: React.MouseEvent, frameId: string, frameX: number, frameY: number) => {
    e.preventDefault();
    draggingItemRef.current = { id: frameId, type: 'frame' };
    itemDragStartRef.current = { x: e.clientX, y: e.clientY, itemX: frameX, itemY: frameY };
    setDraggingItem({ id: frameId, type: 'frame' });
  }, []);

  const handleNoteMouseDown = useCallback((e: React.MouseEvent, noteId: string, noteX: number, noteY: number) => {
    e.preventDefault();
    draggingItemRef.current = { id: noteId, type: 'note' };
    itemDragStartRef.current = { x: e.clientX, y: e.clientY, itemX: noteX, itemY: noteY };
    setDraggingItem({ id: noteId, type: 'note' });
  }, []);

  const handleImageMouseDown = useCallback((e: React.MouseEvent, imageId: string, imageX: number, imageY: number) => {
    e.preventDefault();
    draggingItemRef.current = { id: imageId, type: 'image' };
    itemDragStartRef.current = { x: e.clientX, y: e.clientY, itemX: imageX, itemY: imageY };
    setDraggingItem({ id: imageId, type: 'image' });
  }, []);

  const handleTitleMouseDown = useCallback((e: React.MouseEvent, titleId: string, titleX: number, titleY: number) => {
    e.preventDefault();
    draggingItemRef.current = { id: titleId, type: 'title' };
    itemDragStartRef.current = { x: e.clientX, y: e.clientY, itemX: titleX, itemY: titleY };
    setDraggingItem({ id: titleId, type: 'title' });
  }, []);

  const handleShapeMouseDown = useCallback((e: React.MouseEvent, shapeId: string, shapeX: number, shapeY: number) => {
    e.preventDefault();
    draggingItemRef.current = { id: shapeId, type: 'shape' };
    itemDragStartRef.current = { x: e.clientX, y: e.clientY, itemX: shapeX, itemY: shapeY };
    setDraggingItem({ id: shapeId, type: 'shape' });
  }, []);

  const gridStyle = {
    backgroundSize: `${20 * canvas.zoom}px ${20 * canvas.zoom}px`,
    backgroundPosition: `${canvas.panX % (20 * canvas.zoom)}px ${canvas.panY % (20 * canvas.zoom)}px`,
  };

  return (
    <div className={styles.canvasContainer}>
      <div
        ref={canvasRef}
        className={styles.canvas}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div className={styles.grid} style={gridStyle} />
        
        <div 
          className={styles.framesContainer}
          style={{
            transform: `translate(${canvas.panX}px, ${canvas.panY}px) scale(${canvas.zoom})`,
            transformOrigin: '0 0',
          }}
        >
          <ProjectTitle 
            title={storyboard.title} 
            onChange={updateStoryboardTitle} 
          />

          {storyboard.frames.map((frame) => (
            <div
              key={frame.id}
              className={`${styles.frameWrapper} ${draggingItem?.id === frame.id ? styles.dragging : ''}`}
              style={{
                left: `${frame.x}px`,
                top: `${frame.y}px`,
              }}
              onMouseDown={(e) => handleFrameMouseDown(e, frame.id, frame.x, frame.y)}
            >
              <FrameCard
                frame={frame}
                isSelected={selectedFrameId === frame.id}
                isDragging={draggingItem?.id === frame.id}
              />
            </div>
          ))}

          {storyboard.stickyNotes.map((note) => (
            <div
              key={note.id}
              className={styles.itemWrapper}
              style={{
                left: `${note.x}px`,
                top: `${note.y}px`,
              }}
              onMouseDown={(e) => handleNoteMouseDown(e, note.id, note.x, note.y)}
            >
              <StickyNote
                note={note}
                isSelected={selectedNoteId === note.id}
                isDragging={draggingItem?.id === note.id}
              />
            </div>
          ))}

          {storyboard.customImages.map((image) => (
            <div
              key={image.id}
              className={styles.itemWrapper}
              style={{
                left: `${image.x}px`,
                top: `${image.y}px`,
              }}
              onMouseDown={(e) => handleImageMouseDown(e, image.id, image.x, image.y)}
            >
              <CustomImageComponent
                image={image}
                isSelected={selectedCustomImageId === image.id}
                isDragging={draggingItem?.id === image.id}
              />
            </div>
          ))}

          {storyboard.canvasTitles.map((title) => (
            <div
              key={title.id}
              className={styles.itemWrapper}
              style={{
                left: `${title.x}px`,
                top: `${title.y}px`,
              }}
              onMouseDown={(e) => handleTitleMouseDown(e, title.id, title.x, title.y)}
            >
              <CanvasTitleComponent
                title={title}
                isSelected={selectedCanvasTitleId === title.id}
                isDragging={draggingItem?.id === title.id}
              />
            </div>
          ))}

          {storyboard.shapes.map((shape) => (
            <div
              key={shape.id}
              className={styles.itemWrapper}
              style={{
                left: `${shape.x}px`,
                top: `${shape.y}px`,
              }}
              onMouseDown={(e) => handleShapeMouseDown(e, shape.id, shape.x, shape.y)}
            >
              <ShapeComponent
                shape={shape}
                isSelected={selectedShapeId === shape.id}
              />
            </div>
          ))}
        </div>

        {storyboard.frames.length === 0 && storyboard.stickyNotes.length === 0 && storyboard.customImages.length === 0 && storyboard.canvasTitles.length === 0 && storyboard.shapes.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎬</div>
            <h3>No items yet</h3>
            <p>Click "Add Frame" or "Add Note" to start</p>
            <p className={styles.hint}>Drag items to position them anywhere</p>
          </div>
        )}
        
        <div className={styles.instructions}>
          <span>🖱️ Drag empty space to pan</span>
          <span>🔍 Scroll to zoom</span>
          <span>📦 Drag items to move</span>
        </div>
      </div>
    </div>
  );
}
