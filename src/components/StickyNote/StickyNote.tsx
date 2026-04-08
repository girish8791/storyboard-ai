import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../stores/useStore';
import type { StickyNote as StickyNoteType } from '../../types';
import styles from './StickyNote.module.css';

interface StickyNoteProps {
  note: StickyNoteType;
  isSelected: boolean;
  isDragging: boolean;
}

export default function StickyNote({ note, isSelected, isDragging }: StickyNoteProps) {
  const { updateStickyNote, selectNote, deleteStickyNote } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateStickyNote(note.id, { text: e.target.value });
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteStickyNote(note.id);
  };

  return (
    <div
      className={`${styles.note} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
      style={{
        left: `${note.x}px`,
        top: `${note.y}px`,
        width: `${note.width}px`,
        height: `${note.height}px`,
        backgroundColor: note.color,
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectNote(note.id);
      }}
      onDoubleClick={handleDoubleClick}
    >
      <div className={styles.header}>
        <button className={styles.deleteBtn} onClick={handleDelete}>×</button>
      </div>
      
      {isEditing || note.text ? (
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={note.text}
          onChange={handleTextChange}
          onBlur={handleBlur}
          placeholder="Type here..."
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className={styles.placeholder} onClick={() => setIsEditing(true)}>
          Double-click to edit
        </div>
      )}
    </div>
  );
}
