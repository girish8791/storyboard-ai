import { useEffect, useCallback } from 'react';
import { inject } from '@vercel/analytics';
import { useStore } from './stores/useStore';
import Header from './components/Header/Header';
import Toolbar from './components/Toolbar/Toolbar';
import Canvas from './components/Canvas/Canvas';
import SidePanel from './components/SidePanel/SidePanel';
import DiagnosticConsole from './components/DiagnosticConsole/DiagnosticConsole';
import styles from './App.module.css';

inject();

function App() {
  const { 
    addFrame, 
    deleteFrame, 
    selectedFrameId, 
    newStoryboard, 
    exportStoryboard,
    importStoryboard 
  } = useStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+N: New storyboard
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      newStoryboard();
    }
    
    // Ctrl+S: Export storyboard
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      exportStoryboard();
    }
    
    // Ctrl+Shift+N: Add new frame
    if (e.ctrlKey && e.shiftKey && e.key === 'N') {
      e.preventDefault();
      addFrame();
    }
    
    // Delete/Backspace: Delete selected frame
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedFrameId) {
      // Only delete if not focused on an input
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        deleteFrame(selectedFrameId);
      }
    }
  }, [addFrame, deleteFrame, selectedFrameId, newStoryboard, exportStoryboard]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleImport = useCallback(async (file: File) => {
    try {
      await importStoryboard(file);
    } catch (error) {
      console.error('Import failed:', error);
    }
  }, [importStoryboard]);

  return (
    <div className={styles.app}>
      <Header onImport={handleImport} />
      <div className={styles.main}>
        <Toolbar />
        <Canvas />
        <SidePanel />
      </div>
      <DiagnosticConsole />
    </div>
  );
}

export default App;
