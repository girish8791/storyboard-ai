import { useState, useEffect } from 'react';
import { getSavedFolderName, clearSavedFolder } from '../../utils/imageStorage';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [folderName, setFolderName] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('pollinations_api_key');
    if (stored) {
      setApiKey(stored);
    }
    setFolderName(getSavedFolderName());
  }, []);

  const handleSave = () => {
    localStorage.setItem('pollinations_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('pollinations_api_key');
    setApiKey('');
  };

  const handleClearFolder = async () => {
    await clearSavedFolder();
    setFolderName(null);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>⚙️ Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.field}>
            <label className={styles.label}>Image Archive Folder</label>
            <div className={styles.folderRow}>
              <span className={`${styles.folderPath} ${!folderName ? styles.noFolder : ''}`}>
                {folderName || 'No folder selected'}
              </span>
              {folderName && (
                <button className={styles.clearFolderBtn} onClick={handleClearFolder}>
                  Clear
                </button>
              )}
            </div>
            <p className={styles.hint}>
              All generated images are automatically saved to this folder
            </p>
          </div>

          <div className={styles.divider} />

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Pollinations API Key</label>
              <span className={styles.statusBadge}>✓ Pre-configured</span>
            </div>
            <input
              type="password"
              className={styles.input}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk_..."
            />
            <p className={styles.hint}>
              Custom API key (optional). A default key is pre-configured.
            </p>
          </div>

          <div className={styles.buttons}>
            <button className={styles.clearBtn} onClick={handleClearApiKey}>
              Clear API Key
            </button>
            <button className={styles.saveBtn} onClick={handleSave}>
              {saved ? '✓ Saved!' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}