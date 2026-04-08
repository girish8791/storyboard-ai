import { useRef } from 'react';
import { useStore } from '../../stores/useStore';
import styles from './Toolbar.module.css';

export default function Toolbar() {
  const { 
    addFrame, 
    deleteFrame, 
    duplicateFrame, 
    selectedFrameId, 
    storyboard,
    reorderFrames,
    addStickyNote,
    addCustomImage,
    addCanvasTitle,
    addShape,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedFrame = storyboard.frames.find(f => f.id === selectedFrameId);
  const selectedIndex = selectedFrame ? storyboard.frames.indexOf(selectedFrame) : -1;

  const handleMoveUp = () => {
    if (selectedIndex > 0) {
      reorderFrames(selectedIndex, selectedIndex - 1);
    }
  };

  const handleMoveDown = () => {
    if (selectedIndex < storyboard.frames.length - 1) {
      reorderFrames(selectedIndex, selectedIndex + 1);
    }
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (const file of files) {
        await addCustomImage(file);
      }
      e.target.value = '';
    }
  };

  return (
    <div className={styles.toolbar}>
      <button 
        className={styles.toolBtn}
        onClick={addFrame}
        title="Add Frame (Ctrl+Shift+N)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        <span>Add Frame</span>
      </button>

      <button 
        className={styles.toolBtn}
        onClick={addStickyNote}
        title="Add Sticky Note"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <span>Add Note</span>
      </button>

      <button 
        className={styles.toolBtn}
        onClick={handleAddImage}
        title="Add Custom Image"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
        <span>Add Image</span>
      </button>

      <button 
        className={styles.toolBtn}
        onClick={addCanvasTitle}
        title="Add Canvas Title"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4,7 4,4 20,4 20,7"/>
          <line x1="9" y1="20" x2="15" y2="20"/>
          <line x1="12" y1="4" x2="12" y2="20"/>
        </svg>
        <span>Add Title</span>
      </button>

      <button 
        className={styles.toolBtn}
        onClick={() => addShape({
          type: 'rectangle',
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          color: '#21262D',
          fillOpacity: 0.3,
          borderColor: '#58A6FF',
          borderWidth: 2,
        })}
        title="Add Rectangle"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        </svg>
        <span>Add Box</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className={styles.divider} />

      <button 
        className={styles.toolBtn}
        onClick={() => selectedFrameId && duplicateFrame(selectedFrameId)}
        disabled={!selectedFrameId}
        title="Duplicate Frame"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <span>Duplicate</span>
      </button>

      <button 
        className={styles.toolBtn}
        onClick={handleMoveUp}
        disabled={selectedIndex <= 0}
        title="Move Up"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18,15 12,9 6,15"/>
        </svg>
      </button>

      <button 
        className={styles.toolBtn}
        onClick={handleMoveDown}
        disabled={selectedIndex < 0 || selectedIndex >= storyboard.frames.length - 1}
        title="Move Down"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>

      <div className={styles.divider} />

      <button 
        className={`${styles.toolBtn} ${styles.danger}`}
        onClick={() => selectedFrameId && deleteFrame(selectedFrameId)}
        disabled={!selectedFrameId}
        title="Delete Frame (Del)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3,6 5,6 21,6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
        <span>Delete</span>
      </button>
    </div>
  );
}
