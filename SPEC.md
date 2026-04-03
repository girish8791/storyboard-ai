# StoryBoard AI - Specification Document

## 1. Project Overview

**Project Name:** StoryBoard AI  
**Type:** Web Application (Desktop-first)  
**Core Functionality:** A visual storyboard planning application with an infinite canvas, AI image generation via Pollinations API, support for sticky notes, custom images, canvas titles, and shape boxes for organizing content.
**Target Users:** Content creators, filmmakers, video producers, writers, and anyone needing visual story planning with AI-generated imagery.

---

## 2. UI/UX Specification

### 2.1 Layout Structure

**Main Layout:**
- **Header Bar** (60px height): App title, project title input, zoom controls, export/import buttons
- **Toolbar** (left side): Tools for adding frames, notes, images, titles, shapes
- **Canvas Area** (main area): Infinite pannable/zoomable dashboard
- **Side Panel** (right side, 320px width, collapsible): Frame editor for selected frame

### 2.2 Visual Design

**Color Palette:**
- Primary Background: `#0D1117` (deep dark)
- Secondary Background: `#161B22` (card/panel background)
- Tertiary Background: `#21262D` (hover states, inputs)
- Accent Primary: `#58A6FF` (buttons, links, highlights)
- Accent Secondary: `#F78166` (warning, delete actions)
- Accent Success: `#3FB950` (success states, generate button)
- Text Primary: `#F0F6FC`
- Text Secondary: `#8B949E`
- Text Muted: `#6E7681`
- Border: `#30363D`

**Typography:**
- Font Family: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- Heading Large: 24px, weight 600
- Heading Medium: 18px, weight 600
- Body: 14px, weight 400
- Small/Caption: 12px, weight 400

**Spacing System:**
- Base unit: 4px
- XS: 4px, S: 8px, M: 16px, L: 24px, XL: 32px, XXL: 48px

### 2.3 Components

**Frame Card:**
- Size: 280px width, variable height
- Contains: Frame number, title, image area
- States: Default, Hover, Selected (blue border), Generating (spinner)

**Toolbar Buttons:**
- Add Frame - Add new AI-generated frame
- Add Note - Add sticky note
- Add Image - Upload custom images (multiple)
- Add Title - Add floating text title
- Add Box - Add rectangle shape
- Delete, Duplicate, Reorder controls

**Zoom Controls:**
- Zoom in/out buttons (+/-)
- Zoom percentage input
- Fit to view button

---

## 3. Functional Specification

### 3.1 Core Features

**Infinite Canvas:**
- Pan: Click and drag on empty canvas area
- Zoom: Mouse wheel or zoom controls
- Zoom range: 10% to 400%

**AI Image Generation (Pollinations Flux):**
- Input: Text prompt per frame
- Model: Flux (default)
- Output: Display generated image in frame
- Regenerate: Replace existing image with new generation

**Sticky Notes:**
- Add colorful sticky notes
- Edit text (double-click)
- Random colors from preset palette
- Drag to position

**Custom Images:**
- Upload multiple images at once
- Drag to position
- Resize with corner handle
- Delete

**Canvas Titles:**
- Add floating text titles anywhere
- Edit text (double-click)
- Customize font size (8-200px)
- Customize text color
- Drag to position

**Shape Boxes:**
- Add rectangle shapes
- Customize fill color
- Adjust opacity (0-1)
- Customize border color and width
- Resize with corner handle or exact dimensions
- Drag to position

**Data Persistence:**
- Auto-save to localStorage
- Manual export to JSON file
- Import from JSON

### 3.2 User Interactions

**Adding Items:**
- Click toolbar buttons to add frames, notes, images, titles, shapes
- New items appear staggered on canvas
- Items can be dragged anywhere

**Selecting Items:**
- Click on any item to select
- Selected items show controls
- Click empty canvas to deselect

**Moving Items:**
- Drag any item to reposition on canvas

---

## 4. Technical Architecture

**Stack:**
- Frontend: React 18 + TypeScript
- Build: Vite
- State: Zustand (persist middleware)
- Styling: CSS Modules
- Storage: localStorage + File System Access API

**Pollinations API:**
- Endpoint: `https://gen.pollinations.ai/v1/images/generations` (OpenAI-compatible)
- Method: POST with JSON body
- Model: flux (default)
- Authentication: Bearer token in Authorization header

---

## 5. Acceptance Criteria

1. ✅ User can add, edit, delete, and reorder story frames
2. ✅ Canvas pans smoothly with click-drag
3. ✅ Zoom works via mouse wheel and toolbar controls (10%-400%)
4. ✅ Pollinations AI generates images from text prompts using Flux model
5. ✅ Frames display images
6. ✅ Data persists across browser refresh (localStorage)
7. ✅ Export/Import JSON functionality works
8. ✅ Sticky notes can be added, edited, and positioned
9. ✅ Custom images can be uploaded and positioned
10. ✅ Canvas titles can be added with custom font size and color
11. ✅ Shape boxes can be added with custom fill, opacity, and borders

---

## 6. File Structure

```
storyboard-ai/
├── src/
│   ├── components/
│   │   ├── Canvas/
│   │   ├── FrameCard/
│   │   ├── StickyNote/
│   │   ├── CustomImage/
│   │   ├── CanvasTitle/
│   │   ├── Shape/
│   │   ├── SidePanel/
│   │   ├── Toolbar/
│   │   ├── Header/
│   │   └── SettingsModal/
│   ├── stores/
│   │   └── useStore.ts
│   ├── utils/
│   │   └── imageStorage.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── SPEC.md
└── README.md
```
