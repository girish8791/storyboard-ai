# StoryBoard AI

A visual storyboard planning application with AI image generation, featuring an infinite canvas with drag-and-drop positioning for frames, sticky notes, custom images, text titles, and shape boxes.

![StoryBoard AI](./screenshot.png)

## Features

### 🖼️ Infinite Canvas
- **Pan** - Click and drag on empty space to pan around
- **Zoom** - Scroll to zoom (10% - 400%)
- **Drag to Position** - Move any item anywhere on the canvas

### 🤖 AI Image Generation
- **Pollinations AI** - Generate images from text prompts using Flux model
- **Auto-Save** - Images can auto-save to a selected folder on your computer
- **Revision History** - All generated images are stored locally

### 📦 Items You Can Add

| Item | Description |
|------|-------------|
| **Frames** | AI-generated images with prompt history |
| **Sticky Notes** | Colored notes with editable text |
| **Custom Images** | Upload your own images (multiple at once) |
| **Titles** | Floating text with custom font size & color |
| **Boxes** | Rectangle shapes with customizable fill, opacity & borders |

### 💾 Data Management
- **Auto-Save** - Work is automatically saved to localStorage
- **Export JSON** - Save entire storyboard to file
- **Import JSON** - Load existing storyboards

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Usage

### Adding Items
1. Use the toolbar buttons to add frames, notes, images, titles, or boxes
2. New items appear on the canvas
3. Drag to position anywhere

### Generating AI Images
1. Click "Add Frame" in toolbar
2. Enter a prompt in the side panel
3. Click "Generate Image"
4. Image generates and displays in the frame

### Customizing Items
- **Sticky Notes** - Double-click to edit text
- **Canvas Titles** - Double-click to edit text, select to change size/color
- **Shape Boxes** - Select to show controls for fill, opacity, borders
- **Custom Images** - Select to resize or delete

### Controls
- **🖱️ Drag empty space** - Pan the canvas
- **🔍 Scroll** - Zoom in/out  
- **📦 Drag items** - Move any item on canvas

## Keyboard Shortcuts

- `Ctrl+Shift+N` - Add new frame (when focused)
- `Delete` - Delete selected item
- `Ctrl+S` - Export JSON
- Arrow Keys - Pan canvas

## Tech Stack

- React 18 + TypeScript
- Vite
- Zustand (state management with persist)
- CSS Modules
- Pollinations AI API (Flux model)

## API Configuration

The app comes pre-configured with a Pollinations API key. You can change it in Settings (gear icon in header).

To get your own API key:
1. Visit [https://pollinations.ai](https://pollinations.ai)
2. Create an account
3. Get your API key from your profile

## License

MIT
