export interface PromptRevision {
  id: string;
  text: string;
  style: string;
  createdAt: number;
}

export interface ImageRevision {
  id: string;
  url: string;
  promptId?: string;
  createdAt: number;
  storedLocally: boolean;
}

export interface Frame {
  id: string;
  order: number;
  title: string;
  description: string;
  prompt: string;
  promptHistory: PromptRevision[];
  currentPromptIndex: number;
  images: ImageRevision[];
  currentImageIndex: number;
  imageStyle: string;
  model: string;
  size: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  createdAt: number;
  isGenerating?: boolean;
}

export interface StickyNote {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  createdAt: number;
}

export interface CustomImage {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  createdAt: number;
}

export interface CanvasTitle {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  createdAt: number;
}

export interface Shape {
  id: string;
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fillOpacity: number;
  borderColor: string;
  borderWidth: number;
  createdAt: number;
}

export interface Storyboard {
  id: string;
  name: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  frames: Frame[];
  stickyNotes: StickyNote[];
  customImages: CustomImage[];
  canvasTitles: CanvasTitle[];
  shapes: Shape[];
}

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
}

export interface AppState {
  storyboard: Storyboard;
  selectedFrameId: string | null;
  selectedNoteId: string | null;
  selectedCustomImageId: string | null;
  canvas: CanvasState;
  isPanelOpen: boolean;
  isGenerating: boolean;
  
  // Actions
  addFrame: () => void;
  updateFrame: (id: string, updates: Partial<Frame>) => void;
  deleteFrame: (id: string) => void;
  duplicateFrame: (id: string) => void;
  selectFrame: (id: string | null) => void;
  reorderFrames: (fromIndex: number, toIndex: number) => void;
  
  // Sticky notes
  addStickyNote: () => void;
  updateStickyNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteStickyNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  
  // Custom images
  addCustomImage: (file: File) => Promise<void>;
  updateCustomImage: (id: string, updates: Partial<CustomImage>) => void;
  deleteCustomImage: (id: string) => void;
  selectCustomImage: (id: string | null) => void;
  
  // Canvas titles
  addCanvasTitle: () => void;
  updateCanvasTitle: (id: string, updates: Partial<CanvasTitle>) => void;
  deleteCanvasTitle: (id: string) => void;
  selectCanvasTitle: (id: string | null) => void;
  selectedCanvasTitleId: string | null;
  
  // Shapes
  addShape: (shape: Omit<Shape, 'id' | 'createdAt'>) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  deleteShape: (id: string) => void;
  selectShape: (id: string | null) => void;
  selectedShapeId: string | null;
  
  // Canvas actions
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetCanvas: () => void;
  
  // Panel actions
  togglePanel: (isOpen?: boolean) => void;
  
  // Storyboard
  updateStoryboardTitle: (title: string) => void;
  newStoryboard: () => void;
  exportStoryboard: () => void;
  importStoryboard: (file: File) => Promise<void>;
  
  // Generation
  generateImage: (frameId: string) => Promise<void>;
  
  // Image export
  exportImages: () => Promise<void>;
  
  // External helpers
  applyPromptRevision: (frameId: string, promptRevisionIndex: number) => void;
  applyImageFromHistory: (frameId: string, imageRevisionIndex: number) => void;
}

export const IMAGE_STYLES = [
  { value: 'natural', label: 'Natural' },
  { value: 'anime', label: 'Anime' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'painting', label: 'Painting' },
  { value: 'digital-art', label: 'Digital Art' },
  { value: 'photographic', label: 'Photographic' },
];

export const AI_MODELS = [
  { value: 'flux', label: 'Flux' },
];

export const IMAGE_SIZES = [
  { value: '1024x576', label: '16:9 (1024x576)' },
  { value: '768x768', label: 'Square (768x768)' },
  { value: '576x1024', label: 'Portrait (576x1024)' },
];
