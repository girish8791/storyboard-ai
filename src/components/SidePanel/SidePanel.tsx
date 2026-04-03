import { useStore } from '../../stores/useStore';
import { IMAGE_STYLES, AI_MODELS, IMAGE_SIZES } from '../../types';
import styles from './SidePanel.module.css';

export default function SidePanel() {
  const { 
    storyboard, 
    selectedFrameId, 
    isPanelOpen, 
    updateFrame, 
    deleteFrame,
    generateImage,
    togglePanel,
    applyPromptRevision,
  } = useStore();

  const selectedFrame = storyboard.frames.find(f => f.id === selectedFrameId);

  const currentImage = selectedFrame?.currentImageIndex !== undefined && selectedFrame?.currentImageIndex >= 0 
    ? selectedFrame.images[selectedFrame.currentImageIndex] 
    : null;
  const currentImageUrl = currentImage?.url || null;

  if (!isPanelOpen || !selectedFrame) {
    return (
      <div className={styles.panelCollapsed}>
        <button 
          className={styles.expandBtn}
          onClick={() => togglePanel(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFrame(selectedFrame.id, { title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFrame(selectedFrame.id, { description: e.target.value });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFrame(selectedFrame.id, { prompt: e.target.value });
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFrame(selectedFrame.id, { imageStyle: e.target.value });
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFrame(selectedFrame.id, { model: e.target.value });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFrame(selectedFrame.id, { size: e.target.value });
  };

  const handleGenerate = async () => {
    if (selectedFrame.prompt.trim()) {
      await generateImage(selectedFrame.id);
    }
  };

  const handleDelete = () => {
    deleteFrame(selectedFrame.id);
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Frame #{selectedFrame.order}</h2>
        <button 
          className={styles.closeBtn}
          onClick={() => togglePanel(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"/>
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.input}
            value={selectedFrame.title}
            onChange={handleTitleChange}
            placeholder="Enter frame title..."
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={selectedFrame.description}
            onChange={handleDescriptionChange}
            placeholder="Describe what happens in this frame..."
            rows={4}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.field}>
          <label className={styles.label}>Image Prompt</label>
          <textarea
            className={styles.textarea}
            value={selectedFrame.prompt}
            onChange={handlePromptChange}
            placeholder="Describe the image you want to generate..."
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Model</label>
          <select
            className={styles.select}
            value={selectedFrame.model || 'flux'}
            onChange={handleModelChange}
          >
            {AI_MODELS.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Size</label>
          <select
            className={styles.select}
            value={selectedFrame.size || '1024x576'}
            onChange={handleSizeChange}
          >
            {IMAGE_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Style</label>
          <select
            className={styles.select}
            value={selectedFrame.imageStyle}
            onChange={handleStyleChange}
          >
            {IMAGE_STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          className={styles.generateBtn}
          onClick={handleGenerate}
          disabled={!selectedFrame.prompt.trim() || selectedFrame.isGenerating}
        >
          {selectedFrame.isGenerating ? (
            <>
              <div className={styles.spinner} />
              Generating...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
              </svg>
              Generate Image
            </>
          )}
        </button>

        {selectedFrame.promptHistory.length > 0 && (
          <div className={styles.promptHistorySection}>
            <div className={styles.promptHistoryHeader}>
              <span className={styles.promptHistoryTitle}>Prompt History ({selectedFrame.promptHistory.length})</span>
            </div>
            <div className={styles.promptHistoryList}>
              {selectedFrame.promptHistory.map((prompt, index) => (
                <div 
                  key={prompt.id}
                  className={`${styles.promptHistoryItem} ${index === selectedFrame.currentPromptIndex ? styles.activePrompt : ''}`}
                >
                  <div 
                    className={styles.promptHistoryContent}
                    onClick={() => applyPromptRevision(selectedFrame.id, index)}
                  >
                    <span className={styles.promptIndex}>v{index + 1}</span>
                    <span className={styles.promptText}>{prompt.text.substring(0, 50)}{prompt.text.length > 50 ? '...' : ''}</span>
                    <span className={styles.promptStyle}>{prompt.style}</span>
                  </div>
                  <button 
                    className={styles.editPromptBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newText = prompt.text + ' (edited)';
                      const newHistory = [...selectedFrame.promptHistory];
                      newHistory[index] = { ...prompt, text: newText };
                      updateFrame(selectedFrame.id, { 
                        promptHistory: newHistory,
                        prompt: newText,
                        currentPromptIndex: index
                      });
                    }}
                    title="Edit prompt"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentImageUrl && (
          <div className={styles.imagePreview}>
            {selectedFrame.images.length > 0 && (
              <div className={styles.revisionsList}>
                <div className={styles.revisionsHeader}>
                  <span className={styles.revisionsTitle}>Revisions ({selectedFrame.images.length})</span>
                </div>
                <div className={styles.revisionsGrid}>
                  {selectedFrame.images.map((img, index) => (
                    <button
                      key={img.id}
                      className={`${styles.revisionThumb} ${index === selectedFrame.currentImageIndex ? styles.activeRevision : ''}`}
                      onClick={() => updateFrame(selectedFrame.id, { currentImageIndex: index })}
                    >
                      <img src={img.url} alt={`Revision ${index + 1}`} />
                      <span className={styles.revisionNumber}>{index + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.previewImage}>
              <img src={currentImageUrl} alt={selectedFrame.title} />
            </div>
          </div>
        )}

        <div className={styles.divider} />

        <button 
          className={styles.deleteBtn}
          onClick={handleDelete}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
          Delete Frame
        </button>
      </div>
    </aside>
  );
}
