import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface StoryboardImage {
  id: string;
  frameId: string;
  blob: Blob;
  createdAt: number;
}

interface StoryboardDB extends DBSchema {
  images: {
    key: string;
    value: StoryboardImage;
    indexes: { 'by-frame': string };
  };
  settings: {
    key: string;
    value: any;
  };
}

let db: IDBPDatabase<StoryboardDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<StoryboardDB>> {
  if (db) return db;
  
  db = await openDB<StoryboardDB>('storyboard-images', 2, {
    upgrade(database, oldVersion) {
      if (oldVersion < 1) {
        const store = database.createObjectStore('images', { keyPath: 'id' });
        store.createIndex('by-frame', 'frameId');
      }
      if (oldVersion < 2) {
        database.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
  
  return db;
}

export async function saveImage(frameId: string, imageId: string, blob: Blob): Promise<void> {
  const database = await initDB();
  await database.put('images', {
    id: imageId,
    frameId,
    blob,
    createdAt: Date.now(),
  });
}

export async function getImage(imageId: string): Promise<Blob | undefined> {
  const database = await initDB();
  const record = await database.get('images', imageId);
  return record?.blob;
}

export async function getAllFrameImages(frameId: string): Promise<StoryboardImage[]> {
  const database = await initDB();
  return database.getAllFromIndex('images', 'by-frame', frameId);
}

export async function getAllImages(): Promise<StoryboardImage[]> {
  const database = await initDB();
  return database.getAll('images');
}

export async function deleteFrameImages(frameId: string): Promise<void> {
  const database = await initDB();
  const images = await getAllFrameImages(frameId);
  for (const img of images) {
    await database.delete('images', img.id);
  }
}

export async function deleteImage(imageId: string): Promise<void> {
  const database = await initDB();
  await database.delete('images', imageId);
}

export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function loadImageAsBlob(url: string): Promise<Blob> {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(url);
      
      if (response.status === 403 || response.status === 401) {
        console.log('Got 403, trying different approach...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
      }
      
      const blob = await response.blob();
      console.log('Attempt', attempt + 1, '- Got blob:', blob.type, blob.size);
      
      if (blob.type.startsWith('image') && blob.size > 1000) {
        return blob;
      }
      
      if (blob.type === 'text/plain') {
        const text = await blob.text();
        if (text.includes('API key') || text.includes('unauthorized')) {
          console.log('Got auth error:', text.substring(0, 100));
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }
      }
    } catch (err) {
      console.log('Attempt', attempt + 1, '- Error:', err);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Failed to load image after 5 attempts');
}

export async function exportAllImages(): Promise<void> {
  const images = await getAllImages();
  
  if (images.length === 0) {
    alert('No images to export');
    return;
  }

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const url = URL.createObjectURL(img.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image_${i + 1}_${img.frameId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export async function exportImagesToFolder(): Promise<void> {
  const images = await getAllImages();
  
  if (images.length === 0) {
    alert('No images to export');
    return;
  }

  if ('showDirectoryPicker' in window) {
    try {
      const dirHandle = await (window as any).showDirectoryPicker();
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const fileName = `image_${i + 1}_${img.frameId}.png`;
        const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(img.blob);
        await writable.close();
      }
      
      alert(`Successfully exported ${images.length} images to folder`);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Failed to export to folder:', err);
        alert('Failed to export to folder. Downloading files instead...');
        await exportAllImages();
      }
    }
  } else {
    await exportAllImages();
  }
}

let savedFolderHandle: any = null;

export async function saveImageToFileSystem(blob: Blob, frameOrder: number, imageId: string): Promise<string> {
  if (!('showDirectoryPicker' in window)) {
    throw new Error('File System Access API not supported in this browser');
  }
  
  const database = await initDB();
  const settings = await database.get('settings', 'folder');
  
  if (!savedFolderHandle) {
    if (settings?.handle) {
      const permission = await settings.handle.queryPermission({ mode: 'readwrite' });
      if (permission === 'granted') {
        savedFolderHandle = settings.handle;
      } else {
        const request = await settings.handle.requestPermission({ mode: 'readwrite' });
        if (request !== 'granted') {
          throw new Error('Folder permission denied');
        }
        savedFolderHandle = settings.handle;
      }
    }
  }
  
  if (!savedFolderHandle) {
    savedFolderHandle = await (window as any).showDirectoryPicker();
    await database.put('settings', { 
      key: 'folder', 
      handle: savedFolderHandle,
      name: savedFolderHandle.name 
    });
    localStorage.setItem('pollinations_save_folder', savedFolderHandle.name);
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `frame_${String(frameOrder).padStart(3, '0')}_${timestamp}_${imageId.slice(0, 8)}.png`;
  
  const fileHandle = await savedFolderHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
  
  return fileName;
}

export function getSavedFolderName(): string | null {
  return localStorage.getItem('pollinations_save_folder');
}

export async function clearSavedFolder(): Promise<void> {
  savedFolderHandle = null;
  const database = await initDB();
  await database.delete('settings', 'folder');
  localStorage.removeItem('pollinations_save_folder');
}