import { useRef, useState } from 'react';
import { useStore } from '../../stores/useStore';
import { zoomToPercent, clamp } from '../../utils/helpers';
import SettingsModal from '../SettingsModal/SettingsModal';
import styles from './Header.module.css';

interface HeaderProps {
  onImport: (file: File) => void;
}

export default function Header({ onImport }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const { 
    storyboard, 
    canvas, 
    setZoom, 
    resetCanvas, 
    exportStoryboard,
    newStoryboard,
    exportImages,
    updateStoryboardTitle,
  } = useStore();

  const handleZoomIn = () => {
    const newZoom = clamp(canvas.zoom + 0.1, 0.1, 4);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = clamp(canvas.zoom - 0.1, 0.1, 4);
    setZoom(newZoom);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setZoom(clamp(value / 100, 0.1, 4));
    }
  };

  const handleFitToView = () => {
    resetCanvas();
  };

  const handleExport = () => {
    exportStoryboard();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStoryboardTitle(e.target.value);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>
          <span className={styles.logo}>🎬</span>
          StoryBoard AI
        </h1>
        <input
          type="text"
          className={styles.titleInput}
          value={storyboard.title}
          onChange={handleTitleChange}
          placeholder="Enter project title..."
        />
      </div>
      
      <div className={styles.center}>
        <div className={styles.zoomControls}>
          <button 
            className={styles.zoomBtn} 
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            −
          </button>
          <input
            type="number"
            className={styles.zoomInput}
            value={zoomToPercent(canvas.zoom)}
            onChange={handleZoomChange}
            min={10}
            max={400}
          />
          <span className={styles.zoomPercent}>%</span>
          <button 
            className={styles.zoomBtn} 
            onClick={handleZoomIn}
            title="Zoom In"
          >
            +
          </button>
          <button 
            className={styles.fitBtn}
            onClick={handleFitToView}
            title="Fit to View"
          >
            ⟲ Fit
          </button>
        </div>
      </div>
      
      <div className={styles.right}>
        <button className={styles.actionBtn} onClick={() => setShowSettings(true)} title="Settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Settings
        </button>
        <button className={styles.actionBtn} onClick={newStoryboard} title="New Storyboard (Ctrl+N)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          New
        </button>
        <button className={styles.actionBtn} onClick={handleImportClick} title="Import JSON">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Import
        </button>
        <button className={styles.actionBtn} onClick={exportImages} title="Export All Images">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
          Export Images
        </button>
        <button className={styles.actionBtnPrimary} onClick={handleExport} title="Export JSON (Ctrl+S)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </header>
  );
}
