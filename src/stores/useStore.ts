import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, Frame, Storyboard, StickyNote, CustomImage, CanvasTitle, Shape } from '../types';

const createEmptyStoryboard = (): Storyboard => ({
  id: uuidv4(),
  name: 'Untitled Storyboard',
  title: 'My Storyboard',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  frames: [],
  stickyNotes: [],
  customImages: [],
  canvasTitles: [],
  shapes: [],
});

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      storyboard: createEmptyStoryboard(),
      selectedFrameId: null,
      selectedNoteId: null,
      selectedCustomImageId: null,
      selectedCanvasTitleId: null,
      selectedShapeId: null,
      canvas: {
        zoom: 1,
        panX: 0,
        panY: 0,
      },
      isPanelOpen: true,
      isGenerating: false,

      addFrame: () => {
        const { storyboard, canvas } = get();
        const newOrder = storyboard.frames.length + 1;
        
        const baseX = (-canvas.panX + 400) / canvas.zoom;
        const baseY = (-canvas.panY + 300) / canvas.zoom;
        const offset = storyboard.frames.length * 50;
        
        const newFrame: Frame = {
          id: uuidv4(),
          order: newOrder,
          title: `Frame ${newOrder}`,
          description: '',
          prompt: '',
          promptHistory: [],
          currentPromptIndex: -1,
          images: [],
          currentImageIndex: -1,
          imageStyle: 'natural',
          model: 'flux',
          size: '1024x576',
          x: baseX + offset,
          y: baseY + offset,
          createdAt: Date.now(),
          isGenerating: false,
        };
        
        set({
          storyboard: {
            ...storyboard,
            frames: [...storyboard.frames, newFrame],
            updatedAt: Date.now(),
          },
          selectedFrameId: newFrame.id,
          isPanelOpen: true,
        });
      },

      updateFrame: (id: string, updates: Partial<Frame>) => {
        const { storyboard } = get();
        set({
          storyboard: {
            ...storyboard,
            frames: storyboard.frames.map((frame) =>
              frame.id === id ? { ...frame, ...updates } : frame
            ),
            updatedAt: Date.now(),
          },
        });
      },

      deleteFrame: async (id: string) => {
        const { storyboard, selectedFrameId } = get();
        const frame = storyboard.frames.find(f => f.id === id);
        
        if (frame?.images?.length) {
          const { deleteFrameImages } = await import('../utils/imageStorage');
          await deleteFrameImages(id);
        }
        
        const newFrames = storyboard.frames
          .filter((frame) => frame.id !== id)
          .map((frame, index) => ({ ...frame, order: index + 1 }));
        
        set({
          storyboard: {
            ...storyboard,
            frames: newFrames,
            updatedAt: Date.now(),
          },
          selectedFrameId: selectedFrameId === id ? null : selectedFrameId,
        });
      },

      duplicateFrame: (id: string) => {
        const { storyboard } = get();
        const frameToDuplicate = storyboard.frames.find((f) => f.id === id);
        
        if (!frameToDuplicate) return;

        const newFrame: Frame = {
          ...frameToDuplicate,
          id: uuidv4(),
          order: storyboard.frames.length + 1,
          createdAt: Date.now(),
          promptHistory: [],
          currentPromptIndex: -1,
          images: [],
          currentImageIndex: -1,
          isGenerating: false,
        };

        set({
          storyboard: {
            ...storyboard,
            frames: [...storyboard.frames, newFrame],
            updatedAt: Date.now(),
          },
          selectedFrameId: newFrame.id,
          isPanelOpen: true,
        });
      },

      selectFrame: (id: string | null) => {
        set({ selectedFrameId: id, isPanelOpen: id !== null });
      },

      reorderFrames: (fromIndex: number, toIndex: number) => {
        const { storyboard } = get();
        const frames = [...storyboard.frames];
        const [removed] = frames.splice(fromIndex, 1);
        frames.splice(toIndex, 0, removed);
        
        const reorderedFrames = frames.map((frame, index) => ({
          ...frame,
          order: index + 1,
        }));

        set({
          storyboard: {
            ...storyboard,
            frames: reorderedFrames,
            updatedAt: Date.now(),
          },
        });
      },

      addStickyNote: () => {
        const { storyboard, canvas } = get();
        
        const baseX = (-canvas.panX + 400) / canvas.zoom;
        const baseY = (-canvas.panY + 300) / canvas.zoom;
        const offset = storyboard.stickyNotes.length * 30;
        
        const colors = ['#FFE066', '#FF6B6B', '#4ECDC4', '#95E1D3', '#DDA0DD', '#87CEEB'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newNote: StickyNote = {
          id: uuidv4(),
          text: '',
          color: randomColor,
          x: baseX + offset,
          y: baseY + offset,
          width: 200,
          height: 150,
          createdAt: Date.now(),
        };
        
        set({
          storyboard: {
            ...storyboard,
            stickyNotes: [...storyboard.stickyNotes, newNote],
            updatedAt: Date.now(),
          },
          selectedNoteId: newNote.id,
        });
      },

      updateStickyNote: (id: string, updates: Partial<StickyNote>) => {
        const { storyboard } = get();
        set({
          storyboard: {
            ...storyboard,
            stickyNotes: storyboard.stickyNotes.map((note) =>
              note.id === id ? { ...note, ...updates } : note
            ),
            updatedAt: Date.now(),
          },
        });
      },

      deleteStickyNote: (id: string) => {
        const { storyboard, selectedNoteId } = get();
        set({
          storyboard: {
            ...storyboard,
            stickyNotes: storyboard.stickyNotes.filter((note) => note.id !== id),
            updatedAt: Date.now(),
          },
          selectedNoteId: selectedNoteId === id ? null : selectedNoteId,
        });
      },

      selectNote: (id: string | null) => {
        set({ selectedNoteId: id });
      },

      addCustomImage: async (file: File) => {
        const { storyboard, canvas } = get();
        
        const baseX = (-canvas.panX + 400) / canvas.zoom;
        const baseY = (-canvas.panY + 300) / canvas.zoom;
        const offset = storyboard.customImages.length * 30;
        
        const url = URL.createObjectURL(file);
        
        const img = new Image();
        img.src = url;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        const maxWidth = 400;
        const maxHeight = 300;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }
        
        const newImage: CustomImage = {
          id: uuidv4(),
          url,
          x: baseX + offset,
          y: baseY + offset,
          width,
          height,
          createdAt: Date.now(),
        };
        
        set({
          storyboard: {
            ...storyboard,
            customImages: [...storyboard.customImages, newImage],
            updatedAt: Date.now(),
          },
          selectedCustomImageId: newImage.id,
        });
      },

      updateCustomImage: (id: string, updates: Partial<CustomImage>) => {
        const { storyboard } = get();
        set({
          storyboard: {
            ...storyboard,
            customImages: storyboard.customImages.map((img) =>
              img.id === id ? { ...img, ...updates } : img
            ),
            updatedAt: Date.now(),
          },
        });
      },

      deleteCustomImage: (id: string) => {
        const { storyboard, selectedCustomImageId } = get();
        const image = storyboard.customImages.find((img) => img.id === id);
        if (image) {
          URL.revokeObjectURL(image.url);
        }
        set({
          storyboard: {
            ...storyboard,
            customImages: storyboard.customImages.filter((img) => img.id !== id),
            updatedAt: Date.now(),
          },
          selectedCustomImageId: selectedCustomImageId === id ? null : selectedCustomImageId,
        });
      },

      selectCustomImage: (id: string | null) => {
        set({ selectedCustomImageId: id });
      },

      addCanvasTitle: () => {
        const { storyboard, canvas } = get();
        
        const baseX = (-canvas.panX + 400) / canvas.zoom;
        const baseY = (-canvas.panY + 300) / canvas.zoom;
        const offset = storyboard.canvasTitles.length * 40;
        
        const newTitle: CanvasTitle = {
          id: uuidv4(),
          text: 'New Title',
          x: baseX + offset,
          y: baseY + offset,
          fontSize: 32,
          color: '#F0F6FC',
          createdAt: Date.now(),
        };
        
        set({
          storyboard: {
            ...storyboard,
            canvasTitles: [...storyboard.canvasTitles, newTitle],
            updatedAt: Date.now(),
          },
          selectedCanvasTitleId: newTitle.id,
        });
      },

      updateCanvasTitle: (id: string, updates: Partial<CanvasTitle>) => {
        const { storyboard } = get();
        set({
          storyboard: {
            ...storyboard,
            canvasTitles: storyboard.canvasTitles.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
            updatedAt: Date.now(),
          },
        });
      },

      deleteCanvasTitle: (id: string) => {
        const { storyboard, selectedCanvasTitleId } = get();
        set({
          storyboard: {
            ...storyboard,
            canvasTitles: storyboard.canvasTitles.filter((t) => t.id !== id),
            updatedAt: Date.now(),
          },
          selectedCanvasTitleId: selectedCanvasTitleId === id ? null : selectedCanvasTitleId,
        });
      },

      selectCanvasTitle: (id: string | null) => {
        set({ selectedCanvasTitleId: id });
      },

      addShape: (shapeData) => {
        const { storyboard } = get();
        const newShape: Shape = {
          ...shapeData,
          id: uuidv4(),
          createdAt: Date.now(),
        };
        
        set({
          storyboard: {
            ...storyboard,
            shapes: [...storyboard.shapes, newShape],
            updatedAt: Date.now(),
          },
          selectedShapeId: newShape.id,
        });
      },

      updateShape: (id: string, updates: Partial<Shape>) => {
        const { storyboard } = get();
        set({
          storyboard: {
            ...storyboard,
            shapes: storyboard.shapes.map((s) =>
              s.id === id ? { ...s, ...updates } : s
            ),
            updatedAt: Date.now(),
          },
        });
      },

      deleteShape: (id: string) => {
        const { storyboard, selectedShapeId } = get();
        set({
          storyboard: {
            ...storyboard,
            shapes: storyboard.shapes.filter((s) => s.id !== id),
            updatedAt: Date.now(),
          },
          selectedShapeId: selectedShapeId === id ? null : selectedShapeId,
        });
      },

      selectShape: (id: string | null) => {
        set({ selectedShapeId: id });
      },

      setZoom: (zoom: number) => {
        const clampedZoom = Math.min(Math.max(zoom, 0.1), 4);
        set((state) => ({
          canvas: { ...state.canvas, zoom: clampedZoom },
        }));
      },

      setPan: (x: number, y: number) => {
        set((state) => ({
          canvas: { ...state.canvas, panX: x, panY: y },
        }));
      },

      resetCanvas: () => {
        set({
          canvas: { zoom: 1, panX: 0, panY: 0 },
        });
      },

      togglePanel: (isOpen?: boolean) => {
        set((state) => ({
          isPanelOpen: isOpen !== undefined ? isOpen : !state.isPanelOpen,
        }));
      },

      updateStoryboardTitle: (title: string) => {
        const { storyboard } = get();
        set({
          storyboard: {
            ...storyboard,
            title,
            updatedAt: Date.now(),
          },
        });
      },

      newStoryboard: () => {
        set({
          storyboard: createEmptyStoryboard(),
          selectedFrameId: null,
          selectedNoteId: null,
          selectedCustomImageId: null,
          selectedCanvasTitleId: null,
          selectedShapeId: null,
          canvas: { zoom: 1, panX: 0, panY: 0 },
          isPanelOpen: true,
        });
      },

      exportStoryboard: () => {
        const { storyboard } = get();
        const dataStr = JSON.stringify(storyboard, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${storyboard.name.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },

      importStoryboard: async (file: File) => {
        return new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const imported = JSON.parse(e.target?.result as string);
              if (imported.frames && Array.isArray(imported.frames)) {
                set({
                  storyboard: {
                    ...imported,
                    stickyNotes: imported.stickyNotes || [],
                    customImages: imported.customImages || [],
                    canvasTitles: imported.canvasTitles || [],
                    shapes: imported.shapes || [],
                  },
                  selectedFrameId: null,
                  selectedNoteId: null,
                  selectedCustomImageId: null,
                  selectedCanvasTitleId: null,
                  selectedShapeId: null,
                  canvas: { zoom: 1, panX: 0, panY: 0 },
                  isPanelOpen: false,
                });
                resolve();
              } else {
                reject(new Error('Invalid storyboard format'));
              }
            } catch {
              reject(new Error('Failed to parse JSON file'));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
      },

      generateImage: async (frameId: string) => {
        const { storyboard, updateFrame } = get();
        const frame = storyboard.frames.find((f) => f.id === frameId);
        
        if (!frame || !frame.prompt.trim()) {
          return;
        }

        updateFrame(frameId, { isGenerating: true });

        const { addLog } = await import('../components/DiagnosticConsole/DiagnosticConsole');
        addLog(`Generating image for prompt: "${frame.prompt}"`, 'info');
        
        try {
          const prompt = frame.prompt;
          
          const size = frame.size || '1024x576';
          const [width, height] = size.split('x').map(Number);
          
          const apiKey = localStorage.getItem('pollinations_api_key') || 'sk_bWNYoOsUYNurkLTijxHzhZJpONFQuAwS';
          
          addLog(`Using gen.pollinations.ai with flux model...`, 'info');
          
          const response = await fetch('https://gen.pollinations.ai/v1/images/generations', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              width,
              height,
              nologo: true,
              seed: Math.floor(Math.random() * 1000000),
              model: 'flux',
            }),
          });
          
          if (response.status === 429) {
            addLog('Queue full, waiting 5 seconds...', 'warning');
            await new Promise(resolve => setTimeout(resolve, 5000));
            const retryResponse = await fetch('https://gen.pollinations.ai/v1/images/generations', {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                prompt,
                width,
                height,
                nologo: true,
                seed: Math.floor(Math.random() * 1000000),
                model: 'flux',
              }),
            });
            if (!retryResponse.ok) {
              throw new Error(`Retry failed: ${retryResponse.status}`);
            }
            var responseData = await retryResponse.json();
          } else if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          } else {
            var responseData = await response.json();
          }
          
          if (!responseData.data || !responseData.data[0] || !responseData.data[0].b64_json) {
            addLog(`Error: ${JSON.stringify(responseData)}`, 'error');
            throw new Error('Failed to generate image - no image data received');
          }
          
          const b64Data = responseData.data[0].b64_json;
          const binaryString = atob(b64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const imageBlob = new Blob([bytes], { type: 'image/jpeg' });
          
          addLog(`Success! Got ${imageBlob.size} bytes image`, 'success');
          
          const imageId = uuidv4();
          const { saveImage, blobToDataURL } = await import('../utils/imageStorage');
          await saveImage(frameId, imageId, imageBlob);
          const dataUrl = await blobToDataURL(imageBlob);
          
          const { saveImageToFileSystem, getSavedFolderName } = await import('../utils/imageStorage');
          const folderName = getSavedFolderName();
          
          if (folderName || true) {
            try {
              const fileName = await saveImageToFileSystem(imageBlob, frame.order, imageId);
              addLog(`Saved to "${folderName || 'folder'}": ${fileName}`, 'success');
            } catch (err) {
              addLog(`File save: ${(err as Error).message}`, 'warning');
            }
          }
          
          const promptRevisionId = uuidv4();
          const newPromptRevision = {
            id: promptRevisionId,
            text: frame.prompt,
            style: frame.imageStyle,
            createdAt: Date.now(),
          };
          
          const newImageRevision = {
            id: imageId,
            url: dataUrl,
            promptId: promptRevisionId,
            createdAt: Date.now(),
            storedLocally: true,
          };
          
          const newPromptHistory = [...frame.promptHistory, newPromptRevision];
          const newImages = [...frame.images, newImageRevision];
          
          updateFrame(frameId, { 
            promptHistory: newPromptHistory,
            currentPromptIndex: newPromptHistory.length - 1,
            images: newImages,
            currentImageIndex: newImages.length - 1,
            isGenerating: false 
          });
          
          addLog('Image saved to local storage!', 'success');
        } catch (error) {
          addLog(`Error: ${(error as Error).message}`, 'error');
          console.error('Failed to generate image:', error);
          updateFrame(frameId, { isGenerating: false });
        }
      },

      applyPromptRevision: (frameId: string, promptRevisionIndex: number) => {
        const { storyboard, updateFrame } = get();
        const frame = storyboard.frames.find((f) => f.id === frameId);
        
        if (!frame || promptRevisionIndex < 0 || promptRevisionIndex >= frame.promptHistory.length) {
          return;
        }
        
        const promptRevision = frame.promptHistory[promptRevisionIndex];
        updateFrame(frameId, {
          prompt: promptRevision.text,
          imageStyle: promptRevision.style,
          currentPromptIndex: promptRevisionIndex,
        });
      },

      applyImageFromHistory: (frameId: string, imageRevisionIndex: number) => {
        const { storyboard, updateFrame } = get();
        const frame = storyboard.frames.find((f) => f.id === frameId);
        
        if (!frame || imageRevisionIndex < 0 || imageRevisionIndex >= frame.images.length) {
          return;
        }
        
        const imageRevision = frame.images[imageRevisionIndex];
        const promptRevision = frame.promptHistory.find(p => p.id === imageRevision.promptId);
        
        updateFrame(frameId, {
          currentImageIndex: imageRevisionIndex,
          currentPromptIndex: promptRevision ? frame.promptHistory.indexOf(promptRevision) : -1,
        });
      },

      exportImages: async () => {
        const { exportImagesToFolder } = await import('../utils/imageStorage');
        await exportImagesToFolder();
      },
    }),
    {
      name: 'storyboard-ai-storage',
      partialize: (state) => ({
        storyboard: state.storyboard,
        canvas: state.canvas,
        isPanelOpen: state.isPanelOpen,
      }),
    }
  )
);
